resource "aws_sqs_queue" "stat_loading_tasks" {
  name = "${local.prefix}-stats-loading-tasks"

  // Setting wait time above 0 enables long polling
  receive_wait_time_seconds = 20

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.stat_loading_tasks_deadletter.arn
    maxReceiveCount     = 3
  })

  tags = merge(local.common_tags, {
    Name = "${local.prefix}-stats-loading-tasks"
  })
}

resource "aws_sqs_queue" "stat_loading_tasks_deadletter" {
  name = "${local.prefix}-stats-loading-tasks-deadletter"

  receive_wait_time_seconds = 20

  tags = merge(local.common_tags, {
    Name = "${local.prefix}-stats-loading-tasks-deadletter"
  })
}
