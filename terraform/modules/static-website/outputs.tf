# ============================================
# S3 Bucket Outputs
# ============================================

output "s3_bucket_id" {
  description = "The name of the S3 bucket"
  value       = aws_s3_bucket.website.id
}

output "s3_bucket_arn" {
  description = "The ARN of the S3 bucket"
  value       = aws_s3_bucket.website.arn
}

output "s3_bucket_domain_name" {
  description = "The bucket domain name"
  value       = aws_s3_bucket.website.bucket_domain_name
}

output "s3_bucket_regional_domain_name" {
  description = "The bucket region-specific domain name"
  value       = aws_s3_bucket.website.bucket_regional_domain_name
}

# ============================================
# CloudFront Outputs
# ============================================

output "cloudfront_distribution_id" {
  description = "The identifier for the CloudFront distribution"
  value       = aws_cloudfront_distribution.website.id
}

output "cloudfront_distribution_arn" {
  description = "The ARN of the CloudFront distribution"
  value       = aws_cloudfront_distribution.website.arn
}

output "cloudfront_domain_name" {
  description = "The domain name of the CloudFront distribution"
  value       = aws_cloudfront_distribution.website.domain_name
}

output "cloudfront_hosted_zone_id" {
  description = "The CloudFront Route 53 zone ID"
  value       = aws_cloudfront_distribution.website.hosted_zone_id
}

# ============================================
# Complete Website URL
# ============================================

output "website_url" {
  description = "The complete website URL (custom domain or CloudFront)"
  value       = length(var.domain_aliases) > 0 ? "https://${var.domain_aliases[0]}" : "https://${aws_cloudfront_distribution.website.domain_name}"
}

# ============================================
# Useful Information for CI/CD
# ============================================

output "deployment_info" {
  description = "Information needed for CI/CD deployment"
  value = {
    bucket_name         = aws_s3_bucket.website.id
    cloudfront_id       = aws_cloudfront_distribution.website.id
    cloudfront_domain   = aws_cloudfront_distribution.website.domain_name
    website_url         = length(var.domain_aliases) > 0 ? "https://${var.domain_aliases[0]}" : "https://${aws_cloudfront_distribution.website.domain_name}"
  }
}
