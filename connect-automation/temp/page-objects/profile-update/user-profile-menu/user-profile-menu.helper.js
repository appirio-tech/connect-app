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
exports.UserProfileMenuHelper = void 0;
var config_helper_1 = require("../../../utils/config-helper");
var common_helper_1 = require("../../common-page/common.helper");
var user_profile_menu_po_1 = require("./user-profile-menu.po");
var UserProfileMenuHelper = /** @class */ (function () {
    function UserProfileMenuHelper() {
    }
    /**
     * Initialize User Profile Page Object
     */
    UserProfileMenuHelper.initialize = function () {
        this.userProfilePageObject = new user_profile_menu_po_1.UserProfilePageObject();
    };
    /**
     * Opens Profile Menu from right top corner section
     */
    UserProfileMenuHelper.openMenuDropdown = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, common_helper_1.CommonHelper.navigateToAllProjectsPage()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.userProfilePageObject.menuDropdown.click()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Verify My Profile Page redirects to correct url
     */
    UserProfileMenuHelper.verifyMyProfile = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.openMenuDropdown()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.userProfilePageObject.myProfileLink.click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, common_helper_1.CommonHelper.verifyPageUrl(config_helper_1.ConfigHelper.getMyProfileUrl())];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Verify Notification Settings button redirects correctly
     */
    UserProfileMenuHelper.verifyNotificationSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.openMenuDropdown()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.userProfilePageObject.notificationSettingsLink.click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, common_helper_1.CommonHelper.verifyPageUrl(config_helper_1.ConfigHelper.getNotificationSettingsUrl())];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Verify Account & Security button redirects correctly
     */
    UserProfileMenuHelper.verifyAccountAndSecurity = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.openMenuDropdown()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.userProfilePageObject.accountSecurityLink.click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, common_helper_1.CommonHelper.verifyPageUrl(config_helper_1.ConfigHelper.getAccountAndSecurityUrl())];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Verify Logout button redirects to home page.
     */
    UserProfileMenuHelper.verifyLogout = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.openMenuDropdown()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.userProfilePageObject.logoutLink.click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, common_helper_1.CommonHelper.verifyPageUrl(config_helper_1.ConfigHelper.getHomePageUrl())];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return UserProfileMenuHelper;
}());
exports.UserProfileMenuHelper = UserProfileMenuHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1wcm9maWxlLW1lbnUuaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcGFnZS1vYmplY3RzL3Byb2ZpbGUtdXBkYXRlL3VzZXItcHJvZmlsZS1tZW51L3VzZXItcHJvZmlsZS1tZW51LmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4REFBNEQ7QUFDNUQsaUVBQStEO0FBQy9ELCtEQUErRDtBQUUvRDtJQUFBO0lBcURBLENBQUM7SUFwREM7O09BRUc7SUFDVyxnQ0FBVSxHQUF4QjtRQUNFLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLDRDQUFxQixFQUFFLENBQUM7SUFDM0QsQ0FBQztJQUVEOztPQUVHO0lBQ2lCLHNDQUFnQixHQUFwQzs7Ozs0QkFDRSxxQkFBTSw0QkFBWSxDQUFDLHlCQUF5QixFQUFFLEVBQUE7O3dCQUE5QyxTQUE4QyxDQUFDO3dCQUMvQyxxQkFBTSxJQUFJLENBQUMscUJBQXFCLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxFQUFBOzt3QkFBckQsU0FBcUQsQ0FBQzs7Ozs7S0FDdkQ7SUFFRDs7T0FFRztJQUNpQixxQ0FBZSxHQUFuQzs7Ozs0QkFDRSxxQkFBTSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsRUFBQTs7d0JBQTdCLFNBQTZCLENBQUM7d0JBQzlCLHFCQUFNLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEVBQUE7O3dCQUF0RCxTQUFzRCxDQUFDO3dCQUN2RCxxQkFBTSw0QkFBWSxDQUFDLGFBQWEsQ0FBQyw0QkFBWSxDQUFDLGVBQWUsRUFBRSxDQUFDLEVBQUE7O3dCQUFoRSxTQUFnRSxDQUFDOzs7OztLQUNsRTtJQUVEOztPQUVHO0lBQ2lCLGdEQUEwQixHQUE5Qzs7Ozs0QkFDRSxxQkFBTSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsRUFBQTs7d0JBQTdCLFNBQTZCLENBQUM7d0JBQzlCLHFCQUFNLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsQ0FBQyxLQUFLLEVBQUUsRUFBQTs7d0JBQWpFLFNBQWlFLENBQUM7d0JBQ2xFLHFCQUFNLDRCQUFZLENBQUMsYUFBYSxDQUFDLDRCQUFZLENBQUMsMEJBQTBCLEVBQUUsQ0FBQyxFQUFBOzt3QkFBM0UsU0FBMkUsQ0FBQzs7Ozs7S0FDN0U7SUFFRDs7T0FFRztJQUNpQiw4Q0FBd0IsR0FBNUM7Ozs7NEJBQ0UscUJBQU0sSUFBSSxDQUFDLGdCQUFnQixFQUFFLEVBQUE7O3dCQUE3QixTQUE2QixDQUFDO3dCQUM5QixxQkFBTSxJQUFJLENBQUMscUJBQXFCLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLEVBQUE7O3dCQUE1RCxTQUE0RCxDQUFDO3dCQUM3RCxxQkFBTSw0QkFBWSxDQUFDLGFBQWEsQ0FBQyw0QkFBWSxDQUFDLHdCQUF3QixFQUFFLENBQUMsRUFBQTs7d0JBQXpFLFNBQXlFLENBQUM7Ozs7O0tBQzNFO0lBRUQ7O09BRUc7SUFDaUIsa0NBQVksR0FBaEM7Ozs7NEJBQ0UscUJBQU0sSUFBSSxDQUFDLGdCQUFnQixFQUFFLEVBQUE7O3dCQUE3QixTQUE2QixDQUFDO3dCQUM5QixxQkFBTSxJQUFJLENBQUMscUJBQXFCLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxFQUFBOzt3QkFBbkQsU0FBbUQsQ0FBQzt3QkFDcEQscUJBQU0sNEJBQVksQ0FBQyxhQUFhLENBQUMsNEJBQVksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxFQUFBOzt3QkFBL0QsU0FBK0QsQ0FBQzs7Ozs7S0FDakU7SUFHSCw0QkFBQztBQUFELENBQUMsQUFyREQsSUFxREM7QUFyRFksc0RBQXFCIn0=