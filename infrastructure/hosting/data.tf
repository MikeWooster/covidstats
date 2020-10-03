# ---------------------------------------------------------------------------------------------------------------------
# AWS PROVIDER AND REMOTE STATE
# ---------------------------------------------------------------------------------------------------------------------

provider "aws" {
  region = local.aws_region
}

# Additional provider configuration for us east region
# Cloudwatch log group for route53 needs to be in this region
# resources can reference this as `aws.west`.
provider "aws" {
  alias  = "us-east-1"
  region = "us-east-1"
}

