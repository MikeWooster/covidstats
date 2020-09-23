# ---------------------------------------------------------------------------------------------------------------------
# S3 BUCKETS
# ---------------------------------------------------------------------------------------------------------------------

resource "aws_s3_bucket" "main" {
  bucket = "covidstats.uk"
  acl    = "public-read"

  website {
    index_document = "index.html"
    error_document = "index.html"
  }

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET"]

    allowed_origins = ["shopaid.uk"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }

  tags = {
    Name        = "cvdsts-prod-website-bucket",
    Environment = "prod"
  }
}

resource "aws_s3_bucket_policy" "main" {
  bucket = aws_s3_bucket.main.id
  policy = templatefile("templates/static-hosting-bucket-policy.tmpl", {
    bucket_arn = aws_s3_bucket.main.arn
  })
}

# Route traffic from www.covidstats.uk to covidstats.uk
resource "aws_s3_bucket" "redirect_www" {
  bucket = "www.covidstats.uk"
  acl    = "private"

  website {
    redirect_all_requests_to = "http://${aws_s3_bucket.main.website_endpoint}"
  }

  tags = {
    Name        = "cvdsts-prod-www-rerouting-bucket",
    Environment = "prod"
  }
}

resource "aws_s3_bucket_public_access_block" "redirect_www" {
  bucket = aws_s3_bucket.redirect_www.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
