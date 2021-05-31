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
exports.InviteCopilotPageObject = void 0;
var topcoder_testing_lib_1 = require("topcoder-testing-lib");
var logger_1 = require("../../../logger/logger");
var config_helper_1 = require("../../../utils/config-helper");
var InviteCopilotPageObject = /** @class */ (function () {
    function InviteCopilotPageObject() {
    }
    /**
     * Open Home page
     */
    InviteCopilotPageObject.open = function () {
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
    Object.defineProperty(InviteCopilotPageObject.prototype, "manageCopilotLink", {
        /**
         * Get Manage Copilot Link From Left Menu
         */
        get: function () {
            var copilotDiv = topcoder_testing_lib_1.ElementHelper.getElementByCssContainingText('span._1hKIoG', 'Copilot');
            return topcoder_testing_lib_1.ElementHelper.getElementByXPath('following-sibling::span', copilotDiv);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InviteCopilotPageObject.prototype, "dropdownElement", {
        /**
         * Get Copilot invitation dropdown element
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByClassName('react-select__placeholder');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InviteCopilotPageObject.prototype, "inviteInputField", {
        /**
         * Get Copilot invitation input field
         */
        get: function () {
            var parentEl = topcoder_testing_lib_1.ElementHelper.getElementByClassName('react-select__input');
            return topcoder_testing_lib_1.ElementHelper.getElementByTag('input', parentEl);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InviteCopilotPageObject.prototype, "selectedOption", {
        /**
         * Get Selected option element from dropdown
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByClassName('react-select__option--is-focused');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InviteCopilotPageObject.prototype, "sendInviteButton", {
        /**
         * Get Send Invite button
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByButtonText('Send Invite');
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get Invited Copilots List Elements
     */
    InviteCopilotPageObject.prototype.invitedCopilots = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, topcoder_testing_lib_1.ElementHelper.getAllElementsByClassName('span-name')];
            });
        });
    };
    return InviteCopilotPageObject;
}());
exports.InviteCopilotPageObject = InviteCopilotPageObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW52aXRlLWNvcGlsb3QucG8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wYWdlLW9iamVjdHMvcHJvamVjdC1jcmVhdGlvbi1mbG93L2ludml0ZS1jb3BpbG90L2ludml0ZS1jb3BpbG90LnBvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZEQUFvRTtBQUNwRSxpREFBZ0Q7QUFDaEQsOERBQTREO0FBRTVEO0lBQUE7SUE2REEsQ0FBQztJQTVEQzs7T0FFRztJQUNpQiw0QkFBSSxHQUF4Qjs7Ozs0QkFDRSxxQkFBTSxvQ0FBYSxDQUFDLElBQUksQ0FBQyw0QkFBWSxDQUFDLGNBQWMsRUFBRSxDQUFDLEVBQUE7O3dCQUF2RCxTQUF1RCxDQUFDO3dCQUN4RCxlQUFNLENBQUMsSUFBSSxDQUFDLDZCQUE2QixDQUFDLENBQUM7Ozs7O0tBQzVDO0lBS0Qsc0JBQVcsc0RBQWlCO1FBSDVCOztXQUVHO2FBQ0g7WUFDRSxJQUFNLFVBQVUsR0FBRyxvQ0FBYSxDQUFDLDZCQUE2QixDQUM1RCxjQUFjLEVBQ2QsU0FBUyxDQUNWLENBQUM7WUFFRixPQUFPLG9DQUFhLENBQUMsaUJBQWlCLENBQ3BDLHlCQUF5QixFQUN6QixVQUFVLENBQ1gsQ0FBQztRQUNKLENBQUM7OztPQUFBO0lBS0Qsc0JBQVcsb0RBQWU7UUFIMUI7O1dBRUc7YUFDSDtZQUNFLE9BQU8sb0NBQWEsQ0FBQyxxQkFBcUIsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1FBQzFFLENBQUM7OztPQUFBO0lBS0Qsc0JBQVcscURBQWdCO1FBSDNCOztXQUVHO2FBQ0g7WUFDRSxJQUFNLFFBQVEsR0FBRyxvQ0FBYSxDQUFDLHFCQUFxQixDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFDNUUsT0FBTyxvQ0FBYSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDMUQsQ0FBQzs7O09BQUE7SUFLRCxzQkFBVyxtREFBYztRQUh6Qjs7V0FFRzthQUNIO1lBQ0UsT0FBTyxvQ0FBYSxDQUFDLHFCQUFxQixDQUN4QyxrQ0FBa0MsQ0FDbkMsQ0FBQztRQUNKLENBQUM7OztPQUFBO0lBS0Qsc0JBQVcscURBQWdCO1FBSDNCOztXQUVHO2FBQ0g7WUFDRSxPQUFPLG9DQUFhLENBQUMsc0JBQXNCLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDN0QsQ0FBQzs7O09BQUE7SUFFRDs7T0FFRztJQUNVLGlEQUFlLEdBQTVCOzs7Z0JBQ0Usc0JBQU8sb0NBQWEsQ0FBQyx5QkFBeUIsQ0FBQyxXQUFXLENBQUMsRUFBQzs7O0tBQzdEO0lBQ0gsOEJBQUM7QUFBRCxDQUFDLEFBN0RELElBNkRDO0FBN0RZLDBEQUF1QiJ9