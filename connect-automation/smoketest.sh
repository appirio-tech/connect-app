#!/bin/bash

cd connect-automation

docker build -t conn-smoke:latest .
docker run --name conn-smoke --shm-size=2g conn-smoke:latest ./testrun.sh -d -p 4444:4444
docker cp conn-smoke:./connect-automation/test-results .