terraform {
  backend "s3" {
    bucket  = "covidstats-terraform-state"
    key     = "alerting/prod/terraform.tfstate"
    encrypt = "true"
    region  = "us-east-1"
  }
}
