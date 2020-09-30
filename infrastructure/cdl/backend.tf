terraform {
  backend "s3" {
    bucket  = "covidstats-terraform-state"
    key     = "cdl/prod/terraform.tfstate"
    encrypt = "true"
    region  = "us-east-1"
  }
}
