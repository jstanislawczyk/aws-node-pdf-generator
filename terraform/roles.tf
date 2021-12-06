resource "aws_iam_role" "lambda_new_order_processor_role" {
  name = "jstanislawczyk-lambda-new-order-processor-role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role" "lambda_pdf_generator_role" {
  name = "jstanislawczyk-lambda-pdf-generator-role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda_new_order_processor_policy_attachment" {
  role       = aws_iam_role.lambda_new_order_processor_role.name
  policy_arn = aws_iam_policy.lambda_new_order_processor_policy.arn
}

resource "aws_iam_role_policy_attachment" "lambda_generator_policy_attachment" {
  role       = aws_iam_role.lambda_pdf_generator_role.name
  policy_arn = aws_iam_policy.lambda_pdf_generator_policy.arn
}
