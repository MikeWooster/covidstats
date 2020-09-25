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

data "terraform_remote_state" "s3" {
  backend = "s3"

  config = {
    bucket = "covidstats-terraform-state"
    key    = "s3/production/terraform.tfstate"
    region = "us-east-1"
  }
}

