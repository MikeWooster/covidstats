LAMBDA=$1
LAMBDA_DIR=$2
INFRA_DIR=$3

if [[ $LAMBDA == "" ]]; then
  echo "Please specify the lambda"
  exit 1
fi

if [[ $LAMBDA_DIR == "" ]]; then
  echo "Please specify the dir to the lambda"
  exit 1
fi

if [[ $INFRA_DIR == "" ]]; then
  echo "Please specify a the dir to the infra dir"
  exit 1
fi

# Build some constants for this script
ROOTDIR=`pwd`
ZIPFILE="${LAMBDA}_lambda.zip"

if [[ ! -d $LAMBDA_DIR ]]; then
  echo "${LAMBDA_DIR} does not exist"
  exit 1
fi

if [[ ! -d $INFRA_DIR ]]; then
  echo  "${INFRA_DIR} does not exist"
  exit 1
fi

# Perform all operations here (mainly for building go binary)
cd $LAMBDA_DIR

# Build the go binary
# Force usage of linux as aws lambdas use this environment
echo "Creating go binary for ${LAMBDA} with amd64/linux"
GOARCH=amd64 GOOS=linux go build

if [[ -e $ZIPFILE ]]; then
  rm $ZIPFILE
fi

echo "Zipping go binary into ${ZIPFILE}"
zip $ZIPFILE $LAMBDA
rm $LAMBDA

echo "Moving zipfile to infra location ${INFRA_DIR}/${ZIPFILE}"
mv $ZIPFILE $INFRA_DIR/$ZIPFILE
