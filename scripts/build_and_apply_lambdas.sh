echo "Building and applying lambdas"

ROOTDIR=`pwd`

INFRA_DIR=$ROOTDIR/infrastructure/stats-loader

ETL_LAMBDA=stats_etl
SCHEDULER_LAMBDA=scheduler

ETL_LAMBDA_DIR=$ROOTDIR/application/stats-loader/etl
SCHEDULER_LAMBDA_DIR=$ROOTDIR/application/stats-loader/scheduler

bash $ROOTDIR/scripts/zip_lambda.sh $ETL_LAMBDA $ETL_LAMBDA_DIR $INFRA_DIR
bash $ROOTDIR/scripts/zip_lambda.sh $SCHEDULER_LAMBDA $SCHEDULER_LAMBDA_DIR $INFRA_DIR

cd $INFRA_DIR
echo "working-directory: $(pwd)"

echo "Running terraform init"
terraform init
if [[ $? != 0 ]]; then
  echo "Failed to initialize terraform"
  exit 1
fi

echo "Running terraform plan"
terraform plan
if [[ $? != 0 ]]; then
  echo "Failed to plan terraform"
  exit 1
fi

echo "Running terraform apply"
terraform apply -auto-approve
if [[ $? != 0 ]]; then
  echo "Failed to apply terraform"
  exit 1
fi
