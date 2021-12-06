resource "aws_sqs_queue" "new_order_queue" {
  name = "${local.environment}-new-order-queue"
}
