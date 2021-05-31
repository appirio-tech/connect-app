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
exports.LeftMenuPageObject = void 0;
var topcoder_testing_lib_1 = require("topcoder-testing-lib");
var LeftMenuPageObject = /** @class */ (function () {
    function LeftMenuPageObject() {
    }
    Object.defineProperty(LeftMenuPageObject.prototype, "myProfileLink", {
        /**
         * Get My Profile Link Element
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementContainingText('MY PROFILE');
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get Sub Menus
     */
    LeftMenuPageObject.prototype.getSubmenus = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, topcoder_testing_lib_1.ElementHelper.getAllElementsByClassName('_1l5nE0 _3wRYsd')];
            });
        });
    };
    /**
     * Get Profile Information Link
     */
    LeftMenuPageObject.prototype.profileInformationLink = function () {
        return __awaiter(this, void 0, void 0, function () {
            var menus;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSubmenus()];
                    case 1:
                        menus = _a.sent();
                        return [2 /*return*/, menus[0]];
                }
            });
        });
    };
    /**
     * Get Notification Settings Link
     */
    LeftMenuPageObject.prototype.notificationSettingsLink = function () {
        return __awaiter(this, void 0, void 0, function () {
            var menus;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSubmenus()];
                    case 1:
                        menus = _a.sent();
                        return [2 /*return*/, menus[1]];
                }
            });
        });
    };
    /**
     * Get Account & Security Link
     */
    LeftMenuPageObject.prototype.accountAndSecurityLink = function () {
        return __awaiter(this, void 0, void 0, function () {
            var menus;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSubmenus()];
                    case 1:
                        menus = _a.sent();
                        return [2 /*return*/, menus[2]];
                }
            });
        });
    };
    Object.defineProperty(LeftMenuPageObject.prototype, "allProjectsLink", {
        /**
         * Get All Projects Link
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementContainingText('ALL PROJECTS');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LeftMenuPageObject.prototype, "notificationsLink", {
        /**
         * Get Notifications Link
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementContainingText('NOTIFICATIONS');
        },
        enumerable: false,
        configurable: true
    });
    return LeftMenuPageObject;
}());
exports.LeftMenuPageObject = LeftMenuPageObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVmdC1tZW51LnBvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcGFnZS1vYmplY3RzL3Byb2ZpbGUtdXBkYXRlL2xlZnQtbWVudS9sZWZ0LW1lbnUucG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkRBQXFEO0FBRXJEO0lBQUE7SUFvREEsQ0FBQztJQWhEQyxzQkFBVyw2Q0FBYTtRQUh4Qjs7V0FFRzthQUNIO1lBQ0UsT0FBTyxvQ0FBYSxDQUFDLHdCQUF3QixDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzlELENBQUM7OztPQUFBO0lBRUQ7O09BRUc7SUFDVSx3Q0FBVyxHQUF4Qjs7O2dCQUNFLHNCQUFPLG9DQUFhLENBQUMseUJBQXlCLENBQUMsaUJBQWlCLENBQUMsRUFBQzs7O0tBQ25FO0lBRUQ7O09BRUc7SUFDVSxtREFBc0IsR0FBbkM7Ozs7OzRCQUNnQixxQkFBTSxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUE7O3dCQUFoQyxLQUFLLEdBQUcsU0FBd0I7d0JBQ3RDLHNCQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBQzs7OztLQUNqQjtJQUVEOztPQUVHO0lBQ1UscURBQXdCLEdBQXJDOzs7Ozs0QkFDZ0IscUJBQU0sSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFBOzt3QkFBaEMsS0FBSyxHQUFHLFNBQXdCO3dCQUN0QyxzQkFBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUM7Ozs7S0FDakI7SUFFRDs7T0FFRztJQUNVLG1EQUFzQixHQUFuQzs7Ozs7NEJBQ2dCLHFCQUFNLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBQTs7d0JBQWhDLEtBQUssR0FBRyxTQUF3Qjt3QkFDdEMsc0JBQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFDOzs7O0tBQ2pCO0lBS0Qsc0JBQVcsK0NBQWU7UUFIMUI7O1dBRUc7YUFDSDtZQUNFLE9BQU8sb0NBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNoRSxDQUFDOzs7T0FBQTtJQUtELHNCQUFXLGlEQUFpQjtRQUg1Qjs7V0FFRzthQUNIO1lBQ0UsT0FBTyxvQ0FBYSxDQUFDLHdCQUF3QixDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ2pFLENBQUM7OztPQUFBO0lBQ0gseUJBQUM7QUFBRCxDQUFDLEFBcERELElBb0RDO0FBcERZLGdEQUFrQiJ9