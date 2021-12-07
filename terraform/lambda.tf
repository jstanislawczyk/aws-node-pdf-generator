resource "aws_lambda_function" "new_order_processor" {
  filename      = "new-order-processor.zip"
  function_name = "${local.environment}-new-order-processor"
  role          = aws_iam_role.lambda_new_order_processor_role.arn
  handler       = "src/index.handler"
  runtime       = "nodejs14.x"
  timeout       = 20

  source_code_hash = filebase64sha256("new-order-processor.zip")

  environment {
    variables = {
      SNS_TOPIC           = aws_sns_topic.new_order_topic.arn
      DYNAMODB_TABLE_NAME = aws_dynamodb_table.order_table.name
    }
  }
}

resource "aws_lambda_function" "pdf_generator" {
  filename      = "pdf-generator.zip"
  function_name = "${local.environment}-pdf-generator"
  role          = aws_iam_role.lambda_pdf_generator_role.arn
  handler       = "src/index.handler"
  runtime       = "nodejs14.x"
  timeout       = 20

  source_code_hash = filebase64sha256("pdf-generator.zip")

  environment {
    variables = {
      BUCKET_NAME = aws_s3_bucket.order_pdf_lake.id
      IS_LAMBDA   = true
    }
  }
}

resource "aws_lambda_event_source_mapping" "pdf_generator_sqs_mapping" {
  event_source_arn = aws_sqs_queue.new_order_queue.arn
  function_name    = aws_lambda_function.pdf_generator.arn
  batch_size       = 1
}

resource "aws_lambda_permission" "new_order_api_gateway_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.new_order_processor.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.order_api.execution_arn}/*/*"
}
