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
    name = data.terraform_remote_state.s3.outputs.website_endpoint
    zone_id = data.terraform_remote_state.s3.outputs.website_hosted_zone_id
  }
}

# Allow routing to the www website bucket.
resource "aws_route53_record" "covidstats_www_redirect" {
  name = "www.covidstats.uk"
  type = "A"
  zone_id = aws_route53_zone.covidstats.zone_id

  alias {
    evaluate_target_health = false
    name = data.terraform_remote_state.s3.outputs.redirect_www_website_endpoint
    zone_id = data.terraform_remote_state.s3.outputs.redirect_www_website_hosted_zone_id
  }
}
