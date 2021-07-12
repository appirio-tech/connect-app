# Topcoder Connect App - E2E Tests

#### Software Required

Nodejs v8.11.4+
Chrome Browser

#### Installation:

- Installs
  `npm install`

- To run tests
  `cd connect-automation`
  `npm run test`

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

#### Test Datas:

- Test datas are located in /test-data/test-data.json file

#### Configuration details:

- config.json holds the data level configuration, like user credentials etc
- conf.ts holds the application configuration, like jasmine reporters to be configured, specs to be run etc.
