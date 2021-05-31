"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reporters = require("jasmine-reporters");
var HtmlReporter = require("protractor-beautiful-reporter");
var topcoder_testing_lib_1 = require("topcoder-testing-lib");
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
        '../temp/test-suites/profile-update/left-menu.spec.js',
        '../temp/test-suites/profile-update/user-profile-menu.spec.js',
        '../temp/test-suites/profile-update/footer-menu.spec.js',
        '../temp/test-suites/project-creation-flow/create-project.spec.js',
        '../temp/test-suites/project-creation-flow/invite-copilot.spec.js',
        '../temp/test-suites/project-creation-flow/projects.spec.js',
        '../temp/test-suites/phase-creation-flow/create-new-phase.spec.js'
    ],
    // Options to be passed to Jasmine.
    jasmineNodeOpts: {
        defaultTimeoutInterval: 1200000,
        isVerbose: true,
        showColors: true,
    },
    onPrepare: function () {
        topcoder_testing_lib_1.BrowserHelper.maximize();
        topcoder_testing_lib_1.BrowserHelper.implicitlyWait(5000);
        var junitReporter = new reporters.JUnitXmlReporter({
            consolidateAll: false,
            savePath: 'test-results',
        });
        jasmine.getEnv().addReporter(junitReporter);
        jasmine.getEnv().addReporter(new HtmlReporter({
            baseDirectory: 'test-results',
            docName: 'TestResult.html',
            docTitle: 'Test Automation Execution Report',
            gatherBrowserLogs: true,
            jsonsSubfolder: 'jsons',
            preserveDirectory: false,
            screenshotsSubfolder: 'screenshots',
            takeScreenShotsForSkippedSpecs: true,
            takeScreenShotsOnlyForFailedSpecs: true,
        }).getJasmine2Reporter());
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2NvbmYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBZ0Q7QUFDaEQsNERBQStEO0FBQy9ELDZEQUFxRDtBQWNyRCxPQUFPLENBQUMsTUFBTSxHQUFHO0lBQ2YsYUFBYSxFQUFFLElBQUk7SUFFbkIsdURBQXVEO0lBQ3ZELFlBQVksRUFBRTtRQUNaLFdBQVcsRUFBRSxRQUFRO1FBQ3JCLGFBQWEsRUFBRTtZQUNiLElBQUksRUFBRTtnQkFDSixZQUFZO2dCQUNaLGVBQWU7Z0JBQ2YsY0FBYztnQkFDZCx3QkFBd0I7YUFDekI7U0FDRjtLQUNGO0lBRUQsNENBQTRDO0lBQzVDLFNBQVMsRUFBRSxVQUFVO0lBRXJCLEtBQUssRUFBRTtRQUNMLHVEQUF1RDtRQUN2RCxzREFBc0Q7UUFDdEQsOERBQThEO1FBQzlELHdEQUF3RDtRQUN4RCxrRUFBa0U7UUFDbEUsa0VBQWtFO1FBQ2xFLDREQUE0RDtRQUM1RCxrRUFBa0U7S0FDbkU7SUFFRCxtQ0FBbUM7SUFDbkMsZUFBZSxFQUFFO1FBQ2Ysc0JBQXNCLEVBQUUsT0FBTztRQUMvQixTQUFTLEVBQUUsSUFBSTtRQUNmLFVBQVUsRUFBRSxJQUFJO0tBQ2pCO0lBRUQsU0FBUyxFQUFFO1FBQ1Qsb0NBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN6QixvQ0FBYSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuQyxJQUFNLGFBQWEsR0FBRyxJQUFJLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQztZQUNuRCxjQUFjLEVBQUUsS0FBSztZQUNyQixRQUFRLEVBQUUsY0FBYztTQUN6QixDQUFDLENBQUM7UUFDSCxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzVDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxXQUFXLENBQzFCLElBQUksWUFBWSxDQUFDO1lBQ2YsYUFBYSxFQUFFLGNBQWM7WUFDN0IsT0FBTyxFQUFFLGlCQUFpQjtZQUMxQixRQUFRLEVBQUUsa0NBQWtDO1lBQzVDLGlCQUFpQixFQUFFLElBQUk7WUFDdkIsY0FBYyxFQUFFLE9BQU87WUFDdkIsaUJBQWlCLEVBQUUsS0FBSztZQUN4QixvQkFBb0IsRUFBRSxhQUFhO1lBQ25DLDhCQUE4QixFQUFFLElBQUk7WUFDcEMsaUNBQWlDLEVBQUUsSUFBSTtTQUN4QyxDQUFDLENBQUMsbUJBQW1CLEVBQUUsQ0FDekIsQ0FBQztJQUNKLENBQUM7Q0FDRixDQUFDIn0=