# Static Website Module

Reusable Terraform module for deploying static websites on AWS using S3 and CloudFront.

## Features

- ✅ S3 bucket for static website hosting
- ✅ CloudFront CDN distribution
- ✅ Origin Access Control (OAC) for secure S3 access
- ✅ Custom domain support with ACM certificates
- ✅ Route53 DNS record management
- ✅ S3 versioning support
- ✅ SPA routing support (404/403 → index.html)
- ✅ HTTPS enforcement
- ✅ Configurable caching policies

## Usage

```hcl
module "website" {
  source = "../../modules/static-website"

  project_name = "geekheads"
  environment  = "prod"
  bucket_name  = "geekheads-prod-website"

  # Optional: Custom domain
  domain_aliases      = ["www.geekheadsolutions.com", "geekheadsolutions.com"]
  acm_certificate_arn = "arn:aws:acm:us-east-1:123456789012:certificate/..."
  route53_zone_id     = "Z1234567890ABC"

  # Optional: Caching configuration
  cache_default_ttl = 86400  # 24 hours
  cache_max_ttl     = 31536000  # 1 year

  tags = {
    ManagedBy = "Terraform"
    Owner     = "DevOps Team"
  }
}
```

## Required Variables

| Name | Description | Type |
|------|-------------|------|
| `project_name` | Name of the project | `string` |
| `environment` | Environment (dev/staging/prod) | `string` |
| `bucket_name` | S3 bucket name | `string` |

## Optional Variables

| Name | Description | Type | Default |
|------|-------------|------|---------|
| `domain_aliases` | Custom domain names | `list(string)` | `[]` |
| `acm_certificate_arn` | ACM certificate ARN (us-east-1) | `string` | `null` |
| `route53_zone_id` | Route53 hosted zone ID | `string` | `null` |
| `enable_versioning` | Enable S3 versioning | `bool` | `true` |
| `cloudfront_price_class` | CloudFront price class | `string` | `PriceClass_100` |
| `cache_default_ttl` | Default cache TTL (seconds) | `number` | `86400` |
| `tags` | Additional resource tags | `map(string)` | `{}` |

## Outputs

| Name | Description |
|------|-------------|
| `s3_bucket_id` | S3 bucket name |
| `cloudfront_distribution_id` | CloudFront distribution ID |
| `cloudfront_domain_name` | CloudFront domain name |
| `website_url` | Complete website URL |
| `deployment_info` | All deployment information for CI/CD |

## Notes

- ACM certificates for CloudFront must be created in `us-east-1` region
- The module configures SPA routing (404/403 errors redirect to index.html)
- CloudFront uses Origin Access Control (OAC) for secure S3 access
