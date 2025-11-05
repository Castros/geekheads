# ============================================
# Geek Head Solutions - Development Environment
# ============================================

terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Backend configuration - uncomment and configure after creating S3 bucket
  # backend "s3" {
  #   bucket         = "terraform-state-your-account"
  #   key            = "geekheads/dev/terraform.tfstate"
  #   region         = "us-east-1"
  #   encrypt        = true
  #   dynamodb_table = "terraform-state-lock"
  # }
}

# ============================================
# Provider Configuration
# ============================================

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "Geek Head Solutions"
      Environment = "dev"
      ManagedBy   = "Terraform"
      Repository  = "geekheads"
    }
  }
}

# CloudFront requires ACM certificates in us-east-1
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Project     = "Geek Head Solutions"
      Environment = "dev"
      ManagedBy   = "Terraform"
      Repository  = "geekheads"
    }
  }
}

# ============================================
# Static Website Module
# ============================================

module "geekheads_dev" {
  source = "../../../modules/static-website"

  project_name = "geekheads"
  environment  = "dev"
  bucket_name  = var.bucket_name

  # Custom domain configuration (optional)
  # Uncomment and configure when you have a domain
  # domain_aliases      = var.domain_aliases
  # acm_certificate_arn = var.acm_certificate_arn
  # route53_zone_id     = var.route53_zone_id

  # Caching configuration
  cache_min_ttl     = 0
  cache_default_ttl = 3600      # 1 hour for dev
  cache_max_ttl     = 86400     # 24 hours for dev

  # CloudFront configuration
  cloudfront_price_class = var.cloudfront_price_class
  enable_versioning      = true

  tags = {
    CostCenter = "Development"
  }
}

# ============================================
# Outputs
# ============================================

output "website_url" {
  description = "The URL of the dev website"
  value       = module.geekheads_dev.website_url
}

output "s3_bucket_name" {
  description = "S3 bucket name for GitHub Actions"
  value       = module.geekheads_dev.s3_bucket_id
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID for GitHub Actions"
  value       = module.geekheads_dev.cloudfront_distribution_id
}

output "deployment_info" {
  description = "Complete deployment information"
  value       = module.geekheads_dev.deployment_info
  sensitive   = false
}
