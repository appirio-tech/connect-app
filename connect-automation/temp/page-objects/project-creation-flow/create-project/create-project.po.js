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
exports.CreateProjectPageObject = void 0;
var topcoder_testing_lib_1 = require("topcoder-testing-lib");
var logger_1 = require("../../../logger/logger");
var config_helper_1 = require("../../../utils/config-helper");
var common_helper_1 = require("../../common-page/common.helper");
var CreateProjectPageObject = /** @class */ (function () {
    function CreateProjectPageObject() {
    }
    /**
     * Open the Home page
     */
    CreateProjectPageObject.open = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.open(config_helper_1.ConfigHelper.getHomePageUrl())];
                    case 1:
                        _a.sent();
                        logger_1.logger.info('User navigated to Home Page');
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(CreateProjectPageObject.prototype, "newProjectButton", {
        /**
         * Get New Project Button
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByLinkText('+ New Project');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CreateProjectPageObject.prototype, "newProjectPageTitles", {
        /**
         * Get New Project Page Title Elements
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getAllElementsByClassName('_1vZbtq');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CreateProjectPageObject.prototype, "viewSolutions", {
        /**
         * Get View Solutions button from Create Project Page
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByButtonText('View Solutions');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CreateProjectPageObject.prototype, "solutionCatalogTitle", {
        /**
         * Get Solution Catalog Page's title element
         */
        get: function () {
            var parentEl = topcoder_testing_lib_1.ElementHelper.getElementByClassName('SelectProjectTemplate');
            return topcoder_testing_lib_1.ElementHelper.getElementByTag('h1', parentEl);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get Select Button
     */
    CreateProjectPageObject.prototype.selectButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            var selectButtons;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, topcoder_testing_lib_1.ElementHelper.getAllElementsByButtonText('Select')];
                    case 1:
                        selectButtons = _a.sent();
                        return [2 /*return*/, selectButtons[0]];
                }
            });
        });
    };
    Object.defineProperty(CreateProjectPageObject.prototype, "yourProjectButton", {
        /**
         * Get Your Project Button
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementContainingText('Go to Project');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CreateProjectPageObject.prototype, "nextButton", {
        /**
         * Get Next Button
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByButtonText('Next');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CreateProjectPageObject.prototype, "saveMyProject", {
        /**
         * Get Save My Project button
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByButtonText('Save my project');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CreateProjectPageObject.prototype, "formPageTitle", {
        /**
         * Get Current Form Page's title element
         */
        get: function () {
            var parentEl = topcoder_testing_lib_1.ElementHelper.getElementByClassName('YAZHbL');
            return topcoder_testing_lib_1.ElementHelper.getElementByTag('h3', parentEl);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CreateProjectPageObject.prototype, "headerSummary", {
        /**
         * Get Project Header Summary
         */
        get: function () {
            var parentEl = topcoder_testing_lib_1.ElementHelper.getElementByClassName('form-header-summary');
            return topcoder_testing_lib_1.ElementHelper.getElementByTag('h2', parentEl);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CreateProjectPageObject.prototype, "appNameInput", {
        /**
         * Get App Name Input
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByName('name');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CreateProjectPageObject.prototype, "appDescriptionInput", {
        /**
         * Get App Description Input
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByName('description');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CreateProjectPageObject.prototype, "draftProject", {
        /**
         * Get Draft Project title
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByClassName('IncompleteProjectConfirmation');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CreateProjectPageObject.prototype, "createNewProject", {
        /**
         * Get Create new Project button
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByButtonText('Create a new project');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CreateProjectPageObject.prototype, "notesInput", {
        /**
         * Get Notes input field
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByName('details.apiDefinition.notes');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CreateProjectPageObject.prototype, "subTitle", {
        /**
         * Get sub title
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementContainingText('Your project has been created');
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Wait for subtitle to show
     */
    CreateProjectPageObject.prototype.waitForSubTitle = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, common_helper_1.CommonHelper.waitUntilVisibilityOf(function () { return _this.subTitle; }, 'Wait for success message', true)];
                    case 1:
                        _a.sent();
                        logger_1.logger.info('Success Message Displayed');
                        return [2 /*return*/];
                }
            });
        });
    };
    return CreateProjectPageObject;
}());
exports.CreateProjectPageObject = CreateProjectPageObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLXByb2plY3QucG8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wYWdlLW9iamVjdHMvcHJvamVjdC1jcmVhdGlvbi1mbG93L2NyZWF0ZS1wcm9qZWN0L2NyZWF0ZS1wcm9qZWN0LnBvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZEQUFvRTtBQUNwRSxpREFBZ0Q7QUFDaEQsOERBQTREO0FBQzVELGlFQUErRDtBQUUvRDtJQUFBO0lBOElBLENBQUM7SUE3SUM7O09BRUc7SUFDaUIsNEJBQUksR0FBeEI7Ozs7NEJBQ0UscUJBQU0sb0NBQWEsQ0FBQyxJQUFJLENBQUMsNEJBQVksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxFQUFBOzt3QkFBdkQsU0FBdUQsQ0FBQzt3QkFDeEQsZUFBTSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDOzs7OztLQUM1QztJQUtELHNCQUFXLHFEQUFnQjtRQUgzQjs7V0FFRzthQUNIO1lBQ0UsT0FBTyxvQ0FBYSxDQUFDLG9CQUFvQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzdELENBQUM7OztPQUFBO0lBS0Qsc0JBQVcseURBQW9CO1FBSC9COztXQUVHO2FBQ0g7WUFDRSxPQUFPLG9DQUFhLENBQUMseUJBQXlCLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDNUQsQ0FBQzs7O09BQUE7SUFLRCxzQkFBVyxrREFBYTtRQUh4Qjs7V0FFRzthQUNIO1lBQ0UsT0FBTyxvQ0FBYSxDQUFDLHNCQUFzQixDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDaEUsQ0FBQzs7O09BQUE7SUFLRCxzQkFBVyx5REFBb0I7UUFIL0I7O1dBRUc7YUFDSDtZQUNFLElBQU0sUUFBUSxHQUFHLG9DQUFhLENBQUMscUJBQXFCLENBQ2xELHVCQUF1QixDQUN4QixDQUFDO1lBQ0YsT0FBTyxvQ0FBYSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVB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