#---------------------------------------------------------------------------
# STATS ETL LAMBDA
#---------------------------------------------------------------------------

resource "aws_iam_role" "stats_etl_lambda" {
  name = "${local.prefix}-etl-lambda"

  assume_role_policy = templatefile(
    "templates/assume_role.tmpl", {
      service = "lambda.amazonaws.com"
  })
}

resource "aws_iam_role_policy_attachment" "stats_etl_lambda_basic_execution_role" {
  role       = aws_iam_role.stats_etl_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

// Attach a basic execution role to allow the lambda to poll SQS for messages.
resource "aws_iam_policy" "stats_etl_lambda" {
  depends_on = [aws_sqs_queue.stat_loading_tasks]

  name        = "${local.prefix}-stats-etl-lambda"
  description = "Allow Stats ETL lambda to write to website bucket"

  policy = templatefile("templates/stats_etl_lambda_policy.tmpl", {
    bucket_arn = data.terraform_remote_state.hosting.outputs.website_bucket_arn,
    sqs_arn    = aws_sqs_queue.stat_loading_tasks.arn
  })
}

resource "aws_iam_role_policy_attachment" "stats_etl_lambda" {
  role       = aws_iam_role.stats_etl_lambda.name
  policy_arn = aws_iam_policy.stats_etl_lambda.arn
}

resource "aws_lambda_function" "stats_etl_lambda" {
  function_name = "${local.prefix}-stats-etl"
  role          = aws_iam_role.stats_etl_lambda.arn
  handler       = "stats_etl"
  runtime       = "go1.x"

  memory_size                    = 128
  timeout                        = 5
  reserved_concurrent_executions = 1

  filename         = "stats_etl_lambda.zip"
  source_code_hash = filebase64sha256("stats_etl_lambda.zip")

  tags = merge(local.common_tags, {
    Name = "${local.prefix}-stats-etl-lambda"
  })
}

resource "aws_lambda_event_source_mapping" "stats_etl_lambda_trigger" {
  depends_on = [aws_sqs_queue.stat_loading_tasks]

  event_source_arn = aws_sqs_queue.stat_loading_tasks.arn
  function_name    = aws_lambda_function.stats_etl_lambda.arn

  batch_size = 1
}

#---------------------------------------------------------------------------
# SCHEDULER LAMBDA
#---------------------------------------------------------------------------

resource "aws_iam_role" "scheduler_lambda" {
  name = "${local.prefix}-scheduler-lambda"

  assume_role_policy = templatefile(
    "templates/assume_role.tmpl", {
      service = "lambda.amazonaws.com"
  })
}

resource "aws_iam_role_policy_attachment" "scheduler_lambda_basic_execution_role" {
  role       = aws_iam_role.scheduler_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

// Attach a basic execution role to allow the lambda to send SQS messages.
resource "aws_iam_policy" "scheduler_lambda" {
  depends_on = [aws_sqs_queue.stat_loading_tasks]

  name        = "${local.prefix}-scheduler-lambda"
  description = "Allow Scheduler lambda to write to SQS Queue"

  policy = templatefile("templates/scheduler_lambda_policy.tmpl", {
    sqs_arn = aws_sqs_queue.stat_loading_tasks.arn
  })
}

resource "aws_iam_role_policy_attachment" "scheduler_lambda" {
  role       = aws_iam_role.scheduler_lambda.name
  policy_arn = aws_iam_policy.scheduler_lambda.arn
}

resource "aws_lambda_function" "scheduler_lambda" {
  function_name = "${local.prefix}-scheduler"
  role          = aws_iam_role.scheduler_lambda.arn
  handler       = "scheduler"
  runtime       = "go1.x"

  memory_size                    = 128
  timeout                        = 10
  reserved_concurrent_executions = 1

  filename         = "scheduler_lambda.zip"
  source_code_hash = filebase64sha256("scheduler_lambda.zip")

  environment {
    variables = {
      QUEUE_URL = aws_sqs_queue.stat_loading_tasks.id
    }
  }

  tags = merge(local.common_tags, {
    Name = "${local.prefix}-scheduler-lambda"
  })
}

resource "aws_lambda_permission" "scheduler_lambda_allow_cloudwatch" {
  depends_on = [
    aws_lambda_function.scheduler_lambda,
    aws_cloudwatch_event_rule.schedule_stats_pipeline
  ]

  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.scheduler_lambda.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.schedule_stats_pipeline.arn
}
