# ============================================
# AWS Configuration
# ============================================

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

# ============================================
# S3 Configuration
# ============================================

variable "bucket_name" {
  description = "Name of the S3 bucket for dev environment"
  type        = string
  default     = "geekheads-dev-website"
}

# ============================================
# CloudFront Configuration
# ============================================

variable "cloudfront_price_class" {
  description = "CloudFront price class"
  type        = string
  default     = "PriceClass_100" # US, Canada, Europe
}

# ============================================
# Domain Configuration (Optional)
# ============================================

variable "domain_aliases" {
  description = "Custom domain names for dev environment"
  type        = list(string)
  default     = []
  # Example: ["dev.geekheadsolutions.com"]
}

variable "acm_certificate_arn" {
  description = "ACM certificate ARN for custom domain (must be in us-east-1)"
  type        = string
  default     = null
}

variable "route53_zone_id" {
  description = "Route53 hosted zone ID"
  type        = string
  default     = null
}
