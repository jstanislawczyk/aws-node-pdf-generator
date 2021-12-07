resource "aws_api_gateway_rest_api" "order_api" {
  name = "${local.environment}-order-api"
}

resource "aws_api_gateway_resource" "order_api_root" {
  rest_api_id = aws_api_gateway_rest_api.order_api.id
  parent_id   = aws_api_gateway_rest_api.order_api.root_resource_id
  path_part   = "api"
}

resource "aws_api_gateway_resource" "order_api_orders" {
  rest_api_id = aws_api_gateway_rest_api.order_api.id
  parent_id   = aws_api_gateway_resource.order_api_root.id
  path_part   = "order"
}

resource "aws_api_gateway_method" "order_post" {
  rest_api_id   = aws_api_gateway_rest_api.order_api.id
  resource_id   = aws_api_gateway_resource.order_api_orders.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "save_order_integration" {
  rest_api_id             = aws_api_gateway_rest_api.order_api.id
  resource_id             = aws_api_gateway_resource.order_api_orders.id
  http_method             = aws_api_gateway_method.order_post.http_method
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.new_order_processor.invoke_arn
  integration_http_method = "POST"
}

resource "aws_api_gateway_deployment" "order_api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.order_api.id
  stage_name = local.environment

  depends_on = [
    aws_api_gateway_integration.save_order_integration
  ]

  # Force stage deployment on every apply
  variables = {
    deployed_at = timestamp()
  }

  lifecycle {
    create_before_destroy = true
  }
}
