output "website_endpoint" {
  value = aws_s3_bucket.main.website_endpoint
}

output "website_hosted_zone_id" {
  value = aws_s3_bucket.main.hosted_zone_id
}

output "redirect_www_website_endpoint" {
  value = aws_s3_bucket.redirect_www.website_endpoint
}

output "redirect_www_website_hosted_zone_id" {
  value = aws_s3_bucket.redirect_www.hosted_zone_id
}
