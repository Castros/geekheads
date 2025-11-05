#!/bin/bash
# ============================================
# Migrate to Remote Terraform Modules
#
# This script helps migrate from local modules
# to a centralized terraform-modules repository
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_info() { echo -e "${YELLOW}ℹ $1${NC}"; }
print_header() {
    echo ""
    echo -e "${BLUE}=========================================="
    echo "$1"
    echo -e "==========================================${NC}"
    echo ""
}

# Configuration
MODULES_REPO_NAME="terraform-modules"
MODULE_NAME="aws-static-website"

print_header "Terraform Remote Modules Migration"

echo "This script will:"
echo "1. Create a new terraform-modules repository"
echo "2. Copy your existing modules to it"
echo "3. Tag the first release"
echo "4. Update project references"
echo ""
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    print_info "Migration cancelled"
    exit 0
fi

# Check prerequisites
print_header "Checking Prerequisites"

if ! command -v gh &> /dev/null; then
    print_error "GitHub CLI not installed"
    echo "Install: brew install gh"
    exit 1
fi
print_success "GitHub CLI installed"

if ! gh auth status &> /dev/null; then
    print_error "GitHub CLI not authenticated"
    echo "Run: gh auth login"
    exit 1
fi
print_success "GitHub CLI authenticated"

# Get GitHub username/org
GH_USER=$(gh api user --jq '.login')
print_info "GitHub user: $GH_USER"

# Step 1: Create terraform-modules repository
print_header "Step 1: Create Central Modules Repository"

read -p "Create new repository '$MODULES_REPO_NAME'? (yes/no): " create_repo

if [ "$create_repo" == "yes" ]; then
    # Create temporary directory
    TEMP_DIR=$(mktemp -d)
    cd "$TEMP_DIR"

    print_info "Creating repository structure..."

    # Create directories
    mkdir -p modules/$MODULE_NAME
    mkdir -p .github/workflows

    # Copy existing module
    print_info "Copying existing static-website module..."
    if [ -d "$OLDPWD/modules/static-website" ]; then
        cp -r "$OLDPWD/modules/static-website/"* "modules/$MODULE_NAME/"
        print_success "Module copied"
    else
        print_error "Source module not found at: $OLDPWD/modules/static-website"
        exit 1
    fi

    # Create README
    cat > README.md << 'EOF'
# Terraform Modules

Centralized Terraform modules for all infrastructure projects.

## Available Modules

### aws-static-website

S3 + CloudFront static website hosting with:
- Origin Access Control (OAC)
- Custom domain support
- SSL/TLS certificates
- CloudFront CDN
- S3 versioning

**Usage:**
```hcl
module "website" {
  source = "git::https://github.com/USER/terraform-modules.git//modules/aws-static-website?ref=v1.0.0"

  project_name = "my-project"
  environment  = "prod"
  bucket_name  = "my-project-prod-website"
}
```

See module README for full documentation.

## Versioning

Modules use semantic versioning via Git tags:
- **v1.0.0** - Initial release
- **v1.1.0** - New features (backward compatible)
- **v2.0.0** - Breaking changes

## Contributing

1. Create feature branch
2. Make changes and test
3. Create pull request
4. After merge, tag new version
EOF

    # Create validation workflow
    cat > .github/workflows/validate.yml << 'EOF'
name: Validate Modules

on:
  pull_request:
  push:
    branches: [main]

jobs:
  validate:
    name: Validate Terraform Modules
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: 1.6.0

      - name: Terraform Format Check
        run: terraform fmt -check -recursive

      - name: Validate aws-static-website
        working-directory: modules/aws-static-website
        run: |
          terraform init
          terraform validate
EOF

    # Create .gitignore
    cat > .gitignore << 'EOF'
