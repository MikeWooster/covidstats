# ---------------------------------------------------------------------------------------------------------------------
# DNS Zones
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
    name = aws_cloudfront_distribution.main.domain_name
    zone_id = aws_cloudfront_distribution.main.hosted_zone_id
  }
}

# Redirect from www to non-www site.
resource "aws_route53_record" "covidstats_www_redirect" {
  name = "www.covidstats.uk"
  type = "A"
  zone_id = aws_route53_zone.covidstats.zone_id

  alias {
    evaluate_target_health = false
    name = aws_cloudfront_distribution.main.domain_name
    zone_id = aws_cloudfront_distribution.main.hosted_zone_id
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
