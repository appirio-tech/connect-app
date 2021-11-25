#!/bin/bash

log()
{
   echo "`date +'%D %T'` : $1"
}
track_error()
{
   if [ $1 != "0" ]; then
        log "$2 exited with error code $1"
        log "completed execution IN ERROR at `date`"
        exit $1
   fi

}

APPCONFIGFILENAME=$1
LOGICAL_PATH=$2

cd connect-automation
# file from AWS would override the file from the repo
aws s3 cp s3://tc-platform-${LOGICAL_PATH}/securitymanager/${APPCONFIGFILENAME} ./config/
cp config/${APPCONFIGFILENAME} config/config.json
track_error $? "Environment setting"

docker build -t comm-smoke:latest .
docker run --name comm-smoke --shm-size=2g comm-smoke:latest ./testrun.sh -d -p 4444:4444
docker cp comm-smoke:./connect-automation/test-results .
track_error $? "Test case Failed"