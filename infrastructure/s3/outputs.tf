output "website_domain" {
  value = aws_s3_bucket.main.website_domain
}

output "website_regional_domain_name" {
  value = aws_s3_bucket.main.bucket_regional_domain_name
}

output "website_hosted_zone_id" {
  value = aws_s3_bucket.main.hosted_zone_id
}

output "cloudfront_oai_path" {
  value = aws_cloudfront_origin_access_identity.main.cloudfront_access_identity_path
}

output "redirect_www_website_regional_domain_name" {
  value = aws_s3_bucket.redirect_www.bucket_regional_domain_name
}

output "redirect_www_cloudfront_oai_path" {
  value = aws_cloudfront_origin_access_identity.redirect_www.cloudfront_access_identity_path
}
