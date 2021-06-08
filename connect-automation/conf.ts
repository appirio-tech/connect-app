import reporters = require('jasmine-reporters');
import HtmlReporter = require('protractor-beautiful-reporter');
import { BrowserHelper } from 'topcoder-testing-lib';

declare global {
  namespace NodeJS {
    interface IGlobal {
      document: Document;
      window: Window;
      navigator: Navigator;
      forgotPasswordMailListener: any;
      registrationMailListener: any;
    }
  }
}

exports.config = {
  directConnect: true,

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: [
        '--headless',
        '--disable-gpu',
        '--no-sandbox',
        '--window-size=1325x744',
      ],
    },
  },

  // Framework to use. Jasmine is recommended.
  framework: 'jasmine2',

  specs: [
    '../temp/test-suites/profile-update/my-profile.spec.js',
    // '../temp/test-suites/profile-update/left-menu.spec.js',
    // '../temp/test-suites/profile-update/user-profile-menu.spec.js',
    // '../temp/test-suites/profile-update/footer-menu.spec.js',
    // '../temp/test-suites/project-creation-flow/create-project.spec.js',
    // '../temp/test-suites/project-creation-flow/invite-copilot.spec.js',
    // '../temp/test-suites/project-creation-flow/projects.spec.js',
    //'../temp/test-suites/phase-creation-flow/create-new-phase.spec.js'
  ],

  // Options to be passed to Jasmine.
  jasmineNodeOpts: {
    defaultTimeoutInterval: 1200000, // 20 minutes
    isVerbose: true,
    showColors: true,
  },

  onPrepare: () => {
    BrowserHelper.maximize();
    BrowserHelper.implicitlyWait(5000);
    const junitReporter = new reporters.JUnitXmlReporter({
      consolidateAll: false,
      savePath: 'test-results',
    });
    jasmine.getEnv().addReporter(junitReporter);
    jasmine.getEnv().addReporter(
      new HtmlReporter({
        baseDirectory: 'test-results',
        docName: 'TestResult.html', // Change html report file name
        docTitle: 'Test Automation Execution Report', // Add title for the html report
        gatherBrowserLogs: true, // Store Browser logs
        jsonsSubfolder: 'jsons', // JSONs Subfolder
        preserveDirectory: false, // Preserve base directory
        screenshotsSubfolder: 'screenshots',
        takeScreenShotsForSkippedSpecs: true, // Screenshots for skipped test cases
        takeScreenShotsOnlyForFailedSpecs: true, // Screenshots only for failed test cases
      }).getJasmine2Reporter()
    );
  },
};