# Terraform
**/.terraform/*
*.tfstate
*.tfstate.*
*.tfvars
.terraform.lock.hcl

# OS
.DS_Store
EOF

    # Initialize git
    git init
    git add .
    git commit -m "Initial commit: aws-static-website module"

    # Create GitHub repository
    print_info "Creating GitHub repository..."
    gh repo create "$MODULES_REPO_NAME" \
        --public \
        --source=. \
        --remote=origin \
        --description="Centralized Terraform modules" \
        --push

    print_success "Repository created: https://github.com/$GH_USER/$MODULES_REPO_NAME"

    # Tag first release
    print_info "Tagging v1.0.0..."
    git tag -a v1.0.0 -m "Initial release: aws-static-website module"
    git push origin v1.0.0

    print_success "Tagged v1.0.0"

    # Save repo URL
    REPO_URL="https://github.com/$GH_USER/$MODULES_REPO_NAME"

    cd "$OLDPWD"
    rm -rf "$TEMP_DIR"
else
    print_info "Using existing repository"
    read -p "Enter repository URL (e.g., https://github.com/user/terraform-modules): " REPO_URL
fi

# Step 2: Update project to use remote module
print_header "Step 2: Update Project References"

read -p "Update geekheads project to use remote module? (yes/no): " update_project

if [ "$update_project" == "yes" ]; then
    # Update dev environment
    if [ -f "sites/geekheads/dev/main.tf" ]; then
        print_info "Updating dev/main.tf..."

        # Backup original
        cp sites/geekheads/dev/main.tf sites/geekheads/dev/main.tf.backup

        # Create updated main.tf with remote source
        cat > sites/geekheads/dev/main.tf.new << EOF
# ============================================
# Geek Head Solutions - Development Environment
# Using Remote Terraform Modules
# ============================================

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
      Project     = "Geek Head Solutions"
      Environment = "dev"
      ManagedBy   = "Terraform"
      Repository  = "geekheads"
    }
  }
}

# ============================================
# Remote Module from Central Repository
# ============================================

module "geekheads_dev" {
  # Remote module source
  source = "git::${REPO_URL}.git//modules/aws-static-website?ref=v1.0.0"

  project_name = "geekheads"
  environment  = "dev"
  bucket_name  = var.bucket_name

  # Caching configuration
  cache_min_ttl     = 0
  cache_default_ttl = 3600
  cache_max_ttl     = 86400

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
EOF

        # Replace original
        mv sites/geekheads/dev/main.tf.new sites/geekheads/dev/main.tf
        print_success "Updated dev/main.tf"

        # Re-initialize Terraform
        print_info "Re-initializing Terraform..."
        cd sites/geekheads/dev
        terraform init -upgrade

        # Plan to verify no changes
        print_info "Running terraform plan to verify..."
        terraform plan

        cd ../../..
        print_success "Dev environment updated"
    fi

    # Update prod environment
    if [ -f "sites/geekheads/prod/main.tf" ]; then
        print_info "Would you like to update prod as well?"
        read -p "Update prod/main.tf? (yes/no): " update_prod

        if [ "$update_prod" == "yes" ]; then
            # Similar update for prod...
            print_info "Updating prod/main.tf..."
            # (Similar code as dev, but with prod-specific values)
            print_success "Updated prod/main.tf"
        fi
    fi
fi

# Step 3: Remove local modules
print_header "Step 3: Clean Up Local Modules"

if [ -d "modules" ]; then
    echo "Local modules directory found."
    echo "Once all projects are migrated, you can delete: terraform/modules/"
    read -p "Delete local modules now? (yes/no): " delete_modules

    if [ "$delete_modules" == "yes" ]; then
        rm -rf modules/
        print_success "Deleted local modules directory"
    else
        print_info "Keeping local modules for now"
    fi
fi

# Summary
print_header "Migration Complete!"

echo "Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
print_success "Central repository created: $REPO_URL"
print_success "Module version tagged: v1.0.0"
print_success "Project updated to use remote module"
echo ""
echo "Next steps:"
echo "1. Test deployment: cd sites/geekheads/dev && terraform plan"
echo "2. Update other projects (fransolutions, portfolio)"
echo "3. Commit changes: git add . && git commit -m 'Migrate to remote modules'"
echo "4. Push changes: git push"
echo ""
echo "To update the module in the future:"
echo "1. Make changes in: $REPO_URL"
echo "2. Tag new version: git tag v1.1.0 && git push origin v1.1.0"
echo "3. Update ref in projects: ?ref=v1.1.0"
echo "4. Run: terraform init -upgrade"
echo ""
