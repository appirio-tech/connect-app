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
exports.CommonHelper = void 0;
var moment = require("moment");
var topcoder_testing_lib_1 = require("topcoder-testing-lib");
var appconfig = require("../../config/app-config.json");
var logger_1 = require("../../logger/logger");
var config_helper_1 = require("../../utils/config-helper");
var login_helper_1 = require("../login/login.helper");
/**
 * Wait until condition return true
 * @param func function for checking condition
 * @param extraMessage extra error message when timeout
 * @param isPageLoad wait for loading page
 */
var waitUntil = function (func, extraMessage, isPageLoad) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.waitUntil(func, isPageLoad
                    ? appconfig.Timeout.PageLoad
                    : appconfig.Timeout.ElementVisibility, (isPageLoad
                    ? appconfig.LoggerErrors.PageLoad
                    : appconfig.LoggerErrors.ElementVisibilty) +
                    '.' +
                    extraMessage)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.CommonHelper = {
    /**
     * Log in browser
     * @param username user name
     * @param password password
     */
    login: function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.initialize()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.maximize()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, login_helper_1.LoginPageHelper.open()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, login_helper_1.LoginPageHelper.login(username, password)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Log out browser
     */
    logout: function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 4]);
                        return [4 /*yield*/, login_helper_1.LoginPageHelper.logout()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        e_1 = _a.sent();
                        return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.restart()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Wait until the element becomes visible
     * @param {TcElementImpl} tcElement element
     * @param {TcElementImpl} extraMessage extra message
     * @param {Boolean} isPageLoad is loading page
     */
    waitUntilVisibilityOf: function (func, extraMessage, isPageLoad) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, waitUntil(function () { return function () { return __awaiter(_this, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _b.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, func().isDisplayed()];
                                    case 1: return [2 /*return*/, _b.sent()];
                                    case 2:
                                        _a = _b.sent();
                                        // element is not attached to the DOM of a page.
                                        return [2 /*return*/, false];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); }; }, extraMessage, isPageLoad)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Wait until the element is present
     * @param {TcElementImpl} tcElement element
     * @param {TcElementImpl} extraMessage extra message
     * @param {Boolean} isPageLoad is loading page
     */
    waitUntilPresenceOf: function (func, extraMessage, isPageLoad) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.waitUntil(function () { return function () { return __awaiter(_this, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _b.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, func().isPresent()];
                                    case 1: return [2 /*return*/, _b.sent()];
                                    case 2:
                                        _a = _b.sent();
                                        // element is not attached to the DOM of a page.
                                        return [2 /*return*/, false];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); }; }, isPageLoad
                            ? appconfig.Timeout.PageLoad
                            : appconfig.Timeout.ElementPresence, (isPageLoad
                            ? appconfig.LoggerErrors.PageLoad
                            : appconfig.LoggerErrors.ElementPresence) +
                            '.' +
                            extraMessage)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Wait for Page to be displayed
     */
    waitForPageDisplayed: function () {
        return __awaiter(this, void 0, void 0, function () {
            var rootId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rootId = topcoder_testing_lib_1.ElementHelper.getElementById('root');
                        return [4 /*yield*/, exports.CommonHelper.waitUntilVisibilityOf(function () { return rootId; }, 'Wait for home page', true)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, rootId];
                }
            });
        });
    },
    /**
     * Fill Input Field with value
     * @param el target element
     * @param value value to fill
     */
    fillInputField: function (el, value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        el.click();
                        return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.sleep(100)];
                    case 1:
                        _a.sent();
                        el.clear();
                        return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.sleep(100)];
                    case 2:
                        _a.sent();
                        el.sendKeys(value);
                        return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Select input by its containing text
     * @param text desired text value
     */
    selectInputByContainingText: function (text) {
        return __awaiter(this, void 0, void 0, function () {
            var selectedOption;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selectedOption = topcoder_testing_lib_1.ElementHelper.getElementContainingText(text);
                        return [4 /*yield*/, selectedOption.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Get element that contain text
     * @param tag tag
     * @param text text contain
     * @param parent parent element
     */
    findElementByText: function (tag, text, parent) {
        return topcoder_testing_lib_1.ElementHelper.getElementByXPath('//' + tag + '[contains(text(), "' + text + '")]', parent);
    },
    /**
     * Find desired value from dropdown menu
     * @param text search value
     * @param parent (optional) parent element
     */
    findTextFromDropDown: function (text, parent) {
        return __awaiter(this, void 0, void 0, function () {
            var xpath, dropDowns;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        xpath = "//div[contains(text(), \"" + text + "\")]";
                        return [4 /*yield*/, topcoder_testing_lib_1.ElementHelper.getAllElementsByXPath(xpath, parent)];
                    case 1:
                        dropDowns = _a.sent();
                        return [2 /*return*/, dropDowns];
                }
            });
        });
    },
    /**
     * Compare given url to current page's url
     * @param url expected page url
     */
    verifyPageUrl: function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var currentUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.getCurrentUrl()];
                    case 1:
                        currentUrl = _a.sent();
                        expect(currentUrl).toContain(url);
                        return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Navigate to All Projects Page
     */
    navigateToAllProjectsPage: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.open(config_helper_1.ConfigHelper.getAllProjectsUrl())];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, exports.CommonHelper.waitForPageDisplayed()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.sleep(5000)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Append date time to given input text
     * @param inputText input text
     */
    appendDate: function (inputText) {
        return inputText + "-" + moment().format();
    },
    /**
     * Get Project Title
     */
    projectTitle: function () {
        return topcoder_testing_lib_1.ElementHelper.getElementByClassName('_1Iqc2q');
    },
    /**
     * Get Page Title
     */
    pageTitle: function () {
        return topcoder_testing_lib_1.ElementHelper.getElementByClassName('TopBarContainer');
    },
    /**
     * Get Loading Indicator
     */
    loadingIndicator: function () {
        return topcoder_testing_lib_1.ElementHelper.getElementByClassName('loading-indicator');
    },
    /**
     * Wait for project title to appear
     */
    waitForProjectTitle: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, exports.CommonHelper.waitUntilVisibilityOf(function () { return _this.projectTitle(); }, 'Wait for project title', true)];
                    case 1:
                        _a.sent();
                        logger_1.logger.info('My Project Page Loaded');
                        return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Wait for page title to appear
     */
    waitForPageTitle: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, exports.CommonHelper.waitUntilVisibilityOf(function () { return _this.pageTitle(); }, 'Wait for project title', true)];
                    case 1:
                        _a.sent();
                        logger_1.logger.info('Home Page Loaded');
                        return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Get recent project title element
     * @param isCustomer true if current logged in user had customer role
     */
    firstProject: function (isCustomer) {
        if (isCustomer === void 0) { isCustomer = false; }
        return __awaiter(this, void 0, void 0, function () {
            var projectClassName, titles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        projectClassName = isCustomer ? 'project-header-details' : 'project-title';
                        return [4 /*yield*/, topcoder_testing_lib_1.ElementHelper.getAllElementsByClassName(projectClassName)];
                    case 1:
                        titles = _a.sent();
                        return [2 /*return*/, titles[0]];
                }
            });
        });
    },
    /**
     * Navigate to first Project From Dashboard
     * @param isCustomer true if current logged in user had customer role
     */
    goToRecentlyCreatedProject: function (isCustomer) {
        if (isCustomer === void 0) { isCustomer = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, title;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.sleep(40000)];
                    case 1:
                        _c.sent();
                        _b = (_a = topcoder_testing_lib_1.BrowserHelper).waitUntilVisibilityOf;
                        return [4 /*yield*/, this.firstProject(isCustomer)];
                    case 2: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, this.firstProject(isCustomer)];
                    case 4:
                        title = _c.sent();
                        return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.waitUntilClickableOf(title)];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, title.click()];
                    case 6:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Get Alert Box Element
     */
    alertBox: function () {
        return topcoder_testing_lib_1.ElementHelper.getElementByClassName('s-alert-box-inner');
    },
    /**
     * Get Success Alert Span
     */
    successAlert: function () {
        return topcoder_testing_lib_1.ElementHelper.getElementByTag('span', this.alertBox());
    },
    /**
     * Wait for success alert to show
     */
    waitForSuccessAlert: function (target) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, exports.CommonHelper.waitUntilVisibilityOf(function () { return target; }, 'Wait for success alert message', true)];
                    case 1:
                        _a.sent();
                        logger_1.logger.info('Success Alert Displayed');
                        return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Wait until element visibility and click
     */
    waitAndClickElement: function (targetEl) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.waitUntilVisibilityOf(targetEl)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, targetEl.click()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Verify success alert shows correct message
     * @param expectedText expected success text to appear
     */
    verifySuccessAlert: function (expectedText) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.waitForSuccessAlert(this.alertBox())];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, this.successAlert().getText()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toBe(expectedText);
                        return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Necessary input format for calendar input
     */
    dateFormat: function () {
        return '00YYYYMMDD';
    },
    /**
     * Get Create Phase Page title
     */
    get createPhasePageTitle() {
        return topcoder_testing_lib_1.ElementHelper.getElementByClassName('_2edGvU');
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3BhZ2Utb2JqZWN0cy9jb21tb24tcGFnZS9jb21tb24uaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLCtCQUFrQztBQUVsQyw2REFBb0U7QUFDcEUsd0RBQTBEO0FBQzFELDhDQUE2QztBQUc3QywyREFBeUQ7QUFDekQsc0RBQXdEO0FBRXhEOzs7OztHQUtHO0FBQ0gsSUFBTSxTQUFTLEdBQUcsVUFDaEIsSUFBZSxFQUNmLFlBQW9CLEVBQ3BCLFVBQW1COzs7b0JBRW5CLHFCQUFNLG9DQUFhLENBQUMsU0FBUyxDQUMzQixJQUFJLEVBQ0osVUFBVTtvQkFDUixDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRO29CQUM1QixDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFDdkMsQ0FBQyxVQUFVO29CQUNULENBQUMsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLFFBQVE7b0JBQ2pDLENBQUMsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDO29CQUMxQyxHQUFHO29CQUNILFlBQVksQ0FDZixFQUFBOztnQkFWRCxTQVVDLENBQUM7Ozs7S0FDSCxDQUFDO0FBRVcsUUFBQSxZQUFZLEdBQUc7SUFDMUI7Ozs7T0FJRztJQUNHLEtBQUssRUFBWCxVQUFZLFFBQWdCLEVBQUUsUUFBZ0I7Ozs7NEJBQzVDLHFCQUFNLG9DQUFhLENBQUMsVUFBVSxFQUFFLEVBQUE7O3dCQUFoQyxTQUFnQyxDQUFDO3dCQUNqQyxxQkFBTSxvQ0FBYSxDQUFDLFFBQVEsRUFBRSxFQUFBOzt3QkFBOUIsU0FBOEIsQ0FBQzt3QkFFL0IscUJBQU0sOEJBQWUsQ0FBQyxJQUFJLEVBQUUsRUFBQTs7d0JBQTVCLFNBQTRCLENBQUM7d0JBQzdCLHFCQUFNLDhCQUFl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