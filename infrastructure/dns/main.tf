# ---------------------------------------------------------------------------------------------------------------------
# DNS Zones
# We only need one record for both uat and prod sites
# they can share the certificate.
# ---------------------------------------------------------------------------------------------------------------------

# Once this zone has been created, use the nameservers in the console and transfer
# ownership to aws (and me)
resource "aws_route53_zone" "covidstats" {
  name = "covidstats.uk"

  tags = merge(local.common_tags, {
    Name = "${local.prefix}-hosted-zone"
  })
}

# Allow routing to the main website bucket.
resource "aws_route53_record" "covidstats_main" {
  name = "covidstats.uk"
  type = "A"
  zone_id = aws_route53_zone.covidstats.zone_id

  alias {
    evaluate_target_health = false
    name = data.terraform_remote_state.s3.outputs.website_domain
    zone_id = data.terraform_remote_state.s3.outputs.website_hosted_zone_id
  }
}

# Redirect from www to non-www site.
resource "aws_route53_record" "covidstats_www_redirect" {
  name = "www.covidstats.uk"
  type = "A"
  zone_id = aws_route53_zone.covidstats.zone_id

  alias {
    evaluate_target_health = false
    name = data.terraform_remote_state.s3.outputs.redirect_www_website_domain
    zone_id = data.terraform_remote_state.s3.outputs.redirect_www_website_hosted_zone_id
  }
}

# Enable public DNS query logging
resource "aws_cloudwatch_log_group" "covidstats_public_dns" {
  name = "/aws/route53/${aws_route53_zone.covidstats.name}"
  provider = aws.us-east-1
  retention_in_days = 7

  tags = merge(local.common_tags, {
    Name = "Public DNS Query Logging"
  })
}

# Allow route53 to write to logs.
resource "aws_cloudwatch_log_resource_policy" "route53_query_logging" {
  provider = aws.us-east-1

  policy_document = templatefile("templates/route53_query_logging_policy.tmpl", {})
  policy_name = "route53-query-logging-policy"
}

resource "aws_route53_query_log" "covidstats_public_dns" {
  depends_on = [aws_cloudwatch_log_resource_policy.route53_query_logging]

  cloudwatch_log_group_arn = aws_cloudwatch_log_group.covidstats_public_dns.arn
  zone_id                  = aws_route53_zone.covidstats.zone_id
}

#---------------------------------------
# Set up SSL on the domain
#---------------------------------------

resource "aws_acm_certificate" "main" {
  domain_name       = "covidstats.uk"
  validation_method = "DNS"
  subject_alternative_names = ["*.covidstats.uk"]

  lifecycle {
    create_before_destroy = true
  }
}

# Create CNAME records supplied by the acm to automatically validate the certificate using DNS
resource "aws_route53_record" "acm_cert_validation" {
  depends_on = [aws_acm_certificate.main, aws_route53_zone.covidstats]

  for_each = {
    for dvo in aws_acm_certificate.main.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = aws_route53_zone.covidstats.zone_id
}

# Complete the validation
resource "aws_acm_certificate_validation" "shopaid" {
  depends_on = [aws_route53_record.acm_cert_validation, aws_acm_certificate.main]

  certificate_arn         = aws_acm_certificate.main.arn
  validation_record_fqdns = [for record in aws_route53_record.acm_cert_validation : record.fqdn]
}
