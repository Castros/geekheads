#!/bin/bash
# ============================================
# Automated Terraform Deployment + GitHub Secrets Sync
#
# This script:
# 1. Deploys Terraform infrastructure
# 2. Automatically updates GitHub repository secrets
# 3. Eliminates manual secret management
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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
    echo -e "${BLUE}=========================================="
    echo "$1"
    echo -e "==========================================${NC}"
    echo ""
}

# Check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"

    # Check Terraform
    if ! command -v terraform &> /dev/null; then
        print_error "Terraform is not installed"
        echo "Install: https://www.terraform.io/downloads"
        exit 1
    fi
    print_success "Terraform $(terraform version | head -n1 | awk '{print $2}')"

    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed"
        echo "Install: https://aws.amazon.com/cli/"
        exit 1
    fi
    print_success "AWS CLI $(aws --version | awk '{print $1}')"

    # Check GitHub CLI
    if ! command -v gh &> /dev/null; then
        print_error "GitHub CLI is not installed"
        echo "Install: https://cli.github.com/"
        exit 1
    fi
    print_success "GitHub CLI $(gh --version | head -n1)"

    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "AWS credentials not configured"
        echo "Run: aws configure"
        exit 1
    fi
    AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
    print_success "AWS Account: $AWS_ACCOUNT"

    # Check GitHub authentication
    if ! gh auth status &> /dev/null; then
        print_error "GitHub CLI not authenticated"
        echo "Run: gh auth login"
        exit 1
    fi
    print_success "GitHub CLI authenticated"
}

# Get repository information
get_repo_info() {
    # Try to get repo from git remote
    if git remote get-url origin &> /dev/null; then
        REPO_URL=$(git remote get-url origin)
        REPO_NAME=$(echo "$REPO_URL" | sed -E 's|.*[:/]([^/]+/[^/]+)(\.git)?$|\1|')
        print_info "Repository: $REPO_NAME"
    else
        print_error "Not in a git repository or no remote configured"
        read -p "Enter GitHub repository (owner/repo): " REPO_NAME
    fi
}

# Deploy Terraform and capture outputs
deploy_terraform() {
    local env_path=$1
    local environment=$2

    print_header "Deploying Terraform: $environment"

    cd "$env_path"

    # Initialize
    print_info "Running terraform init..."
    terraform init -upgrade

    # Validate
    print_info "Validating configuration..."
    if ! terraform validate; then
        print_error "Terraform validation failed"
        exit 1
    fi
    print_success "Configuration valid"

    # Plan
    print_info "Creating execution plan..."
    terraform plan -out=tfplan

    # Confirm
    echo ""
    read -p "Apply this plan? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        print_info "Deployment cancelled"
        rm -f tfplan
        return 1
    fi

    # Apply
    print_info "Applying infrastructure changes..."
    if terraform apply tfplan; then
        print_success "Infrastructure deployed successfully"
        rm -f tfplan
        return 0
    else
        print_error "Terraform apply failed"
        rm -f tfplan
        exit 1
    fi
}

# Extract and update GitHub secrets
sync_github_secrets() {
    local env_path=$1
    local environment=$2
    local project_name=$3

    print_header "Syncing GitHub Secrets: $environment"

    cd "$env_path"

    # Extract outputs
    print_info "Extracting Terraform outputs..."

    S3_BUCKET=$(terraform output -raw s3_bucket_name 2>/dev/null)
    CLOUDFRONT_ID=$(terraform output -raw cloudfront_distribution_id 2>/dev/null)
    WEBSITE_URL=$(terraform output -raw website_url 2>/dev/null)

    if [ -z "$S3_BUCKET" ] || [ -z "$CLOUDFRONT_ID" ]; then
        print_error "Failed to extract Terraform outputs"
        exit 1
    fi

    print_success "S3 Bucket: $S3_BUCKET"
    print_success "CloudFront ID: $CLOUDFRONT_ID"
    print_success "Website URL: $WEBSITE_URL"

    # Determine secret names based on environment
    if [ "$environment" == "dev" ]; then
        SECRET_PREFIX="DEV"
    elif [ "$environment" == "prod" ]; then
        SECRET_PREFIX="PROD"
    else
        SECRET_PREFIX=$(echo "$environment" | tr '[:lower:]' '[:upper:]')
    fi

    # Update GitHub secrets
    print_info "Updating GitHub repository secrets..."

    # Set S3 bucket secret
    if echo "$S3_BUCKET" | gh secret set "${SECRET_PREFIX}_S3_BUCKET" -R "$REPO_NAME"; then
        print_success "Updated ${SECRET_PREFIX}_S3_BUCKET"
    else
        print_error "Failed to update ${SECRET_PREFIX}_S3_BUCKET"
    fi

    # Set CloudFront distribution ID secret
    if echo "$CLOUDFRONT_ID" | gh secret set "${SECRET_PREFIX}_CLOUDFRONT_ID" -R "$REPO_NAME"; then
        print_success "Updated ${SECRET_PREFIX}_CLOUDFRONT_ID"
    else
        print_error "Failed to update ${SECRET_PREFIX}_CLOUDFRONT_ID"
    fi

    # Save outputs to file for reference
    terraform output -json > "${environment}-outputs.json"
    print_success "Outputs saved to ${environment}-outputs.json"
}

# Set AWS credentials in GitHub secrets (one-time setup)
setup_aws_secrets() {
    print_header "AWS Credentials Setup"

    echo "Do you want to update AWS credentials in GitHub secrets?"
    echo "This is typically only needed once or when rotating credentials."
    read -p "Update AWS credentials? (yes/no): " update_aws

    if [ "$update_aws" != "yes" ]; then
        print_info "Skipping AWS credentials update"
        return
    fi

    # Get AWS credentials
    AWS_ACCESS_KEY_ID=$(aws configure get aws_access_key_id)
    AWS_SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key)
    AWS_REGION=$(aws configure get region)

    if [ -z "$AWS_REGION" ]; then
        AWS_REGION="us-east-1"
    fi

    # Update secrets
    print_info "Updating AWS credentials in GitHub..."

    if echo "$AWS_ACCESS_KEY_ID" | gh secret set "AWS_ACCESS_KEY_ID" -R "$REPO_NAME"; then
        print_success "Updated AWS_ACCESS_KEY_ID"
    fi

    if echo "$AWS_SECRET_ACCESS_KEY" | gh secret set "AWS_SECRET_ACCESS_KEY" -R "$REPO_NAME"; then
        print_success "Updated AWS_SECRET_ACCESS_KEY"
    fi

    if echo "$AWS_REGION" | gh secret set "AWS_REGION" -R "$REPO_NAME"; then
        print_success "Updated AWS_REGION"
    fi

    print_success "AWS credentials updated in GitHub"
}

# Main menu
main_menu() {
    print_header "Terraform + GitHub Secrets Automation"

    echo "What would you like to deploy?"
    echo ""
    echo "1) Geekheads - Dev Environment"
    echo "2) Geekheads - Prod Environment"
    echo "3) Both Dev and Prod"
    echo "4) Setup AWS Credentials Only"
    echo "5) Exit"
    echo ""
    read -p "Enter choice [1-5]: " choice

    case $choice in
        1)
            SITE="geekheads"
            ENV="dev"
            deploy_and_sync "$SITE" "$ENV"
            ;;
        2)
            SITE="geekheads"
            ENV="prod"
            print_error "⚠️  WARNING: You are deploying to PRODUCTION!"
            read -p "Are you sure? (yes/no): " confirm
            if [ "$confirm" == "yes" ]; then
                deploy_and_sync "$SITE" "$ENV"
            else
                print_info "Cancelled"
            fi
            ;;
        3)
            SITE="geekheads"
            deploy_and_sync "$SITE" "dev"
            echo ""
            print_error "⚠️  WARNING: Next deploying to PRODUCTION!"
            read -p "Continue to production? (yes/no): " confirm
            if [ "$confirm" == "yes" ]; then
                deploy_and_sync "$SITE" "prod"
            fi
            ;;
        4)
            setup_aws_secrets
            ;;
        5)
            print_info "Exiting..."
            exit 0
            ;;
        *)
            print_error "Invalid choice"
            exit 1
            ;;
    esac
}

# Deploy and sync function
deploy_and_sync() {
    local site=$1
    local env=$2
    local env_path="sites/$site/$env"

    # Save current directory
    SCRIPT_DIR=$(pwd)

    # Deploy Terraform
    if deploy_terraform "$env_path" "$env"; then
        # Return to script directory
        cd "$SCRIPT_DIR"

        # Sync secrets
        sync_github_secrets "$env_path" "$env" "$site"

        print_header "Deployment Complete!"
        print_success "Infrastructure deployed: $env"
        print_success "GitHub secrets updated automatically"
        print_info "You can now push code and GitHub Actions will deploy using these secrets"
    else
        cd "$SCRIPT_DIR"
        print_error "Deployment failed or was cancelled"
        exit 1
    fi
}

# Main execution
main() {
    # Change to terraform directory if not already there
    if [ ! -d "sites" ]; then
        if [ -d "terraform/sites" ]; then
            cd terraform
        else
            print_error "Please run this script from the terraform directory or project root"
            exit 1
        fi
    fi

    check_prerequisites
    get_repo_info
    setup_aws_secrets
    main_menu
}

# Run main function
main
