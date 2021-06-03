#!/bin/bash
./node_modules/.bin/webdriver-manager start --detach
npm run test

if [ $? -eq 0 ]; then
  echo "Test case successfully completed"
else
  echo "Test case Failed"
fi
