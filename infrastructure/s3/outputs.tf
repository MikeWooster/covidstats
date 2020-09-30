output "website_domain" {
  value = aws_s3_bucket.main.website_domain
}

output "website_regional_domain_name" {
  value = aws_s3_bucket.main.bucket_regional_domain_name
}

output "website_hosted_zone_id" {
  value = aws_s3_bucket.main.hosted_zone_id
}

output "redirect_www_website_domain" {
  value = aws_s3_bucket.redirect_www.website_domain
}

output "redirect_www_website_regional_domain_name" {
  value = aws_s3_bucket.redirect_www.bucket_regional_domain_name
}

output "redirect_www_website_hosted_zone_id" {
  value = aws_s3_bucket.redirect_www.hosted_zone_id
}
