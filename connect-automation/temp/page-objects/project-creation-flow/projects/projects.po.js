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
exports.ProjectsPageObject = void 0;
var topcoder_testing_lib_1 = require("topcoder-testing-lib");
var logger_1 = require("../../../logger/logger");
var config_helper_1 = require("../../../utils/config-helper");
var common_helper_1 = require("../../common-page/common.helper");
var ProjectsPageObject = /** @class */ (function () {
    function ProjectsPageObject() {
    }
    /**
     * Open the Home page
     */
    ProjectsPageObject.open = function () {
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
    Object.defineProperty(ProjectsPageObject.prototype, "joinProjectButton", {
        /**
         * Get Join Project Button
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByButtonText('Join project');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ProjectsPageObject.prototype, "searchInput", {
        /**
         * Get Search Input
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByClassName('search-bar__text');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ProjectsPageObject.prototype, "searchButton", {
        /**
         * Get Search Button
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByClassName('search-icon-wrap');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ProjectsPageObject.prototype, "clearButton", {
        /**
         * Get Clear Button
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByClassName('search-bar__clear');
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get All Projects By Title
     */
    ProjectsPageObject.prototype.projectTitles = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, topcoder_testing_lib_1.ElementHelper.getAllElementsByClassName('link-title')];
            });
        });
    };
    /**
     * Fill search bar with desired input
     * @param inputText input text
     */
    ProjectsPageObject.prototype.fillSearchBar = function (inputText) {
        return __awaiter(this, void 0, void 0, function () {
            var searchInput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        searchInput = this.searchInput;
                        return [4 /*yield*/, common_helper_1.CommonHelper.fillInputField(searchInput, inputText)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.searchButton.click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.sleep(1000)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get Tab Element
     * @param tabName tab name
     */
    ProjectsPageObject.prototype.tabElement = function (tabName) {
        return __awaiter(this, void 0, void 0, function () {
            var parentEl;
            return __generator(this, function (_a) {
                parentEl = topcoder_testing_lib_1.ElementHelper.getElementByClassName('_3M4SZg');
                return [2 /*return*/, topcoder_testing_lib_1.ElementHelper.getElementByCssContainingText('li._2ZbGEn', tabName, parentEl)];
            });
        });
    };
    Object.defineProperty(ProjectsPageObject.prototype, "projectDashboard", {
        /**
         * Get Project Dashboard Element
         */
        get: function () {
            var parentEl = topcoder_testing_lib_1.ElementHelper.getElementByClassName('WtXOeL _3rjDL1');
            return topcoder_testing_lib_1.ElementHelper.getElementContainingText('Dashboard', parentEl);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get Active Tab Element
     */
    ProjectsPageObject.prototype.activeTab = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tabNames;
            return __generator(this, function (_a) {
                tabNames = topcoder_testing_lib_1.ElementHelper.getAllElementsByClassName('_2ZbGEn E7SY3s');
                return [2 /*return*/, tabNames[0]];
            });
        });
    };
    Object.defineProperty(ProjectsPageObject.prototype, "firstMember", {
        /**
         * Get first member's element
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByClassName('GV60ta');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ProjectsPageObject.prototype, "backButton", {
        /**
         * Get back to dashboard button
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByClassName('_3Ielx-');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ProjectsPageObject.prototype, "refText", {
        /**
         * Get ref containing element
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByClassName('txt-gray-md');
        },
        enumerable: false,
        configurable: true
    });
    return ProjectsPageObject;
}());
exports.ProjectsPageObject = ProjectsPageObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdHMucG8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wYWdlLW9iamVjdHMvcHJvamVjdC1jcmVhdGlvbi1mbG93L3Byb2plY3RzL3Byb2plY3RzLnBvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZEQUFvRTtBQUNwRSxpREFBZ0Q7QUFDaEQsOERBQTREO0FBQzVELGlFQUErRDtBQUUvRDtJQUFBO0lBd0dBLENBQUM7SUF2R0M7O09BRUc7SUFDaUIsdUJBQUksR0FBeEI7Ozs7NEJBQ0UscUJBQU0sb0NBQWEsQ0FBQyxJQUFJLENBQUMsNEJBQVksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxFQUFBOzt3QkFBdkQsU0FBdUQsQ0FBQzt3QkFDeEQsZUFBTSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDOzs7OztLQUM1QztJQUtELHNCQUFXLGlEQUFpQjtRQUg1Qjs7V0FFRzthQUNIO1lBQ0UsT0FBTyxvQ0FBYSxDQUFDLHNCQUFzQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzlELENBQUM7OztPQUFBO0lBS0Qsc0JBQVcsMkNBQVc7UUFIdEI7O1dBRUc7YUFDSDtZQUNFLE9BQU8sb0NBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ2pFLENBQUM7OztPQUFBO0lBS0Qsc0JBQVcsNENBQVk7UUFIdkI7O1dBRUc7YUFDSDtZQUNFLE9BQU8sb0NBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ2pFLENBQUM7OztPQUFBO0lBS0Qsc0JBQVcsMkNBQVc7UUFIdEI7O1dBRUc7YUFDSDtZQUNFLE9BQU8sb0NBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ2xFLENBQUM7OztPQUFBO0lBRUQ7O09BRUc7SUFDVSwwQ0FBYSxHQUExQjs7O2dCQUNFLHNCQUFPLG9DQUFhLENBQUMseUJBQXlCLENBQUMsWUFBWSxDQUFDLEVBQUM7OztLQUM5RDtJQUVEOzs7T0FHRztJQUNVLDBDQUFhLEdBQTFCLFVBQTJCLFNBQWlCOzs7Ozs7d0JBQ3BDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO3dCQUNyQyxxQkFBTSw0QkFBWSxDQUFDLGNBQWMsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLEVBQUE7O3dCQUF6RCxTQUF5RCxDQUFDO3dCQUMxRCxxQkFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxFQUFBOzt3QkFBL0IsU0FBK0IsQ0FBQzt3QkFDaEMscUJBQU0sb0NBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUE7O3dCQUEvQixTQUErQixDQUFDOzs7OztLQUNqQztJQUVEOzs7T0FHRztJQUNVLHVDQUFVLEdBQXZCLFVBQXdCLE9BQWU7Ozs7Z0JBQy9CLFFBQVEsR0FBRyxvQ0FBYSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNoRSxzQkFBTyxvQ0FBYSxDQUFDLDZCQUE2QixDQUNoRCxZQUFZLEVBQ1osT0FBTyxFQUNQLFFBQVEsQ0FDVCxFQUFDOzs7S0FDSDtJQUtELHNCQUFXLGdEQUFnQjtRQUgzQjs7V0FFRzthQUNIO1lBQ0UsSUFBTSxRQUFRLEdBQUcsb0NBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3ZFLE9BQU8sb0NBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDdkUsQ0FBQzs7O09BQUE7SUFFRDs7T0FFRztJQUNVLHNDQUFTLEdBQXRCOzs7O2dCQUNRLFFBQVEsR0FBRyxvQ0FBYSxDQUFDLHlCQUF5QixDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBQzNFLHNCQUFPLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBQzs7O0tBQ3BCO0lBS0Qsc0JBQVcsMkNBQVc7UUFIdEI7O1dBRUc7YUFDSDtZQUNFLE9BQU8sb0NBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN2RCxDQUFDOzs7T0FBQTtJQUtELHNCQUFXLDBDQUFVO1FBSHJCOztXQUVHO2FBQ0g7WUFDRSxPQUFPLG9DQUFhLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEQsQ0FBQzs7O09BQUE7SUFLRCxzQkFBVyx1Q0FBTztRQUhsQjs7V0FFRzthQUNIO1lBQ0UsT0FBTyxvQ0FBYSxDQUFDLHFCQUFxQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzVELENBQUM7OztPQUFBO0lBQ0gseUJBQUM7QUFBRCxDQUFDLEFBeEdELElBd0dDO0FBeEdZLGdEQUFrQiJ9