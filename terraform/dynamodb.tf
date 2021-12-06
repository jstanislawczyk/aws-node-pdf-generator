resource "aws_dynamodb_table" "order_table" {
  name         = "${local.environment}-order-table"
  hash_key     = "Id"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "Id"
    type = "S"
  }
}
