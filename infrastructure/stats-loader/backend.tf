terraform {
  backend "s3" {
    bucket  = "covidstats-terraform-state"
    key     = "stats-loader/prod/terraform.tfstate"
    encrypt = "true"
    region  = "us-east-1"
  }
}
