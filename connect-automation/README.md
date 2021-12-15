# Topcoder Connect App - E2E Tests

#### Software Required

Nodejs v8.11.4+
Chrome Browser

#### Installation:

- `cd connect-automation`

- Installs
  `npm install`

- To run Tests locally
  `npm run test:local`

- To run Tests agains production environment
  `npm run test:prod`

- To run Tests agains dev environment
  `npm run test:dev`


- Test results are generated in test-results/ folder

```
HTML report - TestResult.html
Junit report - junitresults-TopcoderLoginPageTests.xml and junitresults-TopcoderRegistrationPageTests.xml
```

- To view junit reports into html, install xunit-viewer
  `npm i -g xunit-viewer`

- HTML report from Junit reports can be generated using this command
  `xunit-viewer --results=test-results/ --output=/home/Documents/`

As of now, the tests are running in headless mode. To view the actual chrom browser running the tests, you can remove `--headless` option from `chromeOptions.args` in `config.ts`

#### Test Data and Config

- Test data are located in `/test-data/test-data.json` file.
- All the test data which doesn't depend on the environment should be placed in `/test-data/test-data.json` file.
- All the test data which dose depend on the environment should be placed inside a `config/connect-automation-config-{ENV}.json` file:
  - ⚠️ Don't push production config `config/connect-automation-config-prod.json` to the repository for security reasons

##### Test Data and Config for CircleCI

When running test automation using CircleCI it would use config files which should be placed inside Topcoder S3:

- DEV `s3://tc-platform-dev/securitymanager/connect-automation-config-dev.json`
- PROD `s3://tc-platform-prod/securitymanager/connect-automation-config-prod.json`

Production config should be filled with production data like production user login/password, production project id with billing account as so on. For reference you may use file [connect-automation-config-dev.json](config/connect-automation-config-dev.json).

These configs should be updated by someone from Topcoder.

#### Configuration details:

- config.json holds the data level configuration, like user credentials etc
- conf.ts holds the application configuration, like jasmine reporters to be configured, specs to be run etc.
