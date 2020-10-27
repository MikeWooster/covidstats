echo "Creating lambda packages"

ROOTDIR=`pwd`

INFRA_DIR=$ROOTDIR/infrastructure/stats-loader

ETL_LAMBDA=stats_etl
SCHEDULER_LAMBDA=scheduler

ETL_LAMBDA_DIR=$ROOTDIR/application/stats-loader/etl
SCHEDULER_LAMBDA_DIR=$ROOTDIR/application/stats-loader/scheduler

bash $ROOTDIR/scripts/zip_individual_lambda.sh $ETL_LAMBDA $ETL_LAMBDA_DIR $INFRA_DIR
bash $ROOTDIR/scripts/zip_individual_lambda.sh $SCHEDULER_LAMBDA $SCHEDULER_LAMBDA_DIR $INFRA_DIR
