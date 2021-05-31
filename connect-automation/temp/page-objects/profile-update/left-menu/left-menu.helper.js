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
exports.LeftMenuPageHelper = void 0;
var logger_1 = require("../../../logger/logger");
var config_helper_1 = require("../../../utils/config-helper");
var common_helper_1 = require("../../common-page/common.helper");
var left_menu_po_1 = require("./left-menu.po");
var LeftMenuPageHelper = /** @class */ (function () {
    function LeftMenuPageHelper() {
    }
    /**
     * Initialize Left Menu Page Object
     */
    LeftMenuPageHelper.initialize = function () {
        this.leftMenuPageObject = new left_menu_po_1.LeftMenuPageObject();
    };
    /**
     * Verify Profile Information Link redirected correctly
     */
    LeftMenuPageHelper.verifyProfileInformation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var profileInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.leftMenuPageObject.profileInformationLink()];
                    case 1:
                        profileInfo = _a.sent();
                        return [4 /*yield*/, profileInfo.click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, common_helper_1.CommonHelper.waitForPageDisplayed()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, common_helper_1.CommonHelper.verifyPageUrl(config_helper_1.ConfigHelper.getMyProfileUrl())];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Verify Notification Settings Link redirected correctly
     */
    LeftMenuPageHelper.verifyNotificationSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var notificationSettings;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.leftMenuPageObject.notificationSettingsLink()];
                    case 1:
                        notificationSettings = _a.sent();
                        return [4 /*yield*/, notificationSettings.click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, common_helper_1.CommonHelper.waitForPageDisplayed()];
                    case 3:
                        _a.sent();
                        logger_1.logger.info('User navigated to Notification Settings Page');
                        return [4 /*yield*/, common_helper_1.CommonHelper.verifyPageUrl(config_helper_1.ConfigHelper.getNotificationSettingsUrl())];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Verify Account & Security Link redirected correctly
     */
    LeftMenuPageHelper.verifyAccountAndSecurity = function () {
        return __awaiter(this, void 0, void 0, function () {
            var accountAndSecurity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.leftMenuPageObject.accountAndSecurityLink()];
                    case 1:
                        accountAndSecurity = _a.sent();
                        return [4 /*yield*/, accountAndSecurity.click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, common_helper_1.CommonHelper.waitForPageDisplayed()];
                    case 3:
                        _a.sent();
                        logger_1.logger.info('User navigated to Account & Security Page');
                        return [4 /*yield*/, common_helper_1.CommonHelper.verifyPageUrl(config_helper_1.ConfigHelper.getAccountAndSecurityUrl())];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Verify All Projects redirected correctly
     */
    LeftMenuPageHelper.verifyAllProjects = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.leftMenuPageObject.allProjectsLink.click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, common_helper_1.CommonHelper.waitForPageDisplayed()];
                    case 2:
                        _a.sent();
                        logger_1.logger.info('User navigated to All Projects Page');
                        return [4 /*yield*/, common_helper_1.CommonHelper.verifyPageUrl(config_helper_1.ConfigHelper.getAllProjectsUrl())];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Verify Notification Link redirected to correctly
     */
    LeftMenuPageHelper.verifyNotifications = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.leftMenuPageObject.notificationsLink.click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, common_helper_1.CommonHelper.waitForPageDisplayed()];
                    case 2:
                        _a.sent();
                        logger_1.logger.info('User navigated to Notifications Page');
                        return [4 /*yield*/, common_helper_1.CommonHelper.verifyPageUrl(config_helper_1.ConfigHelper.getNotificationUrl())];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return LeftMenuPageHelper;
}());
exports.LeftMenuPageHelper = LeftMenuPageHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVmdC1tZW51LmhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3BhZ2Utb2JqZWN0cy9wcm9maWxlLXVwZGF0ZS9sZWZ0LW1lbnUvbGVmdC1tZW51LmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpREFBZ0Q7QUFDaEQsOERBQTREO0FBQzVELGlFQUErRDtBQUMvRCwrQ0FBb0Q7QUFFcEQ7SUFBQTtJQWtFQSxDQUFDO0lBakVDOztPQUVHO0lBQ1csNkJBQVUsR0FBeEI7UUFDRSxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxpQ0FBa0IsRUFBRSxDQUFDO0lBQ3JELENBQUM7SUFFRDs7T0FFRztJQUNpQiwyQ0FBd0IsR0FBNUM7Ozs7OzRCQUNzQixxQkFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMsc0JBQXNCLEVBQUUsRUFBQTs7d0JBQXBFLFdBQVcsR0FBRyxTQUFzRDt3QkFDMUUscUJBQU0sV0FBVyxDQUFDLEtBQUssRUFBRSxFQUFBOzt3QkFBekIsU0FBeUIsQ0FBQzt3QkFDMUIscUJBQU0sNEJBQVksQ0FBQyxvQkFBb0IsRUFBRSxFQUFBOzt3QkFBekMsU0FBeUMsQ0FBQzt3QkFFMUMscUJBQU0sNEJBQVksQ0FBQyxhQUFhLENBQUMsNEJBQVksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxFQUFBOzt3QkFBaEUsU0FBZ0UsQ0FBQzs7Ozs7S0FDbEU7SUFFRDs7T0FFRztJQUNpQiw2Q0FBMEIsR0FBOUM7Ozs7OzRCQUMrQixxQkFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMsd0JBQXdCLEVBQUUsRUFBQTs7d0JBQS9FLG9CQUFvQixHQUFHLFNBQXdEO3dCQUNyRixxQkFBTSxvQkFBb0IsQ0FBQyxLQUFLLEVBQUUsRUFBQTs7d0JBQWxDLFNBQWtDLENBQUM7d0JBQ25DLHFCQUFNLDRCQUFZLENBQUMsb0JBQW9CLEVBQUUsRUFBQTs7d0JBQXpDLFNBQXlDLENBQUM7d0JBQzFDLGVBQU0sQ0FBQyxJQUFJLENBQUMsOENBQThDLENBQUMsQ0FBQzt3QkFFNUQscUJBQU0sNEJBQVksQ0FBQyxhQUFhLENBQUMsNEJBQVksQ0FBQywwQkFBMEIsRUFBRSxDQUFDLEVBQUE7O3dCQUEzRSxTQUEyRSxDQUFDOzs7OztLQUM3RTtJQUVEOztPQUVHO0lBQ2lCLDJDQUF3QixHQUE1Qzs7Ozs7NEJBQzZCLHFCQUFNLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxzQkFBc0IsRUFBRSxFQUFBOzt3QkFBM0Usa0JBQWtCLEdBQUcsU0FBc0Q7d0JBQ2pGLHFCQUFNLGtCQUFrQixDQUFDLEtBQUssRUFBRSxFQUFBOzt3QkFBaEMsU0FBZ0MsQ0FBQzt3QkFDakMscUJBQU0sNEJBQVksQ0FBQyxvQkFBb0IsRUFBRSxFQUFBOzt3QkFBekMsU0FBeUMsQ0FBQzt3QkFDMUMsZUFBTSxDQUFDLElBQUksQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO3dCQUV6RCxxQkFBTSw0QkFBWSxDQUFDLGFBQWEsQ0FBQyw0QkFBWSxDQUFDLHdCQUF3QixFQUFFLENBQUMsRUFBQTs7d0JBQXpFLFNBQXlFLENBQUM7Ozs7O0tBQzNFO0lBRUQ7O09BRUc7SUFDaUIsb0NBQWlCLEdBQXJDOzs7OzRCQUNFLHFCQUFNLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLEVBQUE7O3dCQUFyRCxTQUFxRCxDQUFDO3dCQUN0RCxxQkFBTSw0QkFBWSxDQUFDLG9CQUFvQixFQUFFLEVBQUE7O3dCQUF6QyxTQUF5QyxDQUFDO3dCQUMxQyxlQUFNLENBQUMsSUFBSSxDQUFDLHFDQUFxQyxDQUFDLENBQUM7d0JBRW5ELHFCQUFNLDRCQUFZLENBQUMsYUFBYSxDQUFDLDRCQUFZLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxFQUFBOzt3QkFBbEUsU0FBa0UsQ0FBQzs7Ozs7S0FDcEU7SUFFRDs7T0FFRztJQUNpQixzQ0FBbUIsR0FBdkM7Ozs7NEJBQ0UscUJBQU0sSUFBSSxDQUFDLGtCQUFrQixDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxFQUFBOzt3QkFBdkQsU0FBdUQsQ0FBQzt3QkFDeEQscUJBQU0sNEJBQVksQ0FBQyxvQkFBb0IsRUFBRSxFQUFBOzt3QkFBekMsU0FBeUMsQ0FBQzt3QkFDMUMsZUFBTSxDQUFDLElBQUksQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO3dCQUVwRCxxQkFBTSw0QkFBWSxDQUFDLGFBQWEsQ0FBQyw0QkFBWSxDQUFDLGtCQUFrQixFQUFFLENBQUMsRUFBQTs7d0JBQW5FLFNBQW1FLENBQUM7Ozs7O0tBQ3JFO0lBR0gseUJBQUM7QUFBRCxDQUFDLEFBbEVELElBa0VDO0FBbEVZLGdEQUFrQiJ9