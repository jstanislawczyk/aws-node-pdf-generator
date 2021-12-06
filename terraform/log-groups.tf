resource "aws_cloudwatch_log_group" "lambda_pdf_generator_logging" {
  name              = "/aws/lambda/${aws_lambda_function.pdf_generator.function_name}"
  retention_in_days = 3
}

resource "aws_cloudwatch_log_group" "lambda_new_order_processor_logging" {
  name              = "/aws/lambda/${aws_lambda_function.new_order_processor.function_name}"
  retention_in_days = 3
}
