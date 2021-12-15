import reporters = require('jasmine-reporters');
import HtmlReporter = require('protractor-beautiful-reporter');
import { BrowserHelper } from 'topcoder-testing-lib';
import { ConfigHelper } from './utils/config-helper';

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

let allTestsUrls = [
  '../temp/test-suites/profile-update/my-profile.spec.js',
  '../temp/test-suites/profile-update/left-menu.spec.js',
  '../temp/test-suites/profile-update/user-profile-menu.spec.js',
  '../temp/test-suites/profile-update/footer-menu.spec.js',
  '../temp/test-suites/project-creation-flow/create-project.spec.js',
  '../temp/test-suites/project-creation-flow/invite-copilot.spec.js',
  '../temp/test-suites/project-creation-flow/projects.spec.js',
  '../temp/test-suites/project-settings-flow/project-settings.spec.js',
  '../temp/test-suites/milestone-flow/create-new-milestone.spec.js',
  '../temp/test-suites/milestone-flow/verify-customer-role.spec.js',
  '../temp/test-suites/milestone-flow/verify-customer-approveMilestone.spec.js'
];

if (ConfigHelper.getEnvironment() === 'prod') {
  // Skip tests involving Copilot Manager role in PROD Environment.
  allTestsUrls = allTestsUrls.filter(item => !item.includes('invite-copilot.spec.js'));
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
        'disable-infobars'
      ],
      'excludeSwitches': ['enable-automation'],
      prefs: {
        'credentials_enable_service': false,
        'profile': {
          'password_manager_enabled': false
        }
      }
    },
  },

  // Framework to use. Jasmine is recommended.
  framework: 'jasmine2',

  specs: allTestsUrls,

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
