resource "aws_s3_bucket" "order_pdf_lake" {
  bucket        = "${local.environment}-order-pdf-lake"
  force_destroy = true
}
