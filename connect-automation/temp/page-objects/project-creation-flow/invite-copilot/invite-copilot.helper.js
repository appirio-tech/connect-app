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
exports.InviteCopilotHelper = void 0;
var topcoder_testing_lib_1 = require("topcoder-testing-lib");
var common_helper_1 = require("../../common-page/common.helper");
var invite_copilot_po_1 = require("./invite-copilot.po");
var InviteCopilotHelper = /** @class */ (function () {
    function InviteCopilotHelper() {
    }
    /**
     * Initialize Invite Copilot page object
     */
    InviteCopilotHelper.initialize = function () {
        this.inviteCopilotPageObject = new invite_copilot_po_1.InviteCopilotPageObject();
    };
    /**
     * Open Home Page
     */
    InviteCopilotHelper.open = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, invite_copilot_po_1.InviteCopilotPageObject.open()];
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
     * Verify whether the Copilot Manager can invite to project
     * @param copilotHandle copilot handle from test data
     */
    InviteCopilotHelper.verifyManageProject = function (copilotHandle) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, common_helper_1.CommonHelper.goToRecentlyCreatedProject()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.clickOnManageLink()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.sendInvitationToCopilot(copilotHandle)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Click on Manage link of Copilot Section of Left menu
     */
    InviteCopilotHelper.clickOnManageLink = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, common_helper_1.CommonHelper.waitAndClickElement(this.inviteCopilotPageObject.manageCopilotLink)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.sleep(2000)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Send the invitation to Copilot Manager
     * @param copilotHandle copilot handle from test data
     */
    InviteCopilotHelper.sendInvitationToCopilot = function (copilotHandle) {
        return __awaiter(this, void 0, void 0, function () {
            var inputField, alertElement, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        inputField = this.inviteCopilotPageObject.inviteInputField;
                        return [4 /*yield*/, this.inviteCopilotPageObject.dropdownElement.click()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.sleep(200)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, inputField.sendKeys(copilotHandle)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, this.inviteCopilotPageObject.selectedOption.click()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, this.inviteCopilotPageObject.sendInviteButton.click()];
                    case 5:
                        _b.sent();
                        alertElement = common_helper_1.CommonHelper.alertBox();
                        return [4 /*yield*/, common_helper_1.CommonHelper.waitForSuccessAlert(alertElement)];
                    case 6:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, common_helper_1.CommonHelper.successAlert().getText()];
                    case 7:
                        _a.apply(void 0, [_b.sent()]).toBe("YOU'VE SUCCESSFULLY INVITED MEMBER(S).");
                        return [2 /*return*/];
                }
            });
        });
    };
    return InviteCopilotHelper;
}());
exports.InviteCopilotHelper = InviteCopilotHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW52aXRlLWNvcGlsb3QuaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcGFnZS1vYmplY3RzL3Byb2plY3QtY3JlYXRpb24tZmxvdy9pbnZpdGUtY29waWxvdC9pbnZpdGUtY29waWxvdC5oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkRBQXFEO0FBQ3JELGlFQUErRDtBQUMvRCx5REFBOEQ7QUFFOUQ7SUFBQTtJQXVEQSxDQUFDO0lBdERDOztPQUVHO0lBQ1csOEJBQVUsR0FBeEI7UUFDRSxJQUFJLENBQUMsdUJBQXVCLEdBQUcsSUFBSSwyQ0FBdUIsRUFBRSxDQUFDO0lBQy9ELENBQUM7SUFFRDs7T0FFRztJQUNpQix3QkFBSSxHQUF4Qjs7Ozs0QkFDRSxxQkFBTSwyQ0FBdUIsQ0FBQyxJQUFJLEVBQUUsRUFBQTs7d0JBQXBDLFNBQW9DLENBQUM7d0JBQ3JDLHFCQUFNLDRCQUFZLENBQUMsb0JBQW9CLEVBQUUsRUFBQTs7d0JBQXpDLFNBQXlDLENBQUM7Ozs7O0tBRTNDO0lBRUQ7OztPQUdHO0lBQ2lCLHVDQUFtQixHQUF2QyxVQUF3QyxhQUFxQjs7Ozs0QkFDM0QscUJBQU0sNEJBQVksQ0FBQywwQkFBMEIsRUFBRSxFQUFBOzt3QkFBL0MsU0FBK0MsQ0FBQzt3QkFDaEQscUJBQU0sSUFBSSxDQUFDLGlCQUFpQixFQUFFLEVBQUE7O3dCQUE5QixTQUE4QixDQUFDO3dCQUMvQixxQkFBTSxJQUFJLENBQUMsdUJBQXVCLENBQUMsYUFBYSxDQUFDLEVBQUE7O3dCQUFqRCxTQUFpRCxDQUFDOzs7OztLQUNuRDtJQUlEOztPQUVHO0lBQ2tCLHFDQUFpQixHQUF0Qzs7Ozs0QkFDRSxxQkFBTSw0QkFBWSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFBOzt3QkFBdEYsU0FBc0YsQ0FBQzt3QkFDdkYscUJBQU0sb0NBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUE7O3dCQUEvQixTQUErQixDQUFDOzs7OztLQUNqQztJQUVEOzs7T0FHRztJQUNrQiwyQ0FBdUIsR0FBNUMsVUFBNkMsYUFBcUI7Ozs7Ozt3QkFDMUQsVUFBVSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxnQkFBZ0IsQ0FBQzt3QkFDakUscUJBQU0sSUFBSSxDQUFDLHVCQUF1QixDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsRUFBQTs7d0JBQTFELFNBQTBELENBQUM7d0JBQzNELHFCQUFNLG9DQUFhLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFBOzt3QkFBOUIsU0FBOEIsQ0FBQzt3QkFDL0IscUJBQU0sVUFBVSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsRUFBQTs7d0JBQXhDLFNBQXdDLENBQUM7d0JBQ3pDLHFCQUFNLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLEVBQUE7O3dCQUF6RCxTQUF5RCxDQUFDO3dCQUMxRCxxQkFBTSxJQUFJLENBQUMsdUJBQXVCLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLEVBQUE7O3dCQUEzRCxTQUEyRCxDQUFDO3dCQUN0RCxZQUFZLEdBQUcsNEJBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQzt3QkFDN0MscUJBQU0sNEJBQVksQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLENBQUMsRUFBQTs7d0JBQXBELFNBQW9ELENBQUM7d0JBRXJELEtBQUEsTUFBTSxDQUFBO3dCQUFDLHFCQUFNLDRCQUFZLENBQUMsWUFBWSxFQUFFLENBQUMsT0FBTyxFQUFFLEVBQUE7O3dCQUFsRCxrQkFBTyxTQUEyQyxFQUFDLENBQUMsSUFBSSxDQUN0RCx3Q0FBd0MsQ0FDekMsQ0FBQzs7Ozs7S0FDSDtJQUNILDBCQUFDO0FBQUQsQ0FBQyxBQXZERCxJQXVEQztBQXZEWSxrREFBbUIifQ==