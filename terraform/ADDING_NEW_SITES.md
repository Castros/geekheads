# Adding New Sites to Infrastructure

This guide shows how to add additional websites (like fransolutions or your portfolio) to the same Terraform infrastructure.

## Quick Start: Adding a New Site

### 1. Create Site Directory Structure

```bash
# From the terraform root directory
SITE_NAME="fransolutions"  # Change this to your site name

mkdir -p terraform/sites/$SITE_NAME/{dev,prod}
```

### 2. Copy Template Configuration

```bash
# Copy geekheads configuration as a template
cp terraform/sites/geekheads/dev/main.tf terraform/sites/$SITE_NAME/dev/
cp terraform/sites/geekheads/dev/variables.tf terraform/sites/$SITE_NAME/dev/
cp terraform/sites/geekheads/dev/terraform.tfvars terraform/sites/$SITE_NAME/dev/

cp terraform/sites/geekheads/prod/main.tf terraform/sites/$SITE_NAME/prod/
cp terraform/sites/geekheads/prod/variables.tf terraform/sites/$SITE_NAME/prod/
cp terraform/sites/geekheads/prod/terraform.tfvars terraform/sites/$SITE_NAME/prod/
```

### 3. Update Configuration Files

#### Dev Environment: `sites/$SITE_NAME/dev/main.tf`

Replace these values:
```hcl
# Change module name
module "fransolutions_dev" {  # Change from geekheads_dev
  source = "../../../modules/static-website"

  project_name = "fransolutions"  # Change project name
  environment  = "dev"
  bucket_name  = var.bucket_name

  # ... rest of configuration
}

# Update output references
output "website_url" {
  description = "The URL of the dev website"
  value       = module.fransolutions_dev.website_url  # Update module name
}

output "s3_bucket_name" {
  value = module.fransolutions_dev.s3_bucket_id  # Update module name
}

output "cloudfront_distribution_id" {
  value = module.fransolutions_dev.cloudfront_distribution_id  # Update module name
}
```

#### Dev Environment: `sites/$SITE_NAME/dev/terraform.tfvars`

Update bucket name:
```hcl
bucket_name = "fransolutions-dev-website"  # Change bucket name

# If you have a custom domain:
# domain_aliases      = ["dev.fransolutions.com"]
# acm_certificate_arn = "arn:aws:acm:us-east-1:ACCOUNT:certificate/CERT_ID"
# route53_zone_id     = "Z1234567890ABC"
```

#### Prod Environment: `sites/$SITE_NAME/prod/main.tf`

Same changes as dev, but for prod:
```hcl
module "fransolutions_prod" {  # Change from geekheads_prod
  source = "../../../modules/static-website"

  project_name = "fransolutions"
  environment  = "prod"
  # ... rest of configuration
}

# Update all output references to fransolutions_prod
```

#### Prod Environment: `sites/$SITE_NAME/prod/terraform.tfvars`

```hcl
bucket_name = "fransolutions-prod-website"  # Change bucket name

# domain_aliases      = ["www.fransolutions.com", "fransolutions.com"]
# acm_certificate_arn = "arn:aws:acm:us-east-1:ACCOUNT:certificate/CERT_ID"
# route53_zone_id     = "Z1234567890ABC"
```

### 4. Update Backend Configuration (Optional)

If using remote state backend, update in both dev and prod `main.tf`:

```hcl
backend "s3" {
  bucket         = "terraform-state-your-account"
  key            = "fransolutions/dev/terraform.tfstate"  # Change path
  region         = "us-east-1"
  encrypt        = true
  dynamodb_table = "terraform-state-lock"
}
```

### 5. Deploy the New Site

```bash
# Deploy dev environment
cd terraform/sites/$SITE_NAME/dev
terraform init
terraform plan
terraform apply

# Deploy prod environment
cd terraform/sites/$SITE_NAME/prod
terraform init
terraform plan
terraform apply
```

### 6. Get Deployment Information

```bash
# From dev directory
terraform output

# Save for GitHub Actions
terraform output s3_bucket_name          # For DEV_S3_BUCKET secret
terraform output cloudfront_distribution_id  # For DEV_CLOUDFRONT_ID secret
```

## Example: Complete fransolutions Setup

```bash
# 1. Create directory structure
mkdir -p terraform/sites/fransolutions/{dev,prod}

# 2. Copy templates
cp terraform/sites/geekheads/dev/* terraform/sites/fransolutions/dev/
cp terraform/sites/geekheads/prod/* terraform/sites/fransolutions/prod/

# 3. Update dev/main.tf
cat > terraform/sites/fransolutions/dev/main.tf <<'EOF'
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Project     = "Fran Solutions"
      Environment = "dev"
      ManagedBy   = "Terraform"
    }
  }
}

module "fransolutions_dev" {
  source = "../../../modules/static-website"

  project_name = "fransolutions"
  environment  = "dev"
  bucket_name  = var.bucket_name

  cache_min_ttl     = 0
  cache_default_ttl = 3600
  cache_max_ttl     = 86400

  cloudfront_price_class = var.cloudfront_price_class
  enable_versioning      = true
}

output "website_url" {
  value = module.fransolutions_dev.website_url
}

output "s3_bucket_name" {
  value = module.fransolutions_dev.s3_bucket_id
}

output "cloudfront_distribution_id" {
  value = module.fransolutions_dev.cloudfront_distribution_id
}
EOF

# 4. Update dev/terraform.tfvars
cat > terraform/sites/fransolutions/dev/terraform.tfvars <<'EOF'
aws_region = "us-east-1"
bucket_name = "fransolutions-dev-website"
cloudfront_price_class = "PriceClass_100"
EOF

# 5. Deploy
cd terraform/sites/fransolutions/dev
terraform init
terraform apply
```

## GitHub Actions Setup for New Site

### 1. Create Workflow Files

Create `.github/workflows/fransolutions-dev.yml` and `.github/workflows/fransolutions-prod.yml`

Use the same structure as geekheads workflows, but update:
- Workflow name
- Branch triggers
- Secret names (FRANSOLUTIONS_DEV_S3_BUCKET, etc.)

### 2. Add GitHub Secrets

From Terraform outputs, add these secrets:
- `FRANSOLUTIONS_DEV_S3_BUCKET`
- `FRANSOLUTIONS_DEV_CLOUDFRONT_ID`
- `FRANSOLUTIONS_PROD_S3_BUCKET`
- `FRANSOLUTIONS_PROD_CLOUDFRONT_ID`

## Multi-Site Repository Structure

Your complete infrastructure:

```
terraform/
├── modules/
│   └── static-website/          # Shared module
├── sites/
│   ├── geekheads/
│   │   ├── dev/
│   │   └── prod/
│   ├── fransolutions/
│   │   ├── dev/
│   │   └── prod/
│   └── portfolio/
│       ├── dev/
│       └── prod/
└── README.md
```

## Benefits of This Approach

✅ **Reusable Module**: Write once, use for all sites
✅ **Consistent Configuration**: All sites use same best practices
✅ **Independent Deployment**: Each site/environment deploys separately
✅ **Easy Maintenance**: Update module → affects all sites
✅ **Cost Efficient**: Shared infrastructure patterns
✅ **Scalable**: Add unlimited sites easily

## Managing Multiple Sites

### Deploy All Sites at Once
```bash
#!/bin/bash
# deploy-all.sh

for site in geekheads fransolutions portfolio; do
  for env in dev prod; do
    echo "Deploying $site $env..."
    cd terraform/sites/$site/$env
    terraform apply -auto-approve
    cd ../../../../
  done
done
```

### Check Status of All Sites
```bash
#!/bin/bash
# status-all.sh

for site in geekheads fransolutions portfolio; do
  for env in dev prod; do
    echo "=== $site $env ==="
    cd terraform/sites/$site/$env
    terraform show | grep -A 5 "website_url"
    cd ../../../../
  done
done
```

## Troubleshooting

### Issue: Bucket name already exists
- S3 bucket names are globally unique
- Change `bucket_name` in terraform.tfvars to something unique

### Issue: Module not found
- Ensure relative path to module is correct: `../../../modules/static-website`
- Run `terraform init` after creating new configurations

### Issue: Different AWS accounts
- Update provider configuration with different profiles
- Use workspace-specific credentials

## Next Steps

1. Add more sites following this guide
2. Set up remote state backend (see main README)
3. Create automation scripts for multi-site deployment
4. Consider using Terraform workspaces for dev/staging/prod
5. Implement automated testing with Terratest
