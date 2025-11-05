# Complete Automation Guide: Terraform → GitHub Secrets

**Stop manually managing AWS resources and GitHub secrets!** This guide shows you how to fully automate infrastructure deployment and secret management.

## 🎯 Problem Statement

**Before Automation:**
1. Create AWS resources with Terraform ❌
2. Copy S3 bucket name manually ❌
3. Copy CloudFront distribution ID manually ❌
4. Open GitHub repository settings ❌
5. Create/update each secret individually ❌
6. Repeat for dev and prod environments ❌
7. Repeat for every new project ❌

**Total time: ~15-20 minutes per deployment** 😫

**After Automation:**
```bash
./deploy-and-sync-secrets.sh
# Select environment → Done! ✅
```

**Total time: ~2 minutes (mostly waiting for Terraform)** 🎉

## 🚀 Automated Workflow Options

You have **TWO** automation methods:

### Option 1: Local Script (Recommended for First-Time Setup)
- Run from your local machine
- Interactive menu
- Full control
- Great for initial infrastructure setup

### Option 2: GitHub Actions (Recommended for CI/CD)
- Runs in the cloud
- Triggered manually or on code push
- Perfect for team environments
- Automatic deployments

## 📋 Prerequisites

### 1. Install Required Tools

```bash
# Terraform
brew install terraform  # macOS
# OR
wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip

# AWS CLI
brew install awscli  # macOS
# OR
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"

# GitHub CLI
brew install gh  # macOS
# OR
sudo apt install gh  # Ubuntu/Debian
```

### 2. Configure AWS Credentials

```bash
aws configure
# Enter:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region: us-east-1
# - Default output format: json
```

### 3. Authenticate GitHub CLI

```bash
gh auth login
# Follow prompts:
# - GitHub.com
# - HTTPS
# - Login with a web browser
```

Verify authentication:
```bash
gh auth status
```

## 🔧 Option 1: Local Automation Script

### Quick Start

```bash
cd terraform
./deploy-and-sync-secrets.sh
```

### What It Does

1. ✅ Checks all prerequisites (Terraform, AWS CLI, GitHub CLI)
2. ✅ Detects your GitHub repository automatically
3. ✅ Prompts for AWS credentials setup (one-time)
4. ✅ Shows interactive menu for environment selection
5. ✅ Runs Terraform (init, validate, plan, apply)
6. ✅ Extracts infrastructure outputs automatically
7. ✅ Updates GitHub secrets automatically
8. ✅ Saves outputs to JSON file for reference

### Step-by-Step Example

```bash
$ ./deploy-and-sync-secrets.sh

==========================================
Checking Prerequisites
==========================================

✓ Terraform v1.6.0
✓ AWS CLI aws-cli/2.13.0
✓ GitHub CLI gh version 2.35.0
✓ AWS Account: 123456789012
✓ GitHub CLI authenticated
ℹ Repository: your-username/geekheads

==========================================
AWS Credentials Setup
==========================================

Do you want to update AWS credentials in GitHub secrets?
This is typically only needed once or when rotating credentials.
Update AWS credentials? (yes/no): yes

ℹ Updating AWS credentials in GitHub...
✓ Updated AWS_ACCESS_KEY_ID
✓ Updated AWS_SECRET_ACCESS_KEY
✓ Updated AWS_REGION
✓ AWS credentials updated in GitHub

==========================================
Terraform + GitHub Secrets Automation
==========================================

What would you like to deploy?

1) Geekheads - Dev Environment
2) Geekheads - Prod Environment
3) Both Dev and Prod
4) Setup AWS Credentials Only
5) Exit

Enter choice [1-5]: 1

==========================================
Deploying Terraform: dev
==========================================

ℹ Running terraform init...
ℹ Validating configuration...
✓ Configuration valid
ℹ Creating execution plan...

[Terraform shows plan]

Apply this plan? (yes/no): yes

ℹ Applying infrastructure changes...
✓ Infrastructure deployed successfully

==========================================
Syncing GitHub Secrets: dev
==========================================

ℹ Extracting Terraform outputs...
✓ S3 Bucket: geekheads-dev-website
✓ CloudFront ID: E1ABCD234EFGH5
✓ Website URL: https://d1234567890abc.cloudfront.net

ℹ Updating GitHub repository secrets...
✓ Updated DEV_S3_BUCKET
✓ Updated DEV_CLOUDFRONT_ID
✓ Outputs saved to dev-outputs.json

==========================================
Deployment Complete!
==========================================

✓ Infrastructure deployed: dev
✓ GitHub secrets updated automatically
ℹ You can now push code and GitHub Actions will deploy using these secrets
```

### Script Features

| Feature | Description |
|---------|-------------|
| **Prerequisite Checking** | Validates all required tools are installed |
| **AWS Account Verification** | Confirms correct AWS account |
| **GitHub Authentication** | Verifies GitHub CLI access |
| **Auto Repository Detection** | Finds GitHub repo from git remote |
| **Interactive Menu** | Easy environment selection |
| **Terraform Automation** | Runs full Terraform workflow |
| **Output Extraction** | Captures S3 bucket, CloudFront ID |
| **Secret Sync** | Updates GitHub secrets automatically |
| **JSON Export** | Saves outputs for reference |
| **Error Handling** | Graceful failures with helpful messages |

## 🤖 Option 2: GitHub Actions Automation

### Setup

The workflow is already created at `.github/workflows/terraform-infrastructure.yml`

### How to Use

#### Method 1: Manual Trigger (Workflow Dispatch)

1. Go to GitHub repository → **Actions** tab
2. Select **"Deploy Infrastructure (Terraform)"** workflow
3. Click **"Run workflow"**
4. Select:
   - **Environment**: dev or prod
   - **Project**: geekheads
   - **Action**: plan or apply
5. Click **"Run workflow"**

#### Method 2: Automatic on Code Push

Push changes to the `terraform/` directory:

```bash
git add terraform/
git commit -m "Update infrastructure configuration"
git push origin main
```

The workflow automatically:
1. Detects changes in `terraform/**`
2. Runs Terraform plan
3. Applies changes (if on main branch)
4. Updates GitHub secrets

### Workflow Features

| Feature | Description |
|---------|-------------|
| **Manual Triggering** | Deploy via GitHub UI |
| **Automatic on Push** | Deploy when terraform files change |
| **Plan on PR** | Show plan in PR comments |
| **Environment Gates** | Require approval for prod (optional) |
| **Secret Auto-Update** | Updates GitHub secrets after deployment |
| **Deployment Summary** | Shows outputs in GitHub Actions summary |
| **Multi-Project** | Works with geekheads, fransolutions, etc. |

### GitHub Actions Permissions

**Important:** The workflow needs permission to update secrets.

Add this to your repository settings:
1. Go to **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, select:
   - ✅ **Read and write permissions**
3. Click **Save**

## 🔐 Secrets Management

### Secrets Created Automatically

The automation creates these secrets:

#### Per Environment
| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `DEV_S3_BUCKET` | Dev S3 bucket name | `geekheads-dev-website` |
| `DEV_CLOUDFRONT_ID` | Dev CloudFront distribution | `E1ABCD234EFGH5` |
| `PROD_S3_BUCKET` | Prod S3 bucket name | `geekheads-prod-website` |
| `PROD_CLOUDFRONT_ID` | Prod CloudFront distribution | `E2WXYZ567IJKL8` |

#### AWS Credentials (One-Time)
| Secret Name | Description |
|-------------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |
| `AWS_REGION` | AWS region (us-east-1) |

### Verify Secrets

```bash
# Using GitHub CLI
gh secret list

# Or check in GitHub UI
# Repository → Settings → Secrets and variables → Actions
```

## 📊 Complete Workflow Diagram

```
┌─────────────────────────────────────────────────────────┐
│  Developer                                              │
│  Runs: ./deploy-and-sync-secrets.sh                   │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  Prerequisites Check                                    │
│  • Terraform installed? ✓                              │
│  • AWS CLI configured? ✓                               │
│  • GitHub CLI authenticated? ✓                         │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  One-Time Setup (Optional)                             │
│  • Update AWS credentials in GitHub secrets            │
│    - AWS_ACCESS_KEY_ID                                 │
│    - AWS_SECRET_ACCESS_KEY                             │
│    - AWS_REGION                                        │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  Select Environment                                     │
│  • Dev                                                  │
│  • Prod (with confirmation)                            │
│  • Both                                                 │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  Terraform Deployment                                   │
│  1. terraform init                                      │
│  2. terraform validate                                  │
│  3. terraform plan                                      │
│  4. terraform apply (after confirmation)               │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  Extract Outputs                                        │
│  • S3 Bucket Name                                       │
│  • CloudFront Distribution ID                           │
│  • Website URL                                          │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  Update GitHub Secrets (Automatic)                      │
│  • DEV_S3_BUCKET or PROD_S3_BUCKET                     │
│  • DEV_CLOUDFRONT_ID or PROD_CLOUDFRONT_ID            │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  Save Outputs to File                                   │
│  • dev-outputs.json or prod-outputs.json               │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  ✅ COMPLETE                                            │
│  GitHub Actions workflows can now deploy automatically │
└─────────────────────────────────────────────────────────┘
```

## 🎨 Multi-Project Setup

### Adding Fransolutions

```bash
# 1. Create fransolutions infrastructure
mkdir -p terraform/sites/fransolutions/{dev,prod}

# 2. Copy geekheads config as template
cp -r terraform/sites/geekheads/dev/* terraform/sites/fransolutions/dev/
cp -r terraform/sites/geekheads/prod/* terraform/sites/fransolutions/prod/

# 3. Update project names in main.tf and terraform.tfvars

# 4. Deploy with automation
./deploy-and-sync-secrets.sh
# (Update script to include fransolutions in menu)
```

### Script Modification for Multiple Projects

Edit `deploy-and-sync-secrets.sh` main_menu function:

```bash
echo "1) Geekheads - Dev"
echo "2) Geekheads - Prod"
echo "3) Fransolutions - Dev"
echo "4) Fransolutions - Prod"
echo "5) Portfolio - Dev"
echo "6) Portfolio - Prod"
echo "7) Setup AWS Credentials Only"
echo "8) Exit"
```

## 🔄 Daily Workflow

### First Time (Per Project)
```bash
# 1. Deploy infrastructure and setup secrets
cd terraform
./deploy-and-sync-secrets.sh

# 2. Verify secrets
gh secret list

# 3. Done! GitHub Actions now work automatically
```

### Regular Development
```bash
# Just push code - GitHub Actions handles deployment automatically
git add .
git commit -m "Update website content"
git push
```

### Infrastructure Changes
```bash
# Option 1: Local script
cd terraform
./deploy-and-sync-secrets.sh

# Option 2: GitHub Actions
# Push terraform changes, workflow runs automatically
git add terraform/
git commit -m "Update infrastructure"
git push
```

## 🆘 Troubleshooting

### Issue: "GitHub CLI not authenticated"
```bash
gh auth login
gh auth status
```

### Issue: "AWS credentials not configured"
```bash
aws configure
aws sts get-caller-identity  # Verify
```

### Issue: "Terraform backend not initialized"
```bash
cd terraform/sites/geekheads/dev
terraform init -upgrade
```

### Issue: "Permission denied: gh secret set"
- Ensure repository has write permissions
- Check GitHub token permissions
- Re-authenticate: `gh auth login`

### Issue: "Secrets not updating in GitHub Actions"
1. Check workflow permissions (Settings → Actions → General)
2. Enable "Read and write permissions"
3. Re-run workflow

## 📚 Advanced Features

### Automated Backend Setup

Create remote state backend automatically:

```bash
# Run once to setup shared Terraform state
./scripts/setup-terraform-backend.sh
```

### Multi-Environment Deploy

Deploy to all environments:

```bash
./deploy-and-sync-secrets.sh
# Select option "3) Both Dev and Prod"
```

### Notifications

Add Slack notifications to GitHub Actions workflow (optional):

```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 🎯 Benefits Summary

| Before Automation | After Automation |
|-------------------|------------------|
| 15-20 minutes manual work | 2 minutes automated |
| Error-prone copying | Zero copy-paste errors |
| Repeat for every project | Reusable for all projects |
| Manual secret updates | Automatic secret sync |
| Context switching (AWS ↔ GitHub) | Single command |
| Easy to forget steps | Consistent process |

## 📖 Next Steps

1. ✅ Run automation script for dev environment
2. ✅ Verify GitHub secrets were created
3. ✅ Test GitHub Actions deployment workflow
4. ✅ Deploy production environment
5. ✅ Add more projects (fransolutions, portfolio)
6. ✅ Set up remote state backend (optional)
7. ✅ Configure environment protection rules (optional)
8. ✅ Add Slack notifications (optional)

## 🔗 Related Documentation

- [Terraform README](./README.md) - Infrastructure overview
- [Adding New Sites](./ADDING_NEW_SITES.md) - Multi-site setup
- [GitHub Actions Workflows](../.github/workflows/) - CI/CD pipelines
- [Module Documentation](./modules/static-website/README.md) - Reusable module

---

**Questions?** Check the main [Terraform README](./README.md) or create an issue.
