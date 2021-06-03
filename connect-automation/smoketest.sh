#!/bin/bash

cd connect-automation

docker build -t conn-smoke:latest .
docker run --shm-size=2g conn-smoke:latest ./testrun.sh -d -p 4444:4444
track_error $? "Test case Failed"
