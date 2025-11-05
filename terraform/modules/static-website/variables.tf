# ============================================
# Required Variables
# ============================================

variable "project_name" {
  description = "Name of the project (e.g., geekheads, fransolutions)"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "bucket_name" {
  description = "Name of the S3 bucket for static website hosting"
  type        = string
}

# ============================================
# Optional Variables with Defaults
# ============================================

variable "domain_aliases" {
  description = "List of domain aliases for CloudFront (e.g., [\"www.example.com\", \"example.com\"])"
  type        = list(string)
  default     = []
}

variable "acm_certificate_arn" {
  description = "ARN of the ACM certificate for HTTPS (must be in us-east-1 for CloudFront)"
  type        = string
  default     = null
}

variable "route53_zone_id" {
  description = "Route53 hosted zone ID for DNS records"
  type        = string
  default     = null
}

variable "enable_versioning" {
  description = "Enable S3 bucket versioning"
  type        = bool
  default     = true
}

variable "cloudfront_price_class" {
  description = "CloudFront price class (PriceClass_All, PriceClass_200, PriceClass_100)"
  type        = string
  default     = "PriceClass_100"

  validation {
    condition     = contains(["PriceClass_All", "PriceClass_200", "PriceClass_100"], var.cloudfront_price_class)
    error_message = "Price class must be PriceClass_All, PriceClass_200, or PriceClass_100."
  }
}

variable "cache_min_ttl" {
  description = "Minimum TTL for CloudFront cache (seconds)"
  type        = number
  default     = 0
}

variable "cache_default_ttl" {
  description = "Default TTL for CloudFront cache (seconds)"
  type        = number
  default     = 86400 # 24 hours
}

variable "cache_max_ttl" {
  description = "Maximum TTL for CloudFront cache (seconds)"
  type        = number
  default     = 31536000 # 1 year
}

variable "tags" {
  description = "Additional tags to apply to all resources"
  type        = map(string)
  default     = {}
}
