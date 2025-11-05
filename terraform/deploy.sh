#!/bin/bash
# ============================================
# Terraform Deployment Script
# Quick deployment for geekheads infrastructure
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

print_header() {
    echo ""
    echo "=========================================="
    echo "$1"
    echo "=========================================="
    echo ""
}

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    print_error "Terraform is not installed. Please install it first."
    exit 1
fi

print_success "Terraform $(terraform version | head -n1) detected"

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    print_error "AWS credentials not configured. Run 'aws configure' first."
    exit 1
fi

print_success "AWS credentials configured"
AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
print_info "AWS Account: $AWS_ACCOUNT"

# Main menu
print_header "Geek Head Solutions - Infrastructure Deployment"

echo "Select environment to deploy:"
echo "1) Development (dev)"
echo "2) Production (prod)"
echo "3) Exit"
echo ""
read -p "Enter choice [1-3]: " choice

case $choice in
    1)
        ENV="dev"
        ENV_PATH="sites/geekheads/dev"
        ;;
    2)
        ENV="prod"
        ENV_PATH="sites/geekheads/prod"
        print_error "⚠️  WARNING: You are about to deploy to PRODUCTION!"
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" != "yes" ]; then
            print_info "Deployment cancelled"
            exit 0
        fi
        ;;
    3)
        print_info "Exiting..."
        exit 0
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

print_header "Deploying to $ENV environment"

# Navigate to environment directory
cd "$ENV_PATH"

# Initialize Terraform
print_info "Initializing Terraform..."
terraform init

# Validate configuration
print_info "Validating configuration..."
terraform validate

if [ $? -ne 0 ]; then
    print_error "Configuration validation failed"
    exit 1
fi

print_success "Configuration is valid"

# Show plan
print_header "Terraform Plan"
terraform plan -out=tfplan

# Ask for confirmation
echo ""
read -p "Do you want to apply this plan? (yes/no): " apply_confirm

if [ "$apply_confirm" != "yes" ]; then
    print_info "Deployment cancelled"
    rm -f tfplan
    exit 0
fi

# Apply the plan
print_header "Applying changes..."
terraform apply tfplan

if [ $? -eq 0 ]; then
    print_success "Deployment completed successfully!"

    # Show outputs
    print_header "Deployment Information"
    terraform output

    # Save outputs to file
    terraform output -json > outputs.json
    print_success "Outputs saved to outputs.json"

    # Display GitHub Actions secrets
    print_header "GitHub Actions Secrets"
    echo "Add these to your GitHub repository secrets:"
    echo ""

    if [ "$ENV" = "dev" ]; then
        echo "DEV_S3_BUCKET=$(terraform output -raw s3_bucket_name)"
        echo "DEV_CLOUDFRONT_ID=$(terraform output -raw cloudfront_distribution_id)"
    else
        echo "PROD_S3_BUCKET=$(terraform output -raw s3_bucket_name)"
        echo "PROD_CLOUDFRONT_ID=$(terraform output -raw cloudfront_distribution_id)"
    fi

    echo ""
    echo "Also ensure these are set:"
    echo "AWS_ACCESS_KEY_ID"
    echo "AWS_SECRET_ACCESS_KEY"
    echo "AWS_REGION=us-east-1"
    echo ""

    print_success "Website URL: $(terraform output -raw website_url)"

else
    print_error "Deployment failed"
    exit 1
fi

# Cleanup
rm -f tfplan

print_header "Deployment Complete!"
