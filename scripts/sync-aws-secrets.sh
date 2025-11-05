#!/bin/bash
# ============================================
# Sync AWS Secrets to Multiple GitHub Repositories
# ============================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_info() { echo -e "${YELLOW}ℹ $1${NC}"; }

echo "=========================================="
echo "Sync AWS Secrets to Multiple Repositories"
echo "=========================================="
echo ""

# Check GitHub CLI
if ! command -v gh &> /dev/null; then
    echo "Error: GitHub CLI not installed"
    echo "Install: brew install gh"
    exit 1
fi

if ! gh auth status &> /dev/null; then
    echo "Error: GitHub CLI not authenticated"
    echo "Run: gh auth login"
    exit 1
fi

# Get AWS credentials from local AWS config
AWS_ACCESS_KEY_ID=$(aws configure get aws_access_key_id)
AWS_SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key)
AWS_REGION=$(aws configure get region)

if [ -z "$AWS_REGION" ]; then
    AWS_REGION="us-east-1"
fi

echo "AWS Region: $AWS_REGION"
echo ""

# List of repositories to update
REPOS=(
    "Castros/geekheads"
    "Castros/fransolutions"
    "Castros/portfolio"
    # Add more repositories here
)

echo "Will update AWS secrets in ${#REPOS[@]} repositories:"
for repo in "${REPOS[@]}"; do
    echo "  - $repo"
done
echo ""

read -p "Continue? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "Cancelled"
    exit 0
fi

echo ""
echo "Updating secrets..."
echo ""

# Update each repository
for repo in "${REPOS[@]}"; do
    print_info "Updating $repo..."

    # Set AWS_ACCESS_KEY_ID
    if echo "$AWS_ACCESS_KEY_ID" | gh secret set "AWS_ACCESS_KEY_ID" -R "$repo" 2>/dev/null; then
        print_success "  AWS_ACCESS_KEY_ID"
    else
        echo "  ✗ Failed: AWS_ACCESS_KEY_ID (repo may not exist)"
    fi

    # Set AWS_SECRET_ACCESS_KEY
    if echo "$AWS_SECRET_ACCESS_KEY" | gh secret set "AWS_SECRET_ACCESS_KEY" -R "$repo" 2>/dev/null; then
        print_success "  AWS_SECRET_ACCESS_KEY"
    else
        echo "  ✗ Failed: AWS_SECRET_ACCESS_KEY"
    fi

    # Set AWS_REGION
    if echo "$AWS_REGION" | gh secret set "AWS_REGION" -R "$repo" 2>/dev/null; then
        print_success "  AWS_REGION"
    else
        echo "  ✗ Failed: AWS_REGION"
    fi

    echo ""
done

echo "=========================================="
echo "✓ Secret sync complete!"
echo "=========================================="
