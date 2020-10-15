# ---------------------------------------------------------------------------------------------------------------------
# AWS PROVIDER AND REMOTE STATE
# ---------------------------------------------------------------------------------------------------------------------

provider "aws" {
  region = local.aws_region
}

data "terraform_remote_state" "hosting" {
  backend = "s3"

  config = {
    bucket = "covidstats-terraform-state"
    key    = "hosting/prod/terraform.tfstate"
    region = "us-east-1"
  }
}
