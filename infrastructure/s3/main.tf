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

    allowed_origins = ["covidstats.uk"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }

  tags = merge(local.common_tags, {
    Name        = "${local.prefix}-website-bucket",
    Environment = local.environment
  })
}

# Restrict public access
resource "aws_s3_bucket_public_access_block" "main" {
  bucket = aws_s3_bucket.main.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Allow CloudFront access to the bucket
resource "aws_cloudfront_origin_access_identity" "main" {
  comment = "Access ID for covidstats.uk from CloudFront"
}

resource "aws_s3_bucket_policy" "main" {
  bucket = aws_s3_bucket.main.id
  policy = templatefile("templates/static-hosting-bucket-policy.tmpl", {
    bucket_arn = aws_s3_bucket.main.arn,
    cloudfront_oai_arn=aws_cloudfront_origin_access_identity.main.iam_arn
  })
}
