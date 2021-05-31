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
exports.CreateNewPhaseHelper = void 0;
var moment = require("moment");
var topcoder_testing_lib_1 = require("topcoder-testing-lib");
var logger_1 = require("../../../logger/logger");
var common_helper_1 = require("../../common-page/common.helper");
var create_new_phase_po_1 = require("./create-new-phase.po");
var CreateNewPhaseHelper = /** @class */ (function () {
    function CreateNewPhaseHelper() {
    }
    /**
     * Initialize Create New Phase page object
     */
    CreateNewPhaseHelper.initialize = function () {
        this.createNewPhasePageObject = new create_new_phase_po_1.CreateNewPhasePageObject();
    };
    /**
     * Verify whether user can create a phase and publish it.
     * @param formData phase creation form data defined in test data
     */
    CreateNewPhaseHelper.verifyCreateNewPhase = function (formData) {
        return __awaiter(this, void 0, void 0, function () {
            var alertElement, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.clickOnAddNewPhaseButton()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.fillCreatePhaseForm(formData.title, formData.daysBetweenStartAndEndDate)];
                    case 2:
                        _b.sent();
                        // Fill report form
                        return [4 /*yield*/, this.fillMilestoneForm(0, formData.reportName)];
                    case 3:
                        // Fill report form
                        _b.sent();
                        return [4 /*yield*/, this.createNewPhasePageObject.addMilestoneButton.click()];
                    case 4:
                        _b.sent();
                        // Fill deliverable review form
                        return [4 /*yield*/, this.fillMilestoneForm(1, formData.deliverableReviewName, 'Deliverable Review')];
                    case 5:
                        // Fill deliverable review form
                        _b.sent();
                        return [4 /*yield*/, this.createNewPhasePageObject.addMilestoneButton.click()];
                    case 6:
                        _b.sent();
                        // Fill final deliverable review form
                        return [4 /*yield*/, this.fillMilestoneForm(2, formData.finalDeliverableReviewName, 'Final Deliverable Review')];
                    case 7:
                        // Fill final deliverable review form
                        _b.sent();
                        return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.sleep(3000)];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, this.createNewPhasePageObject.publishButton.click()];
                    case 9:
                        _b.sent();
                        alertElement = common_helper_1.CommonHelper.alertBox();
                        return [4 /*yield*/, common_helper_1.CommonHelper.waitForSuccessAlert(alertElement)];
                    case 10:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, common_helper_1.CommonHelper.successAlert().getText()];
                    case 11:
                        _a.apply(void 0, [_b.sent()]).toBe("PROJECT PHASE CREATED.");
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Click Add New Phase button, verify phase creation screen appearance
     */
    CreateNewPhaseHelper.clickOnAddNewPhaseButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            var newPhaseFormElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.waitUntilClickableOf(this.createNewPhasePageObject.addNewPhaseButton)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.createNewPhasePageObject.addNewPhaseButton.click()];
                    case 2:
                        _a.sent();
                        newPhaseFormElement = this.createNewPhasePageObject.phaseCreationForm;
                        return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.waitUntilPresenceOf(newPhaseFormElement)];
                    case 3:
                        _a.sent();
                        expect(newPhaseFormElement).toBeDefined();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Put the phase name, start date and end date to phase creation form
     * @param title form phase name
     * @param daysBetweenStartAndEndDate number of days between start and end date. default to 3 days.
     */
    CreateNewPhaseHelper.fillCreatePhaseForm = function (title, daysBetweenStartAndEndDate) {
        if (daysBetweenStartAndEndDate === void 0) { daysBetweenStartAndEndDate = 3; }
        return __awaiter(this, void 0, void 0, function () {
            var titleWithDate, startDate, endDate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        titleWithDate = common_helper_1.CommonHelper.appendDate(title);
                        return [4 /*yield*/, this.createNewPhasePageObject.titleInput.sendKeys(titleWithDate)];
                    case 1:
                        _a.sent();
                        logger_1.logger.info("Filled title field with: " + titleWithDate);
                        startDate = moment().format(common_helper_1.CommonHelper.dateFormat());
                        return [4 /*yield*/, this.createNewPhasePageObject.startDateInput().sendKeys(startDate)];
                    case 2:
                        _a.sent();
                        logger_1.logger.info("Filled start date field with: " + startDate.slice(2));
                        endDate = moment().add(daysBetweenStartAndEndDate, 'days').format(common_helper_1.CommonHelper.dateFormat());
                        return [4 /*yield*/, this.createNewPhasePageObject.endDateInput().sendKeys(endDate)];
                    case 3:
                        _a.sent();
                        logger_1.logger.info("Filled end date field with: " + endDate.slice(2));
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create and Fill milestone form
     * @param appendix numeric indicator of added milestone form
     * @param name name field
     * @param type type field
     */
    CreateNewPhaseHelper.fillMilestoneForm = function (appendix, name, type) {
        return __awaiter(this, void 0, void 0, function () {
            var types, nameInput, startDate, endDate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.sleep(3000)];
                    case 1:
                        _a.sent();
                        if (!type) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.createNewPhasePageObject.allTypeInput()];
                    case 2:
                        types = _a.sent();
                        return [4 /*yield*/, types[appendix].click()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.sleep(500)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.createNewPhasePageObject.getOptionFromTypeDropdown(type).click()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        nameInput = this.createNewPhasePageObject.nameInput(appendix.toString());
                        return [4 /*yield*/, nameInput.clear()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, nameInput.sendKeys(name)];
                    case 8:
                        _a.sent();
                        logger_1.logger.info("Filled name field with: " + name);
                        startDate = moment().format(common_helper_1.CommonHelper.dateFormat());
                        return [4 /*yield*/, this.createNewPhasePageObject.startDateInput(appendix.toString()).sendKeys(startDate)];
                    case 9:
                        _a.sent();
                        logger_1.logger.info("Filled start date field with: " + startDate.slice(2));
                        endDate = moment().add(1, 'days').format(common_helper_1.CommonHelper.dateFormat());
                        return [4 /*yield*/, this.createNewPhasePageObject.endDateInput(appendix.toString()).sendKeys(endDate)];
                    case 10:
                        _a.sent();
                        logger_1.logger.info("Filled end date field with: " + endDate.slice(2));
                        return [2 /*return*/];
                }
            });
        });
    };
    return CreateNewPhaseHelper;
}());
exports.CreateNewPhaseHelper = CreateNewPhaseHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLW5ldy1waGFzZS5oZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wYWdlLW9iamVjdHMvcGhhc2UtY3JlYXRpb24tZmxvdy9jcmVhdGUtbmV3LXBoYXNlL2NyZWF0ZS1uZXctcGhhc2UuaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLCtCQUFpQztBQUVqQyw2REFBcUQ7QUFDckQsaURBQWdEO0FBQ2hELGlFQUErRDtBQUUvRCw2REFBaUU7QUFFakU7SUFBQTtJQW9HQSxDQUFDO0lBbkdDOztPQUVHO0lBQ1csK0JBQVUsR0FBeEI7UUFDRSxJQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSw4Q0FBd0IsRUFBRSxDQUFDO0lBQ2pFLENBQUM7SUFFRDs7O09BR0c7SUFDaUIseUNBQW9CLEdBQXhDLFVBQXlDLFFBQTRCOzs7Ozs0QkFDbkUscUJBQU0sSUFBSSxDQUFDLHdCQUF3QixFQUFFLEVBQUE7O3dCQUFyQyxTQUFxQyxDQUFDO3dCQUN0QyxxQkFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsMEJBQTBCLENBQUMsRUFBQTs7d0JBQW5GLFNBQW1GLENBQUM7d0JBQ3BGLG1CQUFtQjt3QkFDbkIscUJBQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUE7O3dCQURwRCxtQkFBbUI7d0JBQ25CLFNBQW9ELENBQUM7d0JBQ3JELHFCQUFNLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsRUFBQTs7d0JBQTlELFNBQThELENBQUM7d0JBQy9ELCtCQUErQjt3QkFDL0IscUJBQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMscUJBQXFCLEVBQUUsb0JBQW9CLENB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