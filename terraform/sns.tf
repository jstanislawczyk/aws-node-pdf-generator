resource "aws_sns_topic" "new_order_topic" {
  name = "${local.environment}-new-order-topic"
}
