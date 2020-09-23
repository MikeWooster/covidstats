# ---------------------------------------------------------------------------------------------------------------------
# AWS PROVIDER AND REMOTE STATE
# ---------------------------------------------------------------------------------------------------------------------

provider "aws" {
  region = local.aws_region
}


data "terraform_remote_state" "s3" {
  backend = "s3"

  config = {
    bucket = "covidstats-terraform-state"
    key    = "s3/production/terraform.tfstate"
    region = "us-east-1"
  }
}
