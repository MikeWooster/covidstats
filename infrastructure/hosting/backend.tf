terraform {
  backend "s3" {
    bucket  = "covidstats-terraform-state"
    key     = "hosting/prod/terraform.tfstate"
    encrypt = "true"
    region  = "us-east-1"
  }
}
