resource "aws_cloudwatch_event_rule" "schedule_stats_pipeline" {
  name                = "${local.prefix}-schedule-stats-pipeline"
  description         = "Triggers lambda to initiate stats collection"
  schedule_expression = "cron(0 6 * * ? *)"
}

resource "aws_cloudwatch_event_target" "schedule_stats_pipeline" {
  depends_on = [
    aws_cloudwatch_event_rule.schedule_stats_pipeline,
    aws_lambda_function.scheduler_lambda
  ]

  rule      = aws_cloudwatch_event_rule.schedule_stats_pipeline.name
  target_id = "${local.prefix}-schedule-stats-pipeline"
  arn       = aws_lambda_function.scheduler_lambda.arn
}
