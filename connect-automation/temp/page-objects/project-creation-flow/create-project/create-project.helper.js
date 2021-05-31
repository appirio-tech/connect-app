"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProjectPageHelper = void 0;
var common_helper_1 = require("../../common-page/common.helper");
var create_project_po_1 = require("./create-project.po");
var CreateProjectPageHelper = /** @class */ (function () {
    function CreateProjectPageHelper() {
    }
    /**
     * Initialize Create Project page object
     */
    CreateProjectPageHelper.initialize = function () {
        this.createProjectPageObject = new create_project_po_1.CreateProjectPageObject();
    };
    /**
     * Open Home page
     */
    CreateProjectPageHelper.open = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, create_project_po_1.CreateProjectPageObject.open()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, common_helper_1.CommonHelper.waitForPageDisplayed()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Verifies user can create design, development & deployment project
     * @param projectData Project Creation Form Data
     */
    CreateProjectPageHelper.verifyProjectCreation = function (projectData) {
        return __awaiter(this, void 0, void 0, function () {
            var appNameWithDate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        appNameWithDate = common_helper_1.CommonHelper.appendDate(projectData.appName);
                        return [4 /*yield*/, this.clickNewProjectButton()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.navigateToViewSolutions()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.clickOnDesignDevelopmentDeploymentButton()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.fillBeforeWeStartForm(projectData.answers)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.fillBasicDetailsForm(appNameWithDate, projectData.appDescription)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.fillAppDefinitionForm(projectData)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.saveProject()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, this.goToYourProject(appNameWithDate)];
                    case 8:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Verify page is displayed correctly.
     * @param expectedTitle page's expected title
     */
    CreateProjectPageHelper.verifyFormDisplayed = function (expectedTitle) {
        return __awaiter(this, void 0, void 0, function () {
            var pageTitle;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createProjectPageObject.formPageTitle.getText()];
                    case 1:
                        pageTitle = _a.sent();
                        expect(pageTitle).toBe(expectedTitle);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Verify page header summary
     * @param expectedTitle page's expected title
     */
    CreateProjectPageHelper.verifyHeaderSummary = function (expectedTitle) {
        return __awaiter(this, void 0, void 0, function () {
            var pageTitle;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createProjectPageObject.headerSummary.getText()];
                    case 1:
                        pageTitle = _a.sent();
                        expect(pageTitle).toBe(expectedTitle);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * If there is draft project exist, click on create new project button
     */
    CreateProjectPageHelper.checkDraftProject = function () {
        return __awaiter(this, void 0, void 0, function () {
            var isDraftProject;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createProjectPageObject.draftProject.isPresent()];
                    case 1:
                        isDraftProject = _a.sent();
                        if (!isDraftProject) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.createProjectPageObject.createNewProject.click()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Verify new project page is displayed with two options /Talent as Service, Solutions/
     */
    CreateProjectPageHelper.clickNewProjectButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            var titles, _a, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.createProjectPageObject.newProjectButton.click()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, common_helper_1.CommonHelper.waitUntilVisibilityOf(function () { return _this.createProjectPageObject.viewSolutions; }, 'Wait for New Project Form', true)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, this.checkDraftProject()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, this.createProjectPageObject.newProjectPageTitles];
                    case 4:
                        titles = _c.sent();
                        expect(titles.length).toBe(2);
                        _a = expect;
                        return [4 /*yield*/, titles[0].getText()];
                    case 5:
                        _a.apply(void 0, [_c.sent()]).toBe('SOLUTIONS');
                        _b = expect;
                        return [4 /*yield*/, titles[1].getText()];
                    case 6:
                        _b.apply(void 0, [_c.sent()]).toBe('TALENT AS A SERVICE');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Click on "View Solutions" under "SOLUTIONS" section
     */
    CreateProjectPageHelper.navigateToViewSolutions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var title;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createProjectPageObject.viewSolutions.click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.createProjectPageObject.solutionCatalogTitle.getText()];
                    case 2:
                        title = _a.sent();
                        expect(title).toBe('TOPCODER SOLUTIONS');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Click on "Select" button under Design, Development and Deployment.
     */
    CreateProjectPageHelper.clickOnDesignDevelopmentDeploymentButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            var selectButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createProjectPageObject.selectButton()];
                    case 1:
                        selectButton = _a.sent();
                        return [4 /*yield*/, selectButton.click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.verifyFormDisplayed('Before we start')];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Fill Before We Start form
     * @param answers answers object defined by test data
     */
    CreateProjectPageHelper.fillBeforeWeStartForm = function (answers) {
        return __awaiter(this, void 0, void 0, function () {
            var beforeWeStart;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        beforeWeStart = answers.beforeWeStart;
                        return [4 /*yield*/, common_helper_1.CommonHelper.selectInputByContainingText(beforeWeStart)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.createProjectPageObject.nextButton.click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.verifyFormDisplayed('Basic Details')];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Fill Basic Details Form, then click next
     * @param appName application name
     * @param appDescription app description
     */
    CreateProjectPageHelper.fillBasicDetailsForm = function (appName, appDescription) {
        return __awaiter(this, void 0, void 0, function () {
            var name, description;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        name = this.createProjectPageObject.appNameInput;
                        return [4 /*yield*/, common_helper_1.CommonHelper.fillInputField(name, appName)];
                    case 1:
                        _a.sent();
                        description = this.createProjectPageObject.appDescriptionInput;
                        return [4 /*yield*/, common_helper_1.CommonHelper.fillInputField(description, appDescription)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.createProjectPageObject.nextButton.click()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.verifyFormDisplayed('App Definition')];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Fill App Definition Form, then click next
     * @param projectData project data from test data
     */
    CreateProjectPageHelper.fillAppDefinitionForm = function (projectData) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, whatDoYouNeed, howManyScreens, willYourAppNeedMoreScreen, whereShouldAppWork, howShouldAppWorks, notesInput;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = projectData.answers, whatDoYouNeed = _a.whatDoYouNeed, howManyScreens = _a.howManyScreens, willYourAppNeedMoreScreen = _a.willYourAppNeedMoreScreen, whereShouldAppWork = _a.whereShouldAppWork, howShouldAppWorks = _a.howShouldAppWorks;
                        return [4 /*yield*/, common_helper_1.CommonHelper.selectInputByContainingText(whatDoYouNeed)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, common_helper_1.CommonHelper.selectInputByContainingText(willYourAppNeedMoreScreen)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, common_helper_1.CommonHelper.selectInputByContainingText(howManyScreens)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, this.createProjectPageObject.nextButton.click()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, this.verifyFormDisplayed('App Definition')];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, common_helper_1.CommonHelper.selectInputByContainingText(whereShouldAppWork)];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, common_helper_1.CommonHelper.selectInputByContainingText(howShouldAppWorks)];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, this.createProjectPageObject.nextButton.click()];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, this.verifyFormDisplayed('App Definition')];
                    case 9:
                        _b.sent();
                        return [4 /*yield*/, this.createProjectPageObject.nextButton.click()];
                    case 10:
                        _b.sent();
                        return [4 /*yield*/, this.verifyFormDisplayed('App Definition')];
                    case 11:
                        _b.sent();
                        notesInput = this.createProjectPageObject.notesInput;
                        return [4 /*yield*/, common_helper_1.CommonHelper.fillInputField(notesInput, projectData.notes)];
                    case 12:
                        _b.sent();
                        return [4 /*yield*/, this.createProjectPageObject.nextButton.click()];
                    case 13:
                        _b.sent();
                        return [4 /*yield*/, this.createProjectPageObject.nextButton.click()];
                    case 14:
                        _b.sent();
                        return [4 /*yield*/, this.verifyHeaderSummary('Your Project Estimate')];
                    case 15:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Save project and verify success message
     */
    CreateProjectPageHelper.saveProject = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createProjectPageObject.saveMyProject.click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.createProjectPageObject.waitForSubTitle()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Navigate to Your Project page and verify recently created project
     * @param appName app name
     */
    CreateProjectPageHelper.goToYourProject = function (appName) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.createProjectPageObject.yourProjectButton.click()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, common_helper_1.CommonHelper.waitForProjectTitle()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, common_helper_1.CommonHelper.projectTitle().getText()];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toBe(appName);
                        return [2 /*return*/];
                }
            });
        });
    };
    return CreateProjectPageHelper;
}());
exports.CreateProjectPageHelper = CreateProjectPageHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLXByb2plY3QuaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcGFnZS1vYmplY3RzL3Byb2plY3QtY3JlYXRpb24tZmxvdy9jcmVhdGUtcHJvamVjdC9jcmVhdGUtcHJvamVjdC5oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsaUVBQStEO0FBRS9ELHlEQUE4RDtBQUU5RDtJQUFBO0lBNExBLENBQUM7SUEzTEM7O09BRUc7SUFDVyxrQ0FBVSxHQUF4QjtRQUNFLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLDJDQUF1QixFQUFFLENBQUM7SUFDL0QsQ0FBQztJQUVEOztPQUVHO0lBQ2lCLDRCQUFJLEdBQXhCOzs7OzRCQUNFLHFCQUFNLDJDQUF1QixDQUFDLElBQUksRUFBRSxFQUFBOzt3QkFBcEMsU0FBb0MsQ0FBQzt3QkFDckMscUJBQU0sNEJBQVksQ0FBQyxvQkFBb0IsRUFBRSxFQUFBOzt3QkFBekMsU0FBeUMsQ0FBQzs7Ozs7S0FFM0M7SUFFRDs7O09BR0c7SUFDaUIsNkNBQXFCLEdBQXpDLFVBQTBDLFdBQXlCOzs7Ozs7d0JBQzNELGVBQWUsR0FBRyw0QkFBWSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7d0JBRXJFLHFCQUFNLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxFQUFBOzt3QkFBbEMsU0FBa0MsQ0FBQzt3QkFDbkMscUJBQU0sSUFBSSxDQUFDLHVCQUF1QixFQUFFLEVBQUE7O3dCQUFwQyxTQUFvQyxDQUFDO3dCQUNyQyxxQkFBTSxJQUFJLENBQUMsd0NBQXdDLEVBQUUsRUFBQTs7d0JBQXJELFNBQXFELENBQUM7d0JBQ3RELHFCQUFNLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUE7O3dCQUFyRCxTQUFxRCxDQUFDO3dCQUN0RCxxQkFB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