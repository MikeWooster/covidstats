
#---------------------------------------
# Set up SSL on the domain
#---------------------------------------

resource "aws_acm_certificate" "main" {
  # Certificate must be in us east 1
  provider = aws.us-east-1

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
resource "aws_acm_certificate_validation" "main" {
  depends_on = [aws_route53_record.acm_cert_validation, aws_acm_certificate.main]
  # certificate validation must be performed in the same region as the cert.
  provider = aws.us-east-1

  certificate_arn         = aws_acm_certificate.main.arn
  validation_record_fqdns = [for record in aws_route53_record.acm_cert_validation : record.fqdn]
}
