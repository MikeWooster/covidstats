
locals {
  aws_region = file("../aws_region")
  environment = file("../environment")
  application = file("../application")
  prefix = "${local.application}-${local.environment}"
  common_tags = {
    Application = local.application
    Environment = local.environment
  }
}
