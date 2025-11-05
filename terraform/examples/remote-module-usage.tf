# ============================================
# Example: Using Remote Terraform Modules
#
# This shows how to reference modules from
# a central terraform-modules repository
# ============================================

# BEFORE (Local Module):
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# module "geekheads_dev" {
#   source = "../../../modules/static-website"  # Local path
#
#   project_name = "geekheads"
#   environment  = "dev"
#   bucket_name  = "geekheads-dev-website"
# }

# AFTER (Remote Module):
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# ============================================
# Option 1: GitHub (HTTPS) - Recommended
# ============================================

module "geekheads_dev" {
  # Reference specific version tag
  source = "git::https://github.com/your-username/terraform-modules.git//modules/aws-static-website?ref=v1.0.0"

  project_name = "geekheads"
  environment  = "dev"
  bucket_name  = "geekheads-dev-website"

  # All other variables work the same
  cache_default_ttl      = 3600
  cloudfront_price_class = "PriceClass_100"
  enable_versioning      = true
}

# ============================================
# Option 2: GitHub (SSH)
# ============================================

module "geekheads_prod" {
  source = "git::ssh://git@github.com/your-username/terraform-modules.git//modules/aws-static-website?ref=v1.0.0"

  project_name = "geekheads"
  environment  = "prod"
  bucket_name  = "geekheads-prod-website"
}

# ============================================
# Option 3: Use Latest (Main Branch)
# Recommended for dev environments only
# ============================================

module "geekheads_dev_latest" {
  source = "git::https://github.com/your-username/terraform-modules.git//modules/aws-static-website?ref=main"

  project_name = "geekheads"
  environment  = "dev"
  bucket_name  = "geekheads-dev-website"
}

# ============================================
# Option 4: Use Specific Commit
# For testing unreleased changes
# ============================================

module "geekheads_test" {
  source = "git::https://github.com/your-username/terraform-modules.git//modules/aws-static-website?ref=abc123def456"

  project_name = "geekheads"
  environment  = "test"
  bucket_name  = "geekheads-test-website"
}

# ============================================
# Option 5: Terraform Cloud/Enterprise
# Advanced - requires private registry setup
# ============================================

module "geekheads_enterprise" {
  source  = "app.terraform.io/your-org/static-website/aws"
  version = "~> 1.0"  # Use any 1.x version

  project_name = "geekheads"
  environment  = "prod"
  bucket_name  = "geekheads-prod-website"
}

# ============================================
# Outputs - Work the Same Way
# ============================================

output "website_url" {
  value = module.geekheads_dev.website_url
}

output "s3_bucket_name" {
  value = module.geekheads_dev.s3_bucket_id
}

output "cloudfront_distribution_id" {
  value = module.geekheads_dev.cloudfront_distribution_id
}

# ============================================
# Version Pinning Strategy by Environment
# ============================================

# Development - Use latest from main branch
module "dev_website" {
  source = "git::https://github.com/you/terraform-modules.git//modules/aws-static-website?ref=main"
  # Gets latest changes immediately
}

# Staging - Use minor version
module "staging_website" {
  source = "git::https://github.com/you/terraform-modules.git//modules/aws-static-website?ref=v1.1"
  # Gets bug fixes automatically (v1.1.0, v1.1.1, etc.)
}

# Production - Use exact version
module "prod_website" {
  source = "git::https://github.com/you/terraform-modules.git//modules/aws-static-website?ref=v1.1.0"
  # Only this specific version, never auto-updates
}

# ============================================
# Multiple Modules from Same Repository
# ============================================

# Static website module
module "website" {
  source = "git::https://github.com/you/terraform-modules.git//modules/aws-static-website?ref=v1.0.0"
  # ...
}

# Lambda API module
module "api" {
  source = "git::https://github.com/you/terraform-modules.git//modules/aws-lambda-api?ref=v2.0.0"
  # ...
}

# VPC module
module "network" {
  source = "git::https://github.com/you/terraform-modules.git//modules/aws-vpc-network?ref=v1.5.0"
  # ...
}

# ============================================
# Updating to New Module Version
# ============================================

# Step 1: Change ref version
# From: ?ref=v1.0.0
# To:   ?ref=v1.1.0

# Step 2: Run terraform init to download new version
# $ terraform init -upgrade

# Step 3: Review changes
# $ terraform plan

# Step 4: Apply if looks good
# $ terraform apply
