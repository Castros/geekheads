
# Remote Terraform Modules Pattern

## Overview

**Pattern:** Centralized Terraform modules repository referenced by multiple project repositories

**Why:** This is the professional/enterprise approach to managing Terraform infrastructure at scale.

## Architecture

### Current Setup (Single Repo)
```
geekheads/
└── terraform/
    ├── modules/
    │   └── static-website/     # Module lives in project repo
    └── sites/
        └── geekheads/
            └── dev/
                └── main.tf     # References local module: ../../../modules/static-website
```

**Issues:**
- ❌ Module duplicated across every project (geekheads, fransolutions, portfolio)
- ❌ Updates must be made in each project separately
- ❌ Version inconsistency across projects
- ❌ No centralized module governance

### Remote Modules Setup (Multi-Repo)
```
# Repository 1: terraform-modules (Central)
terraform-modules/
├── modules/
│   ├── aws-static-website/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── README.md
│   ├── aws-lambda-api/
│   ├── aws-rds-postgres/
│   └── ...
└── README.md

# Repository 2: geekheads (Project)
geekheads/
└── terraform/
    └── sites/
        └── geekheads/
            └── dev/
                └── main.tf     # References remote: git::github.com/you/terraform-modules//modules/aws-static-website?ref=v1.0.0

# Repository 3: fransolutions (Project)
fransolutions/
└── terraform/
    └── sites/
        └── fransolutions/
            └── prod/
                └── main.tf     # References same remote module

# Repository 4: portfolio (Project)
portfolio/
└── terraform/
    └── sites/
        └── portfolio/
            └── prod/
                └── main.tf     # References same remote module
```

**Benefits:**
- ✅ Single source of truth for modules
- ✅ Version control per module
- ✅ Easy updates across all projects
- ✅ Centralized testing and validation
- ✅ Module governance and standards
- ✅ Smaller project repositories

## How It Works

### 1. Central Modules Repository

**Repository:** `terraform-modules`

**Structure:**
```
terraform-modules/
├── .github/
│   └── workflows/
│       ├── validate.yml          # Validate all modules
│       └── release.yml           # Tag and release
├── modules/
│   ├── aws-static-website/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   ├── versions.tf
│   │   └── README.md
│   ├── aws-lambda-api/
│   │   └── ...
│   └── aws-rds-postgres/
│       └── ...
├── tests/                        # Terratest or similar
├── .gitignore
└── README.md
```

**Module Versioning:** Use Git tags
```bash
# Tag a release
git tag -a v1.0.0 -m "Initial release of aws-static-website"
git push origin v1.0.0

# Tag an update
git tag -a v1.1.0 -m "Add custom error pages support"
git push origin v1.1.0
```

### 2. Project Repositories Reference Remote Modules

**In geekheads/terraform/sites/geekheads/dev/main.tf:**

```hcl
# Instead of local module:
# module "website" {
#   source = "../../../modules/static-website"
# }

# Use remote module:
module "geekheads_dev" {
  source = "git::https://github.com/your-org/terraform-modules.git//modules/aws-static-website?ref=v1.0.0"

  project_name = "geekheads"
  environment  = "dev"
  bucket_name  = "geekheads-dev-website"

  # ... other variables
}
```

### Module Source Formats

#### GitHub (HTTPS)
```hcl
source = "git::https://github.com/your-org/terraform-modules.git//modules/aws-static-website?ref=v1.0.0"
```

#### GitHub (SSH)
```hcl
source = "git::ssh://git@github.com/your-org/terraform-modules.git//modules/aws-static-website?ref=v1.0.0"
```

#### Specific Branch
```hcl
source = "git::https://github.com/your-org/terraform-modules.git//modules/aws-static-website?ref=main"
```

#### Specific Commit
```hcl
source = "git::https://github.com/your-org/terraform-modules.git//modules/aws-static-website?ref=abc123def"
```

#### Terraform Registry (Advanced)
```hcl
source = "app.terraform.io/your-org/static-website/aws"
version = "1.0.0"
```

### 3. Version Pinning Strategy

**Recommended Approach:**

| Environment | Version Strategy | Example |
|-------------|------------------|---------|
| **Development** | Latest tag or main branch | `?ref=main` or `?ref=v1` |
| **Staging** | Minor version | `?ref=v1.1` |
| **Production** | Exact version | `?ref=v1.1.0` |

**Example:**

```hcl
# Dev - always latest features
module "geekheads_dev" {
  source = "git::https://github.com/your-org/terraform-modules.git//modules/aws-static-website?ref=main"
  # ...
}

# Prod - pinned to exact version
module "geekheads_prod" {
  source = "git::https://github.com/your-org/terraform-modules.git//modules/aws-static-website?ref=v1.0.0"
  # ...
}
```

## Migration Plan

### Step 1: Create Central Modules Repository

```bash
# Create new repository
mkdir terraform-modules
cd terraform-modules
git init

# Create structure
mkdir -p modules/aws-static-website
mkdir -p .github/workflows

# Copy existing module
cp -r ../geekheads/terraform/modules/static-website/* modules/aws-static-website/

# Rename for clarity
mv modules/aws-static-website/main.tf modules/aws-static-website/main.tf
# ... keep all files

# Create README
cat > README.md << 'EOF'
# Terraform Modules

Centralized Terraform modules for all projects.

## Available Modules

- **aws-static-website**: S3 + CloudFront static site hosting

## Usage

See individual module READMEs for details.

## Versioning

Modules are versioned using Git tags. Use semantic versioning (v1.0.0).
EOF

# Initial commit
git add .
git commit -m "Initial commit: aws-static-website module"

# Create GitHub repository and push
gh repo create terraform-modules --public --source=. --remote=origin --push

# Tag first version
git tag -a v1.0.0 -m "Initial release"
git push origin v1.0.0
```

### Step 2: Update Project Repositories

**In each project (geekheads, fransolutions, portfolio):**

```bash
cd geekheads/terraform/sites/geekheads/dev

# Edit main.tf to use remote module
# Before:
#   source = "../../../modules/static-website"
# After:
#   source = "git::https://github.com/your-org/terraform-modules.git//modules/aws-static-website?ref=v1.0.0"

# Remove local modules directory (no longer needed)
cd ../../../
rm -rf modules/

# Re-initialize Terraform to download remote module
cd sites/geekheads/dev
terraform init -upgrade

# Verify
terraform plan  # Should show no changes
```

### Step 3: Delete Local Modules

Once all projects reference remote modules:

```bash
# In geekheads, fransolutions, portfolio
rm -rf terraform/modules/

# Commit changes
git add .
git commit -m "Migrate to remote Terraform modules"
git push
```

## Module Update Workflow

### Scenario: Update Module in Central Repo

```bash
cd terraform-modules

# Make changes to module
vim modules/aws-static-website/main.tf

# Test changes
cd modules/aws-static-website
terraform init
terraform validate

# Commit and tag
git add .
git commit -m "Add support for custom error pages"
git tag -a v1.1.0 -m "Add custom error pages support"
git push origin main
git push origin v1.1.0
```

### Scenario: Update Project to Use New Module Version

```bash
cd geekheads/terraform/sites/geekheads/dev

# Edit main.tf
# Change: ?ref=v1.0.0
# To:     ?ref=v1.1.0

# Update module
terraform init -upgrade

# Review changes
terraform plan

# Apply
terraform apply
```

## Real-World Example

### Central Modules Repo Structure

```
terraform-modules/
├── modules/
│   ├── aws-static-website/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── README.md
│   ├── aws-lambda-api/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── README.md
│   ├── aws-rds-postgres/
│   │   └── ...
│   └── aws-vpc-network/
│       └── ...
├── .github/
│   └── workflows/
│       ├── validate.yml
│       └── tag-release.yml
└── README.md
```

### Project Using Multiple Modules

**geekheads/terraform/sites/geekheads/prod/main.tf:**

```hcl
terraform {
  required_version = ">= 1.0"
}

provider "aws" {
  region = "us-east-1"
}

# Static website module from central repo
module "website" {
  source = "git::https://github.com/your-org/terraform-modules.git//modules/aws-static-website?ref=v1.1.0"

  project_name = "geekheads"
  environment  = "prod"
  bucket_name  = "geekheads-prod-website"

  domain_aliases      = ["www.geekheadsolutions.com"]
  acm_certificate_arn = var.acm_certificate_arn
}

# Lambda API module from central repo
module "contact_api" {
  source = "git::https://github.com/your-org/terraform-modules.git//modules/aws-lambda-api?ref=v2.0.0"

  function_name = "geekheads-contact-form"
  runtime       = "nodejs18.x"
  handler       = "index.handler"
}

# VPC module from central repo
module "vpc" {
  source = "git::https://github.com/your-org/terraform-modules.git//modules/aws-vpc-network?ref=v1.0.0"

  vpc_name = "geekheads-prod"
  cidr     = "10.0.0.0/16"
}
```

## Governance & Best Practices

### Module Development Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/add-waf-support
   ```

2. **Develop & Test**
   ```bash
   # Make changes
   terraform validate
   terraform fmt
   ```

3. **Create Pull Request**
   - Automated tests run
   - Peer review required
   - Merge to main

4. **Tag Release**
   ```bash
   git tag -a v1.2.0 -m "Add WAF support"
   git push origin v1.2.0
   ```

### Version Strategy

**Semantic Versioning:**
- **MAJOR** (v2.0.0): Breaking changes
- **MINOR** (v1.1.0): New features, backward compatible
- **PATCH** (v1.0.1): Bug fixes

**Git Tags:**
```bash
# Major release (breaking changes)
git tag -a v2.0.0 -m "Breaking: Restructure CloudFront configuration"

# Minor release (new features)
git tag -a v1.1.0 -m "Add custom error pages support"

# Patch release (bug fixes)
git tag -a v1.0.1 -m "Fix S3 bucket policy syntax"
```

### Module Standards

**Required Files:**
- `main.tf` - Main resources
- `variables.tf` - Input variables
- `outputs.tf` - Output values
- `versions.tf` - Terraform/provider versions
- `README.md` - Documentation
- `CHANGELOG.md` - Version history

**Example versions.tf:**
```hcl
terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
```

## Advantages vs Disadvantages

### Advantages ✅

| Advantage | Description |
|-----------|-------------|
| **Single Source of Truth** | One place to update modules |
| **Version Control** | Pin projects to specific versions |
| **Testing** | Test modules independently |
| **Reusability** | Use across unlimited projects |
| **Standards** | Enforce organizational standards |
| **Governance** | Control who can update modules |
| **Smaller Repos** | Project repos are lighter |
| **Rollback** | Easy to revert to previous versions |

### Disadvantages ❌

| Disadvantage | Mitigation |
|--------------|------------|
| **Network Dependency** | Terraform caches modules locally |
| **Initial Setup** | One-time effort, long-term gain |
| **Version Management** | Use clear versioning strategy |
| **Breaking Changes** | Use semantic versioning |

## Common Patterns

### Pattern 1: Environment-Specific Versions

```hcl
# dev/main.tf - use latest
module "website" {
  source = "git::https://github.com/you/terraform-modules.git//modules/aws-static-website?ref=main"
}

# prod/main.tf - use stable version
module "website" {
  source = "git::https://github.com/you/terraform-modules.git//modules/aws-static-website?ref=v1.0.0"
}
```

### Pattern 2: Private Module Registry (Advanced)

**Terraform Cloud/Enterprise:**
```hcl
module "website" {
  source  = "app.terraform.io/your-org/static-website/aws"
  version = "~> 1.0"
}
```

### Pattern 3: Monorepo Modules

**Some organizations keep modules in same repo:**
```
company-infrastructure/
├── modules/
│   └── aws-static-website/
└── projects/
    ├── geekheads/
    ├── fransolutions/
    └── portfolio/
```

**Reference:**
```hcl
module "website" {
  source = "../../modules/aws-static-website"
}
```

## Troubleshooting

### Module Not Found
```bash
# Clear module cache
rm -rf .terraform/modules

# Re-download
terraform init -upgrade
```

### Authentication Issues (Private Repos)
```bash
# Configure Git credentials
git config --global credential.helper store

# Or use SSH
source = "git::ssh://git@github.com/your-org/terraform-modules.git//..."
```

### Version Not Found
```bash
# List available tags
git ls-remote --tags https://github.com/your-org/terraform-modules.git

# Fetch latest tags
git fetch --tags
```

## Next Steps

1. **Create `terraform-modules` Repository**
   - Move existing modules
   - Tag v1.0.0

2. **Update Geekheads**
   - Reference remote module
   - Test deployment

3. **Migrate Other Projects**
   - Fransolutions
   - Portfolio

4. **Establish Governance**
   - Module review process
   - Versioning standards
   - Testing requirements

## Example GitHub Workflow (Central Repo)

**.github/workflows/validate.yml:**
```yaml
name: Validate Modules

on:
  pull_request:
  push:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3

      - name: Terraform Format
        run: terraform fmt -check -recursive

      - name: Validate aws-static-website
        working-directory: modules/aws-static-website
        run: |
          terraform init
          terraform validate
```

## Resources

- [Terraform Module Sources](https://www.terraform.io/docs/modules/sources.html)
- [Semantic Versioning](https://semver.org/)
- [Terraform Registry](https://registry.terraform.io/)
- [Private Module Registry](https://www.terraform.io/docs/cloud/registry/index.html)

---

**Recommendation:** Start with GitHub-based remote modules (easiest), then optionally move to Terraform Cloud/Enterprise private registry as you scale.
