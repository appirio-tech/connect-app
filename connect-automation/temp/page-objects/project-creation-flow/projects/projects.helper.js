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
exports.ProjectsHelper = void 0;
var topcoder_testing_lib_1 = require("topcoder-testing-lib");
var common_helper_1 = require("../../common-page/common.helper");
var projects_po_1 = require("./projects.po");
var ProjectsHelper = /** @class */ (function () {
    function ProjectsHelper() {
    }
    /**
     * Initialize Projects page object
     */
    ProjectsHelper.initialize = function () {
        this.projectsPageObject = new projects_po_1.ProjectsPageObject();
    };
    /**
     * Opens the Create Project page
     */
    ProjectsHelper.open = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, projects_po_1.ProjectsPageObject.open()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, common_helper_1.CommonHelper.waitForPageDisplayed()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.sleep(4000)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Verify whether the Copilot can Join the project
     */
    ProjectsHelper.verifyCopilotProjectJoin = function () {
        return __awaiter(this, void 0, void 0, function () {
            var alertElement, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: 
                    // Go to Recently created project
                    return [4 /*yield*/, common_helper_1.CommonHelper.goToRecentlyCreatedProject()];
                    case 1:
                        // Go to Recently created project
                        _b.sent();
                        return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.sleep(4000)];
                    case 2:
                        _b.sent();
                        // Click on Join Project button
                        return [4 /*yield*/, this.projectsPageObject.joinProjectButton.click()];
                    case 3:
                        // Click on Join Project button
                        _b.sent();
                        alertElement = common_helper_1.CommonHelper.alertBox();
                        return [4 /*yield*/, common_helper_1.CommonHelper.waitForSuccessAlert(alertElement)];
                    case 4:
                        _b.sent();
                        // Verify Success Alert
                        _a = expect;
                        return [4 /*yield*/, common_helper_1.CommonHelper.successAlert().getText()];
                    case 5:
                        // Verify Success Alert
                        _a.apply(void 0, [_b.sent()]).toBe("YOU'VE SUCCESSFULLY JOINED THE PROJECT.");
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Verify user can search for projects using project name, user handle, ref code
     * @param searchProject object for search
     */
    ProjectsHelper.verifyProjectSearch = function (searchProject) {
        return __awaiter(this, void 0, void 0, function () {
            var allProjectsBeforeSearch, beforeSearchLength, firstProjectBeforeSearch, allProjectsAfterSearch, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.sleep(3000)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, this.projectsPageObject.projectTitles()];
                    case 2:
                        allProjectsBeforeSearch = _c.sent();
                        beforeSearchLength = allProjectsBeforeSearch.length;
                        return [4 /*yield*/, allProjectsBeforeSearch[0].getText()];
                    case 3:
                        firstProjectBeforeSearch = _c.sent();
                        // Search by project name
                        return [4 /*yield*/, this.projectsPageObject.fillSearchBar(searchProject.searchByName)];
                    case 4:
                        // Search by project name
                        _c.sent();
                        return [4 /*yield*/, this.verifyAllProjects(searchProject.searchByName)];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, this.clickCancelButton()];
                    case 6:
                        _c.sent();
                        // Search by Ref
                        return [4 /*yield*/, this.projectsPageObject.fillSearchBar(searchProject.searchByRef)];
                    case 7:
                        // Search by Ref
                        _c.sent();
                        return [4 /*yield*/, this.verifyProjectWithRef(searchProject.searchByRef)];
                    case 8:
                        _c.sent();
                        // Click on Clear button
                        return [4 /*yield*/, this.clickCancelButton()];
                    case 9:
                        // Click on Clear button
                        _c.sent();
                        // Search by Handle
                        return [4 /*yield*/, this.projectsPageObject.fillSearchBar(searchProject.searchByHandle)];
                    case 10:
                        // Search by Handle
                        _c.sent();
                        return [4 /*yield*/, this.verifyProjectSearchByHandle(searchProject.searchByHandle)];
                    case 11:
                        _c.sent();
                        return [4 /*yield*/, this.clickCancelButton()];
                    case 12:
                        _c.sent();
                        return [4 /*yield*/, this.projectsPageObject.projectTitles()];
                    case 13:
                        allProjectsAfterSearch = _c.sent();
                        expect(beforeSearchLength).toEqual(allProjectsAfterSearch.length);
                        _b = (_a = expect(firstProjectBeforeSearch)).toEqual;
                        return [4 /*yield*/, allProjectsAfterSearch[0].getText()];
                    case 14:
                        _b.apply(_a, [_c.sent()]);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * verify user can switch between the Project tabs
     */
    ProjectsHelper.verifySwitchTabs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tabNames, expectedLinkStatuses;
            var _this = this;
            return __generator(this, function (_a) {
                tabNames = [
                    'Active',
                    'In review',
                    'Reviewed',
                    'Completed',
                    'Cancelled',
                    'Paused',
                    'All Projects',
                ];
                expectedLinkStatuses = [
                    'active',
                    'in_review',
                    'reviewed',
                    'completed',
                    'cancelled',
                    'paused',
                    '',
                ];
                tabNames.map(function (currentTab, index) { return __awaiter(_this, void 0, void 0, function () {
                    var activeTab, currentUrl;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.sleep(1000)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, this.projectsPageObject.tabElement(currentTab)];
                            case 2:
                                activeTab = _a.sent();
                                return [4 /*yield*/, activeTab.click()];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.getCurrentUrl()];
                            case 4:
                                currentUrl = _a.sent();
                                expect(currentUrl).toContain(expectedLinkStatuses[index]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    /**
     * Verify all projects
     * @param searchTerm search term
     */
    ProjectsHelper.verifyAllProjects = function (searchTerm) {
        return __awaiter(this, void 0, void 0, function () {
            var searchResultElements;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.projectsPageObject.projectTitles()];
                    case 1:
                        searchResultElements = _a.sent();
                        searchResultElements.map(function (project) { return __awaiter(_this, void 0, void 0, function () {
                            var projectName;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, project.getText()];
                                    case 1:
                                        projectName = _a.sent();
                                        expect(projectName.toLowerCase()).toContain(searchTerm);
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.sleep(1000)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Verify projects with ref
     * @param searchTerm search term
     */
    ProjectsHelper.verifyProjectWithRef = function (searchTerm) {
        return __awaiter(this, void 0, void 0, function () {
            var ref;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.projectsPageObject.refText.getText()];
                    case 1:
                        ref = _a.sent();
                        expect(ref).toBe(searchTerm);
                        return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.sleep(1000)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Click on clear button
     */
    ProjectsHelper.clickCancelButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.projectsPageObject.clearButton.click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.sleep(1000)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Verify project search results by handle
     * @param memberHandle member handle from test data
     */
    ProjectsHelper.verifyProjectSearchByHandle = function (memberHandle) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, common_helper_1.CommonHelper.goToRecentlyCreatedProject()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.waitUntilVisibilityOf(this.projectsPageObject.firstMember)];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, this.projectsPageObject.firstMember.getText()];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toBe(memberHandle);
                        return [4 /*yield*/, this.projectsPageObject.backButton.click()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.sleep(5000)];
                    case 5:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return ProjectsHelper;
}());
exports.ProjectsHelper = ProjectsHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdHMuaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcGFnZS1vYmplY3RzL3Byb2plY3QtY3JlYXRpb24tZmxvdy9wcm9qZWN0cy9wcm9qZWN0cy5oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsNkRBQXFEO0FBQ3JELGlFQUErRDtBQUUvRCw2Q0FBbUQ7QUFFbkQ7SUFBQTtJQXdKQSxDQUFDO0lBdkpDOztPQUVHO0lBQ1cseUJBQVUsR0FBeEI7UUFDRSxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxnQ0FBa0IsRUFBRSxDQUFDO0lBQ3JELENBQUM7SUFFRDs7T0FFRztJQUNpQixtQkFBSSxHQUF4Qjs7Ozs0QkFDRSxxQkFBTSxnQ0FBa0IsQ0FBQyxJQUFJLEVBQUUsRUFBQTs7d0JBQS9CLFNBQStCLENBQUM7d0JBQ2hDLHFCQUFNLDRCQUFZLENBQUMsb0JBQW9CLEVBQUUsRUFBQTs7d0JBQXpDLFNBQXlDLENBQUM7d0JBQzFDLHFCQUFNLG9DQUFhLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFBOzt3QkFBL0IsU0FBK0IsQ0FBQzs7Ozs7S0FDakM7SUFFRDs7T0FFRztJQUNpQix1Q0FBd0IsR0FBNUM7Ozs7OztvQkFDRSxpQ0FBaUM7b0JBQ2pDLHFCQUFNLDRCQUFZLENBQUMsMEJBQTBCLEVBQUUsRUFBQTs7d0JBRC9DLGlDQUFpQzt3QkFDakMsU0FBK0MsQ0FBQzt3QkFDaEQscUJBQU0sb0NBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUE7O3dCQUEvQixTQUErQixDQUFDO3dCQUVoQywrQkFBK0I7d0JBQy9CLHFCQUFNLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsRUFBQTs7d0JBRHZELCtCQUErQjt3QkFDL0IsU0FBdUQsQ0FBQzt3QkFDbEQsWUFBWSxHQUFH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