# ---------------------------------------------------------------------------------------------------------------------
# Create a Cloudfront distribution for the static website
# ---------------------------------------------------------------------------------------------------------------------

# Create a cloudfront "user" for permissions to be hung off.
resource "aws_cloudfront_origin_access_identity" "main" {
  comment = "Access ID for covidstats.uk from CloudFront"
}

# Create the main website distribution
resource "aws_cloudfront_distribution" "main" {
  depends_on = [aws_cloudfront_origin_access_identity.main, aws_s3_bucket.main, aws_acm_certificate.main]

  enabled             = true
  price_class         = "PriceClass_100"
  http_version        = "http2"
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  origin {
    origin_id   = "S3-${aws_s3_bucket.main.bucket_regional_domain_name}"
    domain_name = aws_s3_bucket.main.bucket_regional_domain_name

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.main.cloudfront_access_identity_path
    }
  }

  aliases = ["covidstats.uk"]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.main.bucket_regional_domain_name}"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 300
    max_ttl     = 1200

    // This redirects any HTTP request to HTTPS.
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
  }
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.main.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2018"
  }
}
