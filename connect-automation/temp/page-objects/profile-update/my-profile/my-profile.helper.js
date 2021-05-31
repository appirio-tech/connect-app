"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.MyProfilePageHelper = void 0;
var topcoder_testing_lib_1 = require("topcoder-testing-lib");
var logger_1 = require("../../../logger/logger");
var common_helper_1 = require("../../common-page/common.helper");
var config_helper_1 = require("../../../utils/config-helper");
var my_profile_po_1 = require("./my-profile.po");
var MyProfilePageHelper = /** @class */ (function () {
    function MyProfilePageHelper() {
    }
    /**
     * Initialize My Profile page object
     */
    MyProfilePageHelper.initialize = function () {
        this.myProfilePageObject = new my_profile_po_1.MyProfilePageObject();
    };
    /**
     * Opens the My Profile page
     */
    MyProfilePageHelper.open = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, my_profile_po_1.MyProfilePageObject.open()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, common_helper_1.CommonHelper.waitForPageDisplayed()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.sleep(5000)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update First Name Field
     * @param firstName first name
     */
    MyProfilePageHelper.updateFirstName = function (firstName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, common_helper_1.CommonHelper.fillInputField(this.myProfilePageObject.firstNameField, firstName)];
                    case 1:
                        _a.sent();
                        logger_1.logger.info("Updated Last Name Field: " + firstName);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update Last Name Field
     * @param lastName last name
     */
    MyProfilePageHelper.updateLastName = function (lastName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, common_helper_1.CommonHelper.fillInputField(this.myProfilePageObject.lastNameField, lastName)];
                    case 1:
                        _a.sent();
                        logger_1.logger.info("Updated Last Name Field: " + lastName);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update Title Field
     * @param title title
     */
    MyProfilePageHelper.updateTitle = function (title) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, common_helper_1.CommonHelper.fillInputField(this.myProfilePageObject.titleField, title)];
                    case 1:
                        _a.sent();
                        logger_1.logger.info("Updated Title Field: " + title);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update Company Url Field
     * @param companyUrl company url
     */
    MyProfilePageHelper.updateCompanyUrl = function (companyUrl) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, common_helper_1.CommonHelper.fillInputField(this.myProfilePageObject.companyUrlField, companyUrl)];
                    case 1:
                        _a.sent();
                        logger_1.logger.info("Updated Company Url Field: " + companyUrl);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update Local Time Zone Field
     * @param localTimezone local timezone
     */
    MyProfilePageHelper.updateLocalTimezone = function (localTimezone) {
        return __awaiter(this, void 0, void 0, function () {
            var el, selectOption;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.myProfilePageObject.localTimezoneField()];
                    case 1:
                        el = _a.sent();
                        return [4 /*yield*/, el.click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.myProfilePageObject.selectTextFromDropDown(localTimezone)];
                    case 3:
                        selectOption = _a.sent();
                        logger_1.logger.info("Updated Local Time Field: " + localTimezone);
                        return [4 /*yield*/, selectOption.click()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update Start Time Field
     * @param startTime start time
     */
    MyProfilePageHelper.updateStartTime = function (startTime) {
        return __awaiter(this, void 0, void 0, function () {
            var el, selectOption;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.myProfilePageObject.startTimeField()];
                    case 1:
                        el = _a.sent();
                        return [4 /*yield*/, el.click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.myProfilePageObject.selectTextFromDropDown(startTime)];
                    case 3:
                        selectOption = _a.sent();
                        logger_1.logger.info("Updated Start Time Field: " + startTime);
                        return [4 /*yield*/, selectOption.click()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update End Time Field
     * @param endTime end time
     */
    MyProfilePageHelper.updateEndTime = function (endTime) {
        return __awaiter(this, void 0, void 0, function () {
            var el, selectOption;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.myProfilePageObject.endTimeField()];
                    case 1:
                        el = _a.sent();
                        return [4 /*yield*/, el.click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.myProfilePageObject.selectTextFromDropDown(endTime)];
                    case 3:
                        selectOption = _a.sent();
                        logger_1.logger.info("Updated End Time Field: " + endTime);
                        return [4 /*yield*/, selectOption.click()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update Country Field
     * @param country country name
     */
    MyProfilePageHelper.updateCountryDropdown = function (country) {
        return __awaiter(this, void 0, void 0, function () {
            var el, selectOption;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.myProfilePageObject.countryField()];
                    case 1:
                        el = _a.sent();
                        return [4 /*yield*/, el.click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.sleep(200)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.myProfilePageObject.selectTextFromDropDown(country)];
                    case 4:
                        selectOption = _a.sent();
                        return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.sleep(200)];
                    case 5:
                        _a.sent();
                        logger_1.logger.info("Updated Country Field: " + country);
                        return [4 /*yield*/, selectOption.click()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Fill Profile Information on User Settings Page.
     */
    MyProfilePageHelper.updateProfileInformation = function (userProfile) {
        return __awaiter(this, void 0, void 0, function () {
            var alertElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateFirstName(userProfile.firstName)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.updateLastName(userProfile.lastName)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.updateTitle(userProfile.title)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.updateCompanyUrl(userProfile.companyUrl)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.updateLocalTimezone(userProfile.localTimezone)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.updateStartTime(userProfile.startTime)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.updateEndTime(userProfile.endTime)];
                    case 7:
                        _a.sent();
                        // Click on Save Settings button.
                        return [4 /*yield*/, this.myProfilePageObject.submitButton.click()];
                    case 8:
                        // Click on Save Settings button.
                        _a.sent();
                        alertElement = this.myProfilePageObject.successAlert;
                        return [4 /*yield*/, common_helper_1.CommonHelper.waitForSuccessAlert(alertElement)];
                    case 9:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Select Country From Business Phone Field.
     * @param businessPhoneCountry business phone country
     */
    MyProfilePageHelper.changeBusinessPhoneCountry = function (businessPhoneCountry) {
        return __awaiter(this, void 0, void 0, function () {
            var countryField, dropDownParent, selectOptions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        countryField = this.myProfilePageObject.businessPhoneCountryField;
                        return [4 /*yield*/, countryField.click()];
                    case 1:
                        _a.sent();
                        dropDownParent = this.myProfilePageObject.businessPhoneDropdown;
                        return [4 /*yield*/, topcoder_testing_lib_1.ElementHelper.getAllElementsByLinkText(businessPhoneCountry, dropDownParent)];
                    case 2:
                        selectOptions = _a.sent();
                        return [4 /*yield*/, selectOptions[0].click()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Verifies whether the current user can update the basic information.
     * @param userProfile Test data for User Profile
     */
    MyProfilePageHelper.verifyProfileInformation = function (userProfile) {
        return __awaiter(this, void 0, void 0, function () {
            var firstName, lastName, title, companyUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // My Profile page update button becomes active only when data is changed.
                        // To be able to edit in every test case we are adding timestamp to firstname field.
                        userProfile = __assign(__assign({}, userProfile), { firstName: common_helper_1.CommonHelper.appendDate(userProfile.firstName) });
                        return [4 /*yield*/, this.updateProfileInformation(userProfile)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.sleep(1000)];
                    case 2:
                        _a.sent();
                        // Go To User Profile Page Again
                        return [4 /*yield*/, this.open()];
                    case 3:
                        // Go To User Profile Page Again
                        _a.sent();
                        return [4 /*yield*/, this.myProfilePageObject.getFirstNameValue()];
                    case 4:
                        firstName = _a.sent();
                        return [4 /*yield*/, this.myProfilePageObject.getLastNameValue()];
                    case 5:
                        lastName = _a.sent();
                        return [4 /*yield*/, this.myProfilePageObject.getTitleValue()];
                    case 6:
                        title = _a.sent();
                        return [4 /*yield*/, this.myProfilePageObject.getCompanyUrlValue()];
                    case 7:
                        companyUrl = _a.sent();
                        expect(firstName).toEqual(userProfile.firstName);
                        expect(lastName).toEqual(userProfile.lastName);
                        expect(title).toEqual(userProfile.title);
                        expect(companyUrl).toEqual(userProfile.companyUrl);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Verifies whether the business phone/country sync accordingly.
     * @param userProfile Test data for User Profile
     */
    MyProfilePageHelper.verifyBusinessPhoneSync = function (userProfile) {
        return __awaiter(this, void 0, void 0, function () {
            var country, countryCode, businessPhoneCountry, businessPhoneCountryCode, countryAbbr, businessNumber, currentCountryCode, _a, countryAbbreviation;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        country = userProfile.country, countryCode = userProfile.countryCode, businessPhoneCountry = userProfile.businessPhoneCountry, businessPhoneCountryCode = userProfile.businessPhoneCountryCode, countryAbbr = userProfile.countryAbbr;
                        return [4 /*yield*/, this.changeBusinessPhoneCountry(businessPhoneCountry)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.myProfilePageObject.getBusinessPhoneValue()];
                    case 2:
                        businessNumber = _b.sent();
                        currentCountryCode = businessNumber.substr(0, businessPhoneCountryCode.length);
                        expect(currentCountryCode).toEqual(businessPhoneCountryCode);
                        _a = expect;
                        return [4 /*yield*/, this.myProfilePageObject.countryField()];
                    case 3: return [4 /*yield*/, (_b.sent()).getText()];
                    case 4:
                        _a.apply(void 0, [_b.sent()]).toEqual(businessPhoneCountry);
                        return [4 /*yield*/, this.updateCountryDropdown(country)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, this.myProfilePageObject.getBusinessPhoneValue()];
                    case 6:
                        businessNumber = _b.sent();
                        currentCountryCode = businessNumber.substr(0, countryCode.length);
                        return [4 /*yield*/, this.myProfilePageObject.countryAbbreviation()];
                    case 7:
                        countryAbbreviation = _b.sent();
                        expect(countryAbbreviation).toEqual(countryAbbr);
                        expect(currentCountryCode).toEqual(countryCode);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Verifies whether the user can close the profile window.
     */
    MyProfilePageHelper.verifyUserCloseProfileWindow = function () {
        return __awaiter(this, void 0, void 0, function () {
            var closeButton, currentUrl, expectedUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        closeButton = this.myProfilePageObject.closeButton;
                        return [4 /*yield*/, closeButton.click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.getCurrentUrl()];
                    case 2:
                        currentUrl = _a.sent();
                        expectedUrl = config_helper_1.ConfigHelper.getAllProjectsUrl();
                        expect(currentUrl).toContain(expectedUrl);
                        return [2 /*return*/];
                }
            });
        });
    };
    return MyProfilePageHelper;
}());
exports.MyProfilePageHelper = MyProfilePageHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXktcHJvZmlsZS5oZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wYWdlLW9iamVjdHMvcHJvZmlsZS11cGRhdGUvbXktcHJvZmlsZS9teS1wcm9maWxlLmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZEQUFvRTtBQUNwRSxpREFBZ0Q7QUFDaEQsaUVBQStEO0FBQy9ELDhEQUE0RDtBQUU1RCxpREFBc0Q7QUFFdEQ7SUFBQTtJQTJPQSxDQUFDO0lBMU9DOztPQUVHO0lBQ1csOEJBQVUsR0FBeEI7UUFDRSxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxtQ0FBbUIsRUFBRSxDQUFDO0lBQ3ZELENBQUM7SUFFRDs7T0FFRztJQUNpQix3QkFBSSxHQUF4Qjs7Ozs0QkFDRSxxQkFBTSxtQ0FBbUIsQ0FBQyxJQUFJLEVBQUUsRUFBQTs7d0JBQWhDLFNBQWdDLENBQUM7d0JBQ2pDLHFCQUFNLDRCQUFZLENBQUMsb0JBQW9CLEVBQUUsRUFBQTs7d0JBQXpDLFNBQXlDLENBQUM7d0JBQzFDLHFCQUFNLG9DQUFhLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFBOzt3QkFBL0IsU0FBK0IsQ0FBQzs7Ozs7S0FDakM7SUFFRDs7O09BR0c7SUFDaUIsbUNBQWUsR0FBbkMsVUFBb0MsU0FBaUI7Ozs7NEJBQ25ELHFCQUFNLDRCQUFZLENBQUMsY0FBYyxDQUMvQixJQUFJLENBQUMsbUJBQW1CLENBQUMsY0FBYyxFQUN2QyxTQUFTLENBQ1YsRUFBQTs7d0JBSEQsU0FHQyxDQUFDO3dCQUNGLGVBQU0sQ0FBQyxJQUFJLENBQUMsOEJBQTRCLFNBQVcsQ0FBQyxDQUFDOzs7OztLQUN0RDtJQUVEOzs7T0FHRztJQUNpQixrQ0FBYyxHQUFsQyxVQUFtQyxRQUFnQjs7Ozs0QkFDakQscUJBQU0sNEJBQVksQ0FBQyxjQUFjLENBQy9CLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLEVBQ3RDLFFBQVEsQ0FDVCxFQUFBOzt3QkFIRCxTQUdDLENBQUM7d0JBQ0YsZUFBTSxDQUFDLElBQUksQ0FBQyw4QkFBNEIsUUFBVSxDQUFDLENBQUM7Ozs7O0tBQ3JEO0lBRUQ7OztPQUdHO0lBQ2lCLCtCQUFXLEdBQS9CLFVBQWdDLEtBQWE7Ozs7NEJBQzNDLHFCQUFNLDRCQUFZLENBQUMsY0FBYyxDQUMvQixJQUFJLENBQUMsbUJBQW1CLENBQUMsVUFBVSxFQUNuQyxLQUFLLENBQ04sRUFBQTs7d0JBSEQsU0FHQyxDQUFDO3dCQUNGLGVBQU0sQ0FBQyxJQUFJLENBQUMsMEJBQXdCLEtBQU8sQ0FBQyxDQUFDOzs7OztLQUM5QztJQUVEOzs7T0FHRztJQUNpQixvQ0FBZ0IsR0FBcEMsVUFBcUMsVUFBa0I7Ozs7NEJBQ3JELHFCQUFNLDRCQUFZLENBQUMsY0FBYyxDQUMvQixJQUFJLENBQUMsbUJBQW1CLENBQUMsZUFBZSxFQUN4QyxVQUFVLENBQ1gsRUFBQTs7d0JBSEQsU0FHQyxDQUFDO3dCQUNGLGVBQU0sQ0FBQyxJQUFJLENBQUMsZ0NBQThCLFVBQVksQ0FBQyxDQUFDOzs7OztLQUN6RDtJQUVEOzs7T0FHRztJQUNpQix1Q0FBbUIsR0FBdkMsVUFBd0MsYUFBcUI7Ozs7OzRCQUNoRCxxQkFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsa0JBQWtCLEVBQUUsRUFBQTs7d0JBQXhELEVBQUUsR0FBRyxTQUFtRDt3QkFDOUQscUJBQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFBOzt3QkFBaEIsU0FBZ0IsQ0FBQzt3QkFDSSxxQkFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsc0JBQXNCLENBQ3hFLGFBQWEsQ0FDZCxFQUFBOzt3QkFGSyxZQUFZLEdBQUcsU0FFcEI7d0JBQ0QsZUFBTSxDQUFDLElBQUksQ0FBQywrQkFBNkIsYUFBZSxDQUFDLENBQUM7d0JBQzFELHFCQUFNLFlBQVksQ0FBQyxLQUFLLEVBQUUsRUFBQTs7d0JBQTFCLFNBQTBCLENBQUM7Ozs7O0tBQzVCO0lBRUQ7OztPQUdHO0lBQ2lCLG1DQUFlLEdBQW5DLFVBQW9DLFNBQWlCOzs7Ozs0QkFDeEMscUJBQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLGNBQWMsRUFBRSxFQUFBOzt3QkFBcEQsRUFBRSxHQUFHLFNBQStDO3dCQUMxRCxxQkFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUE7O3dCQUFoQixTQUFnQixDQUFDO3dCQUNJLHFCQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxzQkFBc0IsQ0FDeEUsU0FBUyxDQUNWLEVBQUE7O3dCQUZLLFlBQVksR0FBRyxTQUVwQjt3QkFDRCxlQUFNLENBQUMsSUFBSSxDQUFDLCtCQUE2QixTQUFXLENBQUMsQ0FBQzt3QkFDdEQscUJBQU0sWUFBWSxDQUFDLEtBQUssRUFBRSxFQUFBOzt3QkFBMUIsU0FBMEIsQ0FBQzs7Ozs7S0FDNUI7SUFFRDs7O09BR0c7SUFDaUIsaUNBQWEsR0FBakMsVUFBa0MsT0FBZTs7Ozs7NEJBQ3BDLHFCQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLEVBQUUsRUFBQTs7d0JBQWxELEVBQUUsR0FBRyxTQUE2Qzt3QkFDeEQscUJBQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFBOzt3QkFBaEIsU0FBZ0IsQ0FBQzt3QkFDSSxxQkFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsc0JBQXNCLENBQ3hFLE9BQU8sQ0FDUixFQUFBOzt3QkFGSyxZQUFZLEdBQUcsU0FFcEI7d0JBQ0QsZUFBTSxDQUFDLElBQUksQ0FBQyw2QkFBMkIsT0FBUyxDQUFDLENBQUM7d0JBQ2xELHFCQUFNLFlBQVksQ0FBQyxLQUFLLEVBQUUsRUFBQTs7d0JBQTFCLFNBQTBCLENBQUM7Ozs7O0tBQzVCO0lBRUQ7OztPQUdHO0lBQ2lCLHlDQUFxQixHQUF6QyxVQUEwQyxPQUFlOzs7Ozs0QkFDNUMscUJBQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLFlBQVksRUFBRSxFQUFBOzt3QkFBbEQsRUFBRSxHQUFHLFNBQTZDO3dCQUN4RCxxQkFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUE7O3dCQUFoQixTQUFnQixDQUFDO3dCQUNqQixxQkFBTSxvQ0FBYSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBQTs7d0JBQTlCLFNBQThCLENBQUM7d0JBQ1YscUJBQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLHNCQUFzQixDQUN4RSxPQUFPLENBQ1IsRUFBQTs7d0JBRkssWUFBWSxHQUFHLFNBRXBCO3dCQUNELHFCQUFNLG9DQUFhLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFBOzt3QkFBOUIsU0FBOEIsQ0FBQzt3QkFDL0IsZUFBTSxDQUFDLElBQUksQ0FBQyw0QkFBMEIsT0FBUyxDQUFDLENBQUM7d0JBQ2pELHFCQUFNLFlBQVksQ0FBQyxLQUFLLEVBQUUsRUFBQTs7d0JBQTFCLFNBQTBCLENBQUM7Ozs7O0tBQzVCO0lBRUQ7O09BRUc7SUFDaUIsNENBQXdCLEdBQTVDLFVBQTZDLFdBQXlCOzs7Ozs0QkFDcEUscUJBQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEVBQUE7O3dCQUFqRCxTQUFpRCxDQUFDO3dCQUNsRCxxQkFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsRUFBQTs7d0JBQS9DLFNBQStDLENBQUM7d0JBQ2hELHFCQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFBOzt3QkFBekMsU0FBeUMsQ0FBQzt3QkFDMUMscUJBQU0sSUFBSSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsRUFBQTs7d0JBQW5ELFNBQW1ELENBQUM7d0JBQ3BELHFCQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLEVBQUE7O3dCQUF6RCxTQUF5RCxDQUFDO3dCQUMxRCxxQkFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsRUFBQTs7d0JBQWpELFNBQWlELENBQUM7d0JBQ2xELHFCQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFBOzt3QkFBN0MsU0FBNkMsQ0FBQzt3QkFFOUMsaUNBQWlDO3dCQUNqQyxxQkFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxFQUFBOzt3QkFEbkQsaUNBQWlDO3dCQUNqQyxTQUFtRCxDQUFDO3dCQUc5QyxZQUFZLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFlBQVksQ0FBQzt3QkFDM0QscUJBQU0sNEJBQVksQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLENBQUMsRUFBQTs7d0JBQXBELFNBQW9ELENBQUM7Ozs7O0tBQ3REO0lBRUQ7OztPQUdHO0lBQ2lCLDhDQUEwQixHQUE5QyxVQUErQyxvQkFBNEI7Ozs7Ozt3QkFDbkUsWUFBWSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyx5QkFBeUIsQ0FBQzt3QkFDeEUscUJBQU0sWUFBWSxDQUFDLEtBQUssRUFBRSxFQUFBOzt3QkFBMUIsU0FBMEIsQ0FBQzt3QkFDckIsY0FBYyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxxQkFBcUIsQ0FBQzt3QkFDaEQscUJBQU0sb0NBQWEsQ0FBQyx3QkFBd0IsQ0FDaEUsb0JBQW9CLEVBQ3BCLGNBQWMsQ0FDZixFQUFBOzt3QkFISyxhQUFhLEdBQUcsU0FHckI7d0JBQ0QscUJBQU0sYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFBOzt3QkFBOUIsU0FBOEIsQ0FBQzs7Ozs7S0FDaEM7SUFFRDs7O09BR0c7SUFDaUIsNENBQXdCLEdBQTVDLFVBQTZDLFdBQXlCOzs7Ozs7d0JBQ3BFLDBFQUEwRTt3QkFDMUUsb0ZBQW9GO3dCQUNwRixXQUFXLHlCQUNOLFdBQVcsS0FDZCxTQUFTLEVBQUUsNEJBQVksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxHQUMxRCxDQUFDO3dCQUVGLHFCQUFNLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxXQUFXLENBQUMsRUFBQTs7d0JBQWhELFNBQWdELENBQUM7d0JBRWpELHFCQUFNLG9DQUFhLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFBOzt3QkFBL0IsU0FBK0IsQ0FBQzt3QkFDaEMsZ0NBQWdDO3dCQUNoQyxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7O3dCQURqQixnQ0FBZ0M7d0JBQ2hDLFNBQWlCLENBQUM7d0JBRUEscUJBQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLGlCQUFpQixFQUFFLEVBQUE7O3dCQUE5RCxTQUFTLEdBQUcsU0FBa0Q7d0JBQ25ELHFCQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFBOzt3QkFBNUQsUUFBUSxHQUFHLFNBQWlEO3dCQUNwRCxxQkFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsYUFBYSxFQUFFLEVBQUE7O3dCQUF0RCxLQUFLLEdBQUcsU0FBOEM7d0JBQ3pDLHFCQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxrQkFBa0IsRUFBRSxFQUFBOzt3QkFBaEUsVUFBVSxHQUFHLFNBQW1EO3dCQUV0RSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQzt3QkFDakQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQy9DLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUN6QyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQzs7Ozs7S0FDcEQ7SUFFRDs7O09BR0c7SUFDaUIsMkNBQXVCLEdBQTNDLFVBQTRDLFdBQXlCOzs7Ozs7d0JBRWpFLE9BQU8sR0FLTCxXQUFXLFFBTE4sRUFDUCxXQUFXLEdBSVQsV0FBVyxZQUpGLEVBQ1gsb0JBQW9CLEdBR2xCLFdBQVcscUJBSE8sRUFDcEIsd0JBQXdCLEdBRXRCLFdBQVcseUJBRlcsRUFDeEIsV0FBVyxHQUNULFdBQVcsWUFERixDQUNHO3dCQUVoQixxQkFBTSxJQUFJLENBQUMsMEJBQTBCLENBQUMsb0JBQW9CLENBQUMsRUFBQTs7d0JBQTNELFNBQTJELENBQUM7d0JBQ3ZDLHFCQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxxQkFBcUIsRUFBRSxFQUFBOzt3QkFBdkUsY0FBYyxHQUFHLFNBQXNEO3dCQUN2RSxrQkFBa0IsR0FBRyxjQUFjLENBQUMsTUFBTSxDQUM1QyxDQUFDLEVBQ0Qsd0JBQXdCLENBQUMsTUFBTSxDQUNoQyxDQUFDO3dCQUVGLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO3dCQUM3RCxLQUFBLE1BQU0sQ0FBQTt3QkFDRyxxQkFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsWUFBWSxFQUFFLEVBQUE7NEJBQXBELHFCQUFNLENBQUMsU0FBNkMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFBOzt3QkFEakUsa0JBQ0UsU0FBK0QsRUFDaEUsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQzt3QkFFaEMscUJBQU0sSUFBSSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxFQUFBOzt3QkFBekMsU0FBeUMsQ0FBQzt3QkFDekIscUJBQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLHFCQUFxQixFQUFFLEVBQUE7O3dCQUF2RSxjQUFjLEdBQUcsU0FBc0QsQ0FBQzt3QkFDeEUsa0JBQWtCLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUN0QyxxQkFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsbUJBQW1CLEVBQUUsRUFBQTs7d0JBQTFFLG1CQUFtQixHQUFHLFNBQW9EO3dCQUVoRixNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7d0JBQ2pELE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQzs7Ozs7S0FDakQ7SUFFRDs7T0FFRztJQUNpQixnREFBNEIsR0FBaEQ7Ozs7Ozt3QkFDUSxXQUFXLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FBQzt3QkFDekQscUJBQU0sV0FBVyxDQUFDLEtBQUssRUFBRSxFQUFBOzt3QkFBekIsU0FBeUIsQ0FBQzt3QkFFUCxxQkFBTSxvQ0FBYSxDQUFDLGFBQWEsRUFBRSxFQUFBOzt3QkFBaEQsVUFBVSxHQUFHLFNBQW1DO3dCQUNoRCxXQUFXLEdBQUcsNEJBQVksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO3dCQUVyRCxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDOzs7OztLQUMzQztJQUdILDBCQUFDO0FBQUQsQ0FBQyxBQTNPRCxJQTJPQztBQTNPWSxrREFBbUIifQ==