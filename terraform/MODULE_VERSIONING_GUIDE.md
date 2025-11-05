# Module Versioning & Tagging Guide

## Overview

When using remote Terraform modules from a central repository, proper versioning is critical for:
- **Stability**: Pin production to tested versions
- **Safety**: Prevent unexpected changes
- **Traceability**: Know what version is deployed where
- **Rollback**: Easy to revert to previous versions

## Semantic Versioning

We use **Semantic Versioning** (SemVer) for all modules.

### Version Format: `v<MAJOR>.<MINOR>.<PATCH>`

| Component | When to Increment | Example |
|-----------|-------------------|---------|
| **MAJOR** | Breaking changes that require user action | v1.0.0 → v2.0.0 |
| **MINOR** | New features, backward compatible | v1.0.0 → v1.1.0 |
| **PATCH** | Bug fixes, no new features | v1.0.0 → v1.0.1 |

### Examples

#### MAJOR Version (Breaking Changes)
```
v1.5.2 → v2.0.0

Breaking changes:
- Renamed variable `bucket_name` to `s3_bucket_name`
- Removed deprecated output `old_endpoint`
- Changed default CloudFront price class
```

**Impact:** Projects must update their code

#### MINOR Version (New Features)
```
v1.0.0 → v1.1.0

New features:
- Added custom error page support
- New optional variable: error_page_path
- New output: error_config
```

**Impact:** Projects can optionally use new features

#### PATCH Version (Bug Fixes)
```
v1.1.0 → v1.1.1

Bug fixes:
- Fixed S3 bucket policy syntax error
- Corrected CloudFront cache behavior
```

**Impact:** No code changes needed, just upgrade

## Git Tagging Workflow

### Creating a New Release

#### 1. Make Changes and Test
```bash
cd terraform-modules

# Create feature branch
git checkout -b feature/add-waf-support

# Make changes to module
vim modules/aws-static-website/main.tf

# Test locally
cd modules/aws-static-website
terraform init
terraform validate
terraform fmt

# Commit changes
git add .
git commit -m "Add WAF support to static website module"
```

#### 2. Create Pull Request
```bash
gh pr create \
  --title "Add WAF support to static website" \
  --body "Adds optional WAF web ACL integration"
```

#### 3. Merge and Tag
```bash
# After PR is merged, pull latest main
git checkout main
git pull origin main

# Determine version bump
# - Breaking change? → MAJOR
# - New feature? → MINOR
# - Bug fix? → PATCH

# Tag new version (example: minor release)
git tag -a v1.1.0 -m "Add WAF support"

# Push tag
git push origin v1.1.0
```

### Tag Naming Conventions

**Format:** Always use `v` prefix

✅ Good:
- `v1.0.0`
- `v1.1.0`
- `v2.0.0`

❌ Bad:
- `1.0.0` (missing v prefix)
- `version-1.0.0` (wrong format)
- `release-1.0.0` (wrong format)

### Annotated vs Lightweight Tags

**Always use annotated tags** (with `-a` flag):

```bash
# ✅ Annotated (recommended)
git tag -a v1.0.0 -m "Initial release"

# ❌ Lightweight (don't use)
git tag v1.0.0
```

**Why?** Annotated tags include:
- Tagger name and email
- Tag date
- Tag message
- Can be signed with GPG

## Version Pinning Strategy

### By Environment

| Environment | Strategy | Example | Auto-Update? |
|-------------|----------|---------|--------------|
| **Development** | `main` branch | `?ref=main` | Yes - gets latest |
| **Staging** | Minor version | `?ref=v1.1` | Yes - gets patches |
| **Production** | Exact version | `?ref=v1.1.0` | No - manual only |

### Development
```hcl
module "website" {
  source = "git::https://github.com/you/terraform-modules.git//modules/aws-static-website?ref=main"
  # Always pulls latest from main branch
  # Good for: Testing new features
  # Risk: May break unexpectedly
}
```

### Staging
```hcl
module "website" {
  source = "git::https://github.com/you/terraform-modules.git//modules/aws-static-website?ref=v1.1"
  # Pulls latest v1.1.x (v1.1.0, v1.1.1, v1.1.2, etc.)
  # Good for: Getting bug fixes automatically
  # Risk: Low - patches shouldn't break
}
```

### Production
```hcl
module "website" {
  source = "git::https://github.com/you/terraform-modules.git//modules/aws-static-website?ref=v1.1.0"
  # Only this exact version
  # Good for: Maximum stability
  # Risk: None - never changes
}
```

## Changelog Management

### CHANGELOG.md Format

Keep a `CHANGELOG.md` in your terraform-modules repository:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- WAF integration (in progress)

## [1.1.0] - 2025-11-03

### Added
- Custom error page support via `error_page_path` variable
- New output: `error_config`

### Changed
- Updated CloudFront cache behavior for better performance

### Deprecated
- `old_cache_policy` variable (use `cache_behavior` instead)

## [1.0.1] - 2025-11-02

### Fixed
- S3 bucket policy syntax error
- CloudFront origin access control configuration

## [1.0.0] - 2025-11-01

### Added
- Initial release
- S3 + CloudFront static website module
- Origin Access Control (OAC)
- Custom domain support
- SSL/TLS integration

[Unreleased]: https://github.com/you/terraform-modules/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/you/terraform-modules/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/you/terraform-modules/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/you/terraform-modules/releases/tag/v1.0.0
```

### Update Workflow

```bash
# Before tagging, update CHANGELOG.md

# 1. Move items from [Unreleased] to new version section
vim CHANGELOG.md

# 2. Commit changelog
git add CHANGELOG.md
git commit -m "Update CHANGELOG for v1.1.0"

# 3. Tag release
git tag -a v1.1.0 -m "Release v1.1.0: Add WAF support"
git push origin main
git push origin v1.1.0
```

## Module Upgrade Guide

### For Module Users (Projects)

#### Upgrading Dev Environment
```bash
cd geekheads/terraform/sites/geekheads/dev

# 1. Update main.tf
# Change: ?ref=v1.0.0
# To:     ?ref=v1.1.0

# 2. Download new version
terraform init -upgrade

# 3. Review changes
terraform plan

# 4. Apply if good
terraform apply
```

#### Upgrading Production (Carefully)
```bash
cd geekheads/terraform/sites/geekheads/prod

# 1. Check CHANGELOG for breaking changes
# View: https://github.com/you/terraform-modules/blob/main/CHANGELOG.md

# 2. Test in dev/staging first!

# 3. Update main.tf
# Change: ?ref=v1.0.0
# To:     ?ref=v1.1.0

# 4. Create backup of state
terraform state pull > backup-$(date +%Y%m%d).tfstate

# 5. Plan and review carefully
terraform init -upgrade
terraform plan > plan-output.txt

# 6. Review plan-output.txt thoroughly

# 7. Apply during maintenance window
terraform apply
```

## Version Comparison

### Finding Available Versions

```bash
# List all tags in terraform-modules repo
git ls-remote --tags https://github.com/you/terraform-modules.git

# Or with GitHub CLI
gh release list --repo you/terraform-modules

# Or view on GitHub
# https://github.com/you/terraform-modules/tags
```

### Viewing Changes Between Versions

```bash
# Compare two versions
git diff v1.0.0..v1.1.0

# View commits between versions
git log v1.0.0..v1.1.0

# Or on GitHub
# https://github.com/you/terraform-modules/compare/v1.0.0...v1.1.0
```

## Pre-release Versions

For testing before official release:

### Creating Pre-release

```bash
# Create release candidate
git tag -a v2.0.0-rc1 -m "Release candidate 1 for v2.0.0"
git push origin v2.0.0-rc1

# Create beta version
git tag -a v2.0.0-beta1 -m "Beta 1 for v2.0.0"
git push origin v2.0.0-beta1

# Create alpha version
git tag -a v2.0.0-alpha1 -m "Alpha 1 for v2.0.0"
git push origin v2.0.0-alpha1
```

### Using Pre-release

```hcl
# Test release candidate in dev
module "website" {
  source = "git::https://github.com/you/terraform-modules.git//modules/aws-static-website?ref=v2.0.0-rc1"
  # ...
}
```

### Pre-release Naming

Format: `v<MAJOR>.<MINOR>.<PATCH>-<TYPE><NUMBER>`

Examples:
- `v2.0.0-alpha1` → Early testing
- `v2.0.0-beta1` → Feature complete, testing
- `v2.0.0-rc1` → Release candidate

## Deprecation Policy

### Deprecating Features

**Mark as deprecated but don't remove immediately:**

```hcl
variable "old_bucket_name" {
  description = "DEPRECATED: Use 'bucket_name' instead. This will be removed in v2.0.0"
  type        = string
  default     = null

  validation {
    condition     = var.old_bucket_name == null
    error_message = "The 'old_bucket_name' variable is deprecated. Use 'bucket_name' instead."
  }
}
```

**Timeline:**
1. **v1.5.0**: Mark as deprecated, add warning
2. **v1.6.0+**: Continue supporting with warnings
3. **v2.0.0**: Remove entirely (breaking change)

### Communicating Deprecations

**In CHANGELOG.md:**
```markdown
## [1.5.0] - 2025-11-15

### Deprecated
- `old_bucket_name` variable - Use `bucket_name` instead
  - Will be removed in v2.0.0 (planned for 2026-Q1)
```

**In README.md:**
```markdown
## Migration Guide

### Upgrading to v2.0.0

Breaking changes:
- Removed `old_bucket_name` (deprecated in v1.5.0)
  - Replace with `bucket_name`
```

## Automated Versioning (Advanced)

### GitHub Actions for Auto-Tagging

**.github/workflows/release.yml:**
```yaml
name: Release

on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to release (e.g., v1.1.0)'
        required: true

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.event.inputs.version }}
          release_name: Release ${{ github.event.inputs.version }}
          draft: false
          prerelease: false
```

## Best Practices Summary

### ✅ DO

- Use semantic versioning (MAJOR.MINOR.PATCH)
- Always use annotated tags (`git tag -a`)
- Maintain CHANGELOG.md
- Pin production to exact versions
- Test in dev before upgrading prod
- Document breaking changes clearly
- Use pre-release versions for testing

### ❌ DON'T

- Use lightweight tags
- Skip version numbers
- Make breaking changes in MINOR/PATCH
- Use `main` branch in production
- Remove deprecated features without warning
- Forget to update CHANGELOG

## Quick Reference

### Create New Release
```bash
# Minor feature release
git tag -a v1.1.0 -m "Add new feature"
git push origin v1.1.0

# Patch bug fix
git tag -a v1.0.1 -m "Fix bug"
git push origin v1.0.1

# Major breaking change
git tag -a v2.0.0 -m "Breaking changes"
git push origin v2.0.0
```

### Upgrade Module
```bash
# 1. Edit main.tf: change ?ref=v1.0.0 to ?ref=v1.1.0
# 2. Download new version
terraform init -upgrade
# 3. Check changes
terraform plan
# 4. Apply
terraform apply
```

### Check Available Versions
```bash
gh release list --repo you/terraform-modules
```

---

**Remember:** Good versioning = happy users! 🎉
