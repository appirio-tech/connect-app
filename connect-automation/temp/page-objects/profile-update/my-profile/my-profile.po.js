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
exports.MyProfilePageObject = void 0;
var topcoder_testing_lib_1 = require("topcoder-testing-lib");
var logger_1 = require("../../../logger/logger");
var common_helper_1 = require("../../common-page/common.helper");
var config_helper_1 = require("../../../utils/config-helper");
var MyProfilePageObject = /** @class */ (function () {
    function MyProfilePageObject() {
    }
    /**
     * Open the My Profile page
     */
    MyProfilePageObject.open = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.open(config_helper_1.ConfigHelper.getMyProfileUrl())];
                    case 1:
                        _a.sent();
                        logger_1.logger.info('User navigated to My Profile Page');
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(MyProfilePageObject.prototype, "firstNameField", {
        /**
         * Get First Name field
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByName('firstName');
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get First Name value
     */
    MyProfilePageObject.prototype.getFirstNameValue = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, topcoder_testing_lib_1.ElementHelper.getElementByName('firstName').getAttribute('value')];
            });
        });
    };
    Object.defineProperty(MyProfilePageObject.prototype, "lastNameField", {
        /**
         * Get Last Name field
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByName('lastName');
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get Last Name field value
     */
    MyProfilePageObject.prototype.getLastNameValue = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, topcoder_testing_lib_1.ElementHelper.getElementByName('lastName').getAttribute('value')];
            });
        });
    };
    Object.defineProperty(MyProfilePageObject.prototype, "titleField", {
        /**
         * Get Title field
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByName('title');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyProfilePageObject.prototype, "businessPhoneField", {
        /**
         * Get Business Phone field
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByName('businessPhone');
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get Business Phone field
     */
    MyProfilePageObject.prototype.getBusinessPhoneValue = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, topcoder_testing_lib_1.ElementHelper.getElementByName('businessPhone').getAttribute('value')];
            });
        });
    };
    /**
     * Get Country Abbreviation from Business Phone dropdown
     */
    MyProfilePageObject.prototype.countryAbbreviation = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, topcoder_testing_lib_1.ElementHelper.getElementByClassName('dropdown-menu-header').getText()];
            });
        });
    };
    /**
     * Get title field value
     */
    MyProfilePageObject.prototype.getTitleValue = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, topcoder_testing_lib_1.ElementHelper.getElementByName('title').getAttribute('value')];
            });
        });
    };
    Object.defineProperty(MyProfilePageObject.prototype, "companyUrlField", {
        /**
         * Get Company Url Field
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByName('companyURL');
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get Company Url value
     */
    MyProfilePageObject.prototype.getCompanyUrlValue = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, topcoder_testing_lib_1.ElementHelper.getElementByName('companyURL').getAttribute('value')];
            });
        });
    };
    /**
     * Get Local TimeZone Field
     */
    MyProfilePageObject.prototype.localTimezoneField = function () {
        return __awaiter(this, void 0, void 0, function () {
            var xpath, parentEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        xpath = "//span[text()='Local Timezone']/../following-sibling::div//div";
                        return [4 /*yield*/, topcoder_testing_lib_1.ElementHelper.getAllElementsByXPath(xpath)];
                    case 1:
                        parentEl = _a.sent();
                        return [2 /*return*/, topcoder_testing_lib_1.ElementHelper.getElementByCss('div.react-select__control', parentEl[0])];
                }
            });
        });
    };
    /**
     * Get Start Time Field
     */
    MyProfilePageObject.prototype.startTimeField = function () {
        return __awaiter(this, void 0, void 0, function () {
            var xpath, parentEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        xpath = "//label[text()='Start Time']/following-sibling::div";
                        return [4 /*yield*/, topcoder_testing_lib_1.ElementHelper.getAllElementsByXPath(xpath)];
                    case 1:
                        parentEl = _a.sent();
                        return [2 /*return*/, topcoder_testing_lib_1.ElementHelper.getElementByCss('div.react-select__control', parentEl[0])];
                }
            });
        });
    };
    /**
     * Get End Time Field
     */
    MyProfilePageObject.prototype.endTimeField = function () {
        return __awaiter(this, void 0, void 0, function () {
            var xpath, parentEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        xpath = "//label[text()='End Time']/following-sibling::div";
                        return [4 /*yield*/, topcoder_testing_lib_1.ElementHelper.getAllElementsByXPath(xpath)];
                    case 1:
                        parentEl = _a.sent();
                        return [2 /*return*/, topcoder_testing_lib_1.ElementHelper.getElementByCss('div.react-select__control', parentEl[0])];
                }
            });
        });
    };
    /**
     * Get Country Field
     */
    MyProfilePageObject.prototype.countryField = function () {
        return __awaiter(this, void 0, void 0, function () {
            var xpath, parentEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        xpath = "//span[text()='Country']/../following-sibling::div//div";
                        return [4 /*yield*/, topcoder_testing_lib_1.ElementHelper.getAllElementsByXPath(xpath)];
                    case 1:
                        parentEl = _a.sent();
                        return [2 /*return*/, topcoder_testing_lib_1.ElementHelper.getElementByCss('div.react-select__control', parentEl[0])];
                }
            });
        });
    };
    Object.defineProperty(MyProfilePageObject.prototype, "submitButton", {
        /**
         * Get Submit Button
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByButtonText('Save settings');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyProfilePageObject.prototype, "successAlert", {
        /**
         * Get Success Alert Span
         */
        get: function () {
            return common_helper_1.CommonHelper.findElementByText('span', 'Settings successfully saved.');
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Find Selected Text From Dropdown Menu
     * @param text string
     * @param parent (optional) parent element
     */
    MyProfilePageObject.prototype.selectTextFromDropDown = function (text, parent) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, common_helper_1.CommonHelper.findTextFromDropDown(text, parent)];
                    case 1:
                        results = _a.sent();
                        if (results.length > 2) {
                            return [2 /*return*/, results[2]];
                        }
                        else {
                            return [2 /*return*/, results[0]];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(MyProfilePageObject.prototype, "closeButton", {
        /**
         * Get Close Button
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByClassName('close');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyProfilePageObject.prototype, "businessPhoneCountryField", {
        /**
         * Get Business Phone Country Field Element
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByClassName('dropdown-wrap undefined');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MyProfilePageObject.prototype, "businessPhoneDropdown", {
        /**
         * Get Business Phone Dropdown Element
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByClassName('dropdown-menu-list');
        },
        enumerable: false,
        configurable: true
    });
    return MyProfilePageObject;
}());
exports.MyProfilePageObject = MyProfilePageObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXktcHJvZmlsZS5wby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3BhZ2Utb2JqZWN0cy9wcm9maWxlLXVwZGF0ZS9teS1wcm9maWxlL215LXByb2ZpbGUucG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkRBQW9FO0FBQ3BFLGlEQUFnRDtBQUVoRCxpRUFBK0Q7QUFDL0QsOERBQTREO0FBRTVEO0lBQUE7SUE0TEEsQ0FBQztJQTNMQzs7T0FFRztJQUNpQix3QkFBSSxHQUF4Qjs7Ozs0QkFDRSxxQkFBTSxvQ0FBYSxDQUFDLElBQUksQ0FBQyw0QkFBWSxDQUFDLGVBQWUsRUFBRSxDQUFDLEVBQUE7O3dCQUF4RCxTQUF3RCxDQUFDO3dCQUN6RCxlQUFNLENBQUMsSUFBSSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7Ozs7O0tBQ2xEO0lBS0Qsc0JBQVcsK0NBQWM7UUFIekI7O1dBRUc7YUFDSDtZQUNFLE9BQU8sb0NBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNyRCxDQUFDOzs7T0FBQTtJQUVEOztPQUVHO0lBQ1UsK0NBQWlCLEdBQTlCOzs7Z0JBQ0Usc0JBQU8sb0NBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLEVBQUM7OztLQUMxRTtJQUtELHNCQUFXLDhDQUFhO1FBSHhCOztXQUVHO2FBQ0g7WUFDRSxPQUFPLG9DQUFhLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDcEQsQ0FBQzs7O09BQUE7SUFFRDs7T0FFRztJQUNVLDhDQUFnQixHQUE3Qjs7O2dCQUNFLHNCQUFPLG9DQUFhLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFDOzs7S0FDekU7SUFLRCxzQkFBVywyQ0FBVTtRQUhyQjs7V0FFRzth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