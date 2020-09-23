terraform {
  backend "s3" {
    bucket  = "covidstats-terraform-state"
    key     = "s3/production/terraform.tfstate"
    encrypt = "true"
    region  = "us-east-1"
  }
}
