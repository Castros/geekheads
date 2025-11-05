# Infrastructure as Code - Terraform

Multi-site AWS infrastructure management using Terraform for static website hosting with S3 and CloudFront.

## 📁 Directory Structure

```
terraform/
├── modules/
│   └── static-website/          # Reusable module for S3 + CloudFront
│       ├── main.tf
│       ├── variables.tf
│       ├── outputs.tf
│       └── README.md
├── sites/
│   └── geekheads/              # Geek Head Solutions infrastructure
│       ├── dev/                # Development environment
│       │   ├── main.tf
│       │   ├── variables.tf
│       │   └── terraform.tfvars
│       └── prod/               # Production environment
│           ├── main.tf
│           ├── variables.tf
│           └── terraform.tfvars
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites

1. **Install Terraform**
   ```bash
   # macOS
   brew install terraform

   # Linux
   wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
   unzip terraform_1.6.0_linux_amd64.zip
   sudo mv terraform /usr/local/bin/

   # Verify installation
   terraform --version
   ```

2. **Configure AWS Credentials**
   ```bash
   # Option 1: AWS CLI
   aws configure

   # Option 2: Environment variables
   export AWS_ACCESS_KEY_ID="your-access-key"
   export AWS_SECRET_ACCESS_KEY="your-secret-key"
   export AWS_DEFAULT_REGION="us-east-1"
   ```

### Initial Setup - Development Environment

```bash
# Navigate to dev environment
cd terraform/sites/geekheads/dev

# Initialize Terraform
terraform init

# Review the execution plan
terraform plan

# Apply the infrastructure
terraform apply

# Save outputs (for GitHub Actions secrets)
terraform output -json > outputs.json
```

### Initial Setup - Production Environment

```bash
# Navigate to prod environment
cd terraform/sites/geekheads/prod

# Initialize Terraform
terraform init

# Review the execution plan
terraform plan

# Apply the infrastructure
terraform apply

# Save outputs (for GitHub Actions secrets)
terraform output -json > outputs.json
```

## 📋 Setting Up GitHub Actions Secrets

After deploying infrastructure, add these secrets to your GitHub repository:

### From Dev Environment
```bash
cd terraform/sites/geekheads/dev

# Get values
terraform output s3_bucket_name
terraform output cloudfront_distribution_id
```

**GitHub Secrets (Settings → Secrets → Actions):**
- `DEV_S3_BUCKET` = Output from `s3_bucket_name`
- `DEV_CLOUDFRONT_ID` = Output from `cloudfront_distribution_id`

### From Prod Environment
```bash
cd terraform/sites/geekheads/prod

# Get values
terraform output s3_bucket_name
terraform output cloudfront_distribution_id
```

**GitHub Secrets:**
- `PROD_S3_BUCKET` = Output from `s3_bucket_name`
- `PROD_CLOUDFRONT_ID` = Output from `cloudfront_distribution_id`

### AWS Credentials
- `AWS_ACCESS_KEY_ID` = Your AWS access key
- `AWS_SECRET_ACCESS_KEY` = Your AWS secret key
- `AWS_REGION` = `us-east-1`

## 🔧 Common Operations

### View Current Infrastructure
```bash
terraform show
```

### Update Infrastructure
```bash
# Edit terraform.tfvars or variables
terraform plan
terraform apply
```

### Destroy Infrastructure (⚠️ Use with caution)
```bash
terraform destroy
```

### Format Terraform Files
```bash
terraform fmt -recursive
```

### Validate Configuration
```bash
terraform validate
```

## 🌐 Adding Custom Domain

### 1. Request ACM Certificate (in us-east-1)
```bash
# ACM certificates for CloudFront MUST be in us-east-1
aws acm request-certificate \
  --domain-name geekheadsolutions.com \
  --subject-alternative-names "*.geekheadsolutions.com" \
  --validation-method DNS \
  --region us-east-1
```

### 2. Validate Certificate via DNS
Follow AWS console instructions to add DNS records for validation.

### 3. Get Route53 Hosted Zone ID
```bash
aws route53 list-hosted-zones --query "HostedZones[?Name=='geekheadsolutions.com.'].Id" --output text
```

### 4. Update terraform.tfvars
```hcl
domain_aliases      = ["www.geekheadsolutions.com", "geekheadsolutions.com"]
acm_certificate_arn = "arn:aws:acm:us-east-1:123456789012:certificate/abc123..."
route53_zone_id     = "Z1234567890ABC"
```

### 5. Apply Changes
```bash
terraform apply
```

## 🔄 Remote State Backend (Recommended)

For team collaboration, set up remote state storage:

### 1. Create S3 Bucket for State
```bash
aws s3 mb s3://terraform-state-your-company --region us-east-1
aws s3api put-bucket-versioning \
  --bucket terraform-state-your-company \
  --versioning-configuration Status=Enabled
```

### 2. Create DynamoDB Table for Locking
```bash
aws dynamodb create-table \
  --table-name terraform-state-lock \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

### 3. Uncomment Backend Configuration in main.tf
```hcl
backend "s3" {
  bucket         = "terraform-state-your-company"
  key            = "geekheads/prod/terraform.tfstate"
  region         = "us-east-1"
  encrypt        = true
  dynamodb_table = "terraform-state-lock"
}
```

### 4. Initialize with Backend
```bash
terraform init -migrate-state
```

## 📊 Cost Estimation

### Free Tier Eligible Resources
- S3 storage: First 5 GB free
- CloudFront: First 1 TB data transfer free per month
- Route53: First hosted zone: $0.50/month

### Typical Monthly Costs (beyond free tier)
- S3 storage: ~$0.023/GB
- CloudFront data transfer: ~$0.085/GB
- Route53: $0.50/hosted zone + $0.40/million queries

## 🏗️ Adding More Sites

To add a new site (e.g., fransolutions):

```bash
# Create new site directory
mkdir -p terraform/sites/fransolutions/{dev,prod}

# Copy geekheads configuration as template
cp -r terraform/sites/geekheads/dev/* terraform/sites/fransolutions/dev/
cp -r terraform/sites/geekheads/prod/* terraform/sites/fransolutions/prod/

# Update project name and bucket names in terraform.tfvars
# Update main.tf module names

# Deploy
cd terraform/sites/fransolutions/dev
terraform init
terraform apply
```

## 🔐 Security Best Practices

1. **Never commit sensitive data**
   - Add `*.tfvars` with secrets to `.gitignore`
   - Use environment variables or AWS Secrets Manager

2. **Use IAM roles with least privilege**
   ```hcl
   # Example: Create deployment user with minimal permissions
   ```

3. **Enable S3 versioning** (already configured)

4. **Use remote state with encryption** (see Remote State Backend)

5. **Regular backups**
   ```bash
   terraform state pull > backup-$(date +%Y%m%d).tfstate
   ```

## 📚 Additional Resources

- [Terraform AWS Provider Docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [Module Documentation](./modules/static-website/README.md)

## 🆘 Troubleshooting

### Issue: "Error acquiring state lock"
```bash
# List locks
aws dynamodb scan --table-name terraform-state-lock

# Force unlock (use with caution)
terraform force-unlock <LOCK_ID>
```

### Issue: ACM certificate validation timeout
- Ensure DNS records are properly configured
- Wait up to 30 minutes for validation
- Check domain nameservers point to Route53

### Issue: CloudFront distribution not updating
```bash
# Invalidate cache manually
aws cloudfront create-invalidation \
  --distribution-id <DISTRIBUTION_ID> \
  --paths "/*"
```

## 📞 Support

For questions or issues:
1. Check [Terraform AWS Provider Issues](https://github.com/hashicorp/terraform-provider-aws/issues)
2. Review AWS documentation
3. Check CloudWatch logs for errors

## 📝 Notes

- Changes to CloudFront distributions can take 15-20 minutes to deploy
- Always run `terraform plan` before `apply`
- Keep Terraform version consistent across team
- Document any manual changes made outside Terraform
