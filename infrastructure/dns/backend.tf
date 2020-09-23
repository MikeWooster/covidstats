terraform {
  backend "s3" {
    bucket  = "covidstats-terraform-state"
    key     = "dns/prod/terraform.tfstate"
    encrypt = "true"
    region  = "us-east-1"
  }
}
