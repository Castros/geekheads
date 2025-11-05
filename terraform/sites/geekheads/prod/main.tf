# ============================================
# Geek Head Solutions - Production Environment
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
  #   key            = "geekheads/prod/terraform.tfstate"
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
      Environment = "prod"
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
      Environment = "prod"
      ManagedBy   = "Terraform"
      Repository  = "geekheads"
    }
  }
}

# ============================================
# Static Website Module
# ============================================

module "geekheads_prod" {
  source = "../../../modules/static-website"

  project_name = "geekheads"
  environment  = "prod"
  bucket_name  = var.bucket_name

  # Custom domain configuration
  # Uncomment and configure when you have a production domain
  # domain_aliases      = var.domain_aliases
  # acm_certificate_arn = var.acm_certificate_arn
  # route53_zone_id     = var.route53_zone_id

  # Caching configuration - more aggressive for production
  cache_min_ttl     = 0
  cache_default_ttl = 86400    # 24 hours
  cache_max_ttl     = 31536000 # 1 year

  # CloudFront configuration
  cloudfront_price_class = var.cloudfront_price_class
  enable_versioning      = true

  tags = {
    CostCenter = "Production"
    Backup     = "Required"
  }
}

# ============================================
# Outputs
# ============================================

output "website_url" {
  description = "The URL of the production website"
  value       = module.geekheads_prod.website_url
}

output "s3_bucket_name" {
  description = "S3 bucket name for GitHub Actions"
  value       = module.geekheads_prod.s3_bucket_id
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID for GitHub Actions"
  value       = module.geekheads_prod.cloudfront_distribution_id
}

output "deployment_info" {
  description = "Complete deployment information"
  value       = module.geekheads_prod.deployment_info
  sensitive   = false
}
