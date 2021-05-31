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
exports.LoginPage = void 0;
var topcoder_testing_lib_1 = require("topcoder-testing-lib");
var appconfig = require("../../config/app-config.json");
var logger_1 = require("../../logger/logger");
var config_helper_1 = require("../../utils/config-helper");
var common_helper_1 = require("../common-page/common.helper");
var LoginPage = /** @class */ (function () {
    function LoginPage() {
    }
    /**
     * Get login page
     */
    LoginPage.prototype.open = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.open(config_helper_1.ConfigHelper.getRedirectLoginUrl())];
                    case 1:
                        _a.sent();
                        logger_1.logger.info('User navigated to Topcoder Login Page');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Logout the user
     */
    LoginPage.prototype.logout = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.open(config_helper_1.ConfigHelper.getLogoutUrl())];
                    case 1:
                        _a.sent();
                        logger_1.logger.info('user logged out');
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(LoginPage.prototype, "userNameField", {
        /**
         * Get Username field
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByName('username');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LoginPage.prototype, "passwordField", {
        /**
         * Get Password field
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByName('password');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LoginPage.prototype, "loginButton", {
        /**
         * Get Login button
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByCss("button[type = 'submit']");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LoginPage.prototype, "loginForm", {
        /**
         * Get login form
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByClassName('auth0-lock-widget');
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Wait for the login form to be displayed
     */
    LoginPage.prototype.waitForLoginForm = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Wait until login form appears
                    return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.sleep(8000)];
                    case 1:
                        // Wait until login form appears
                        _a.sent();
                        common_helper_1.CommonHelper.waitUntilVisibilityOf(function () { return _this.loginForm; }, 'Wait for login form', true);
                        logger_1.logger.info('Login Form Displayed');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Fill and submit the login form
     */
    LoginPage.prototype.fillLoginForm = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, common_helper_1.CommonHelper.waitUntilPresenceOf(function () { return _this.userNameField; }, 'wait for username field', false)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.userNameField.sendKeys(username)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.passwordField.sendKeys(password)];
                    case 3:
                        _a.sent();
                        logger_1.logger.info('Login form filled with values: username - ' +
                            username +
                            ', password - FILTERED');
                        return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.waitUntilClickableOf(this.loginButton, appconfig.Timeout.ElementClickable, appconfig.LoggerErrors.ElementClickable)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.loginButton.click()];
                    case 5:
                        _a.sent();
                        logger_1.logger.info('Submitted login form');
                        return [2 /*return*/];
                }
            });
        });
    };
    return LoginPage;
}());
exports.LoginPage = LoginPage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4ucG8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9wYWdlLW9iamVjdHMvbG9naW4vbG9naW4ucG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkRBQW9FO0FBQ3BFLHdEQUEwRDtBQUMxRCw4Q0FBNkM7QUFDN0MsMkRBQXlEO0FBQ3pELDhEQUE0RDtBQUU1RDtJQUFBO0lBbUZBLENBQUM7SUFsRkM7O09BRUc7SUFDVSx3QkFBSSxHQUFqQjs7Ozs0QkFDRSxxQkFBTSxvQ0FBYSxDQUFDLElBQUksQ0FBQyw0QkFBWSxDQUFDLG1CQUFtQixFQUFFLENBQUMsRUFBQTs7d0JBQTVELFNBQTRELENBQUM7d0JBQzdELGVBQU0sQ0FBQyxJQUFJLENBQUMsdUNBQXVDLENBQUMsQ0FBQzs7Ozs7S0FDdEQ7SUFFRDs7T0FFRztJQUNVLDBCQUFNLEdBQW5COzs7OzRCQUNFLHFCQUFNLG9DQUFhLENBQUMsSUFBSSxDQUFDLDRCQUFZLENBQUMsWUFBWSxFQUFFLENBQUMsRUFBQTs7d0JBQXJELFNBQXFELENBQUM7d0JBQ3RELGVBQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQzs7Ozs7S0FDaEM7SUFLRCxzQkFBVyxvQ0FBYTtRQUh4Qjs7V0FFRzthQUNIO1lBQ0UsT0FBTyxvQ0FBYSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3BELENBQUM7OztPQUFBO0lBS0Qsc0JBQVcsb0NBQWE7UUFIeEI7O1dBRUc7YUFDSDtZQUNFLE9BQU8sb0NBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNwRCxDQUFDOzs7T0FBQTtJQUtELHNCQUFXLGtDQUFXO1FBSHRCOztXQUVHO2FBQ0g7WUFDRSxPQUFPLG9DQUFhLENBQUMsZUFBZSxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDbEUsQ0FBQzs7O09BQUE7SUFLRCxzQkFBVyxnQ0FBUztRQUhwQjs7V0FFRzthQUNIO1lBQ0UsT0FBTyxvQ0FBYSxDQUFDLHFCQUFxQixDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDbEUsQ0FBQzs7O09BQUE7SUFFRDs7T0FFRztJQUNVLG9DQUFnQixHQUE3Qjs7Ozs7O29CQUNFLGdDQUFnQztvQkFDaEMscUJBQU0sb0NBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUE7O3dCQUQvQixnQ0FBZ0M7d0JBQ2hDLFNBQStCLENBQUM7d0JBQ2hDLDRCQUFZLENBQUMscUJBQXFCLENBQ2hDLGNBQU0sT0FBQSxLQUFJLENBQUMsU0FBUyxFQUFkLENBQWMsRUFDcEIscUJBQXFCLEVBQ3JCLElBQUksQ0FDTCxDQUFDO3dCQUNGLGVBQU0sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQzs7Ozs7S0FDckM7SUFFRDs7T0FFRztJQUNVLGlDQUFhLEdBQTFCLFVBQTJCLFFBQVEsRUFBRSxRQUFROzs7Ozs0QkFDM0MscUJBQU0sNEJBQVksQ0FBQyxtQkFBbUIsQ0FDcEMsY0FBTSxPQUFBLEtBQUksQ0FBQyxhQUFhLEVBQWxCLENBQWtCLEVBQ3hCLHlCQUF5QixFQUN6QixLQUFLLENBQ04sRUFBQTs7d0JBSkQsU0FJQyxDQUFDO3dCQUNGLHFCQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFBOzt3QkFBM0MsU0FBMkMsQ0FBQzt3QkFDNUMscUJBQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUE7O3dCQUEzQyxTQUEyQyxDQUFDO3dCQUM1QyxlQUFNLENBQUMsSUFBSSxDQUNULDRDQUE0Qzs0QkFDMUMsUUFBUTs0QkFDUix1QkFBdUIsQ0FDMUIsQ0FBQzt3QkFDRixxQkFBTSxvQ0FBYSxDQUFDLG9CQUFvQixDQUN0QyxJQUFJLENBQUMsV0FBVyxFQUNoQixTQUFTLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUNsQyxTQUFTLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUN4QyxFQUFBOzt3QkFKRCxTQUlDLENBQUM7d0JBQ0YscUJBQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsRUFBQTs7d0JBQTlCLFNBQThCLENBQUM7d0JBQy9CLGVBQU0sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQzs7Ozs7S0FDckM7SUFDSCxnQkFBQztBQUFELENBQUMsQUFuRkQsSUFtRkM7QUFuRlksOEJBQVMifQ==