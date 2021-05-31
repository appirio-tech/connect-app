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
exports.LoginPageHelper = void 0;
var topcoder_testing_lib_1 = require("topcoder-testing-lib");
var common_helper_1 = require("../common-page/common.helper");
var login_po_1 = require("./login.po");
var LoginPageHelper = /** @class */ (function () {
    function LoginPageHelper() {
    }
    /**
     * Set the page object
     * @param loginPage login Page
     */
    LoginPageHelper.setLoginPage = function (loginPage) {
        this.loginPageObject = loginPage;
    };
    /**
     * Open page
     */
    LoginPageHelper.open = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.loginPageObject = new login_po_1.LoginPage();
                        return [4 /*yield*/, this.loginPageObject.open()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Login
     * @param {String} username
     * @param {String} password
     */
    LoginPageHelper.login = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loginPageObject.waitForLoginForm()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.loginPageObject.fillLoginForm(username, password)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, common_helper_1.CommonHelper.waitForPageDisplayed()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Logout
     */
    LoginPageHelper.logout = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loginPageObject.logout()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.sleep(5000)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return LoginPageHelper;
}());
exports.LoginPageHelper = LoginPageHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vcGFnZS1vYmplY3RzL2xvZ2luL2xvZ2luLmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2REFBcUQ7QUFDckQsOERBQTREO0FBQzVELHVDQUF1QztBQUV2QztJQUFBO0lBcUNBLENBQUM7SUFwQ0M7OztPQUdHO0lBQ1csNEJBQVksR0FBMUIsVUFBMkIsU0FBb0I7UUFDN0MsSUFBSSxDQUFDLGVBQWUsR0FBRyxTQUFTLENBQUM7SUFDbkMsQ0FBQztJQUVEOztPQUVHO0lBQ2lCLG9CQUFJLEdBQXhCOzs7Ozt3QkFDRSxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksb0JBQVMsRUFBRSxDQUFDO3dCQUN2QyxxQkFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxFQUFBOzt3QkFBakMsU0FBaUMsQ0FBQzs7Ozs7S0FDbkM7SUFFRDs7OztPQUlHO0lBQ2lCLHFCQUFLLEdBQXpCLFVBQTBCLFFBQWdCLEVBQUUsUUFBZ0I7Ozs7NEJBQzFELHFCQUFNLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLEVBQUUsRUFBQTs7d0JBQTdDLFNBQTZDLENBQUM7d0JBQzlDLHFCQUFNLElBQUksQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsRUFBQTs7d0JBQTVELFNBQTRELENBQUM7d0JBQzdELHFCQUFNLDRCQUFZLENBQUMsb0JBQW9CLEVBQUUsRUFBQTs7d0JBQXpDLFNBQXlDLENBQUM7Ozs7O0tBQzNDO0lBRUQ7O09BRUc7SUFDaUIsc0JBQU0sR0FBMUI7Ozs7NEJBQ0UscUJBQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsRUFBQTs7d0JBQW5DLFNBQW1DLENBQUM7d0JBQ3BDLHFCQUFNLG9DQUFhLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFBOzt3QkFBL0IsU0FBK0IsQ0FBQzs7Ozs7S0FDakM7SUFHSCxzQkFBQztBQUFELENBQUMsQUFyQ0QsSUFxQ0M7QUFyQ1ksMENBQWUifQ==