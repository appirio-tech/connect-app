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
exports.CreateNewPhasePageObject = void 0;
var topcoder_testing_lib_1 = require("topcoder-testing-lib");
var CreateNewPhasePageObject = /** @class */ (function () {
    function CreateNewPhasePageObject() {
    }
    Object.defineProperty(CreateNewPhasePageObject.prototype, "addNewPhaseButton", {
        /**
         * Get Add New Phase Button
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByButtonText('Add New Phase');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CreateNewPhasePageObject.prototype, "phaseCreationForm", {
        /**
         * Get Project Creation Form
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByClassName('_1jLI3q');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CreateNewPhasePageObject.prototype, "titleInput", {
        /**
         * Get title input
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByName('title');
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get name input
     * @param appendix numeric indicator of added milestone form
     */
    CreateNewPhasePageObject.prototype.nameInput = function (appendix) {
        return topcoder_testing_lib_1.ElementHelper.getElementByName("name_" + appendix);
    };
    /**
     * Get start date input
     * @param appendix numeric indicator of added milestone form
     */
    CreateNewPhasePageObject.prototype.startDateInput = function (appendix) {
        var inputName = appendix ? "startDate_" + appendix : 'startDate';
        return topcoder_testing_lib_1.ElementHelper.getElementByName(inputName);
    };
    /**
     * Get end date input
     * @param appendix numeric indicator of added milestone form
     */
    CreateNewPhasePageObject.prototype.endDateInput = function (appendix) {
        var inputName = appendix ? "endDate_" + appendix : 'endDate';
        return topcoder_testing_lib_1.ElementHelper.getElementByName(inputName);
    };
    /**
     * Get Type Input
     */
    CreateNewPhasePageObject.prototype.allTypeInput = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, topcoder_testing_lib_1.ElementHelper.getAllElementsByClassName('react-select-container')];
            });
        });
    };
    /**
     * Select option from type field dropdown
     * @param option desired option
     */
    CreateNewPhasePageObject.prototype.getOptionFromTypeDropdown = function (option) {
        return topcoder_testing_lib_1.ElementHelper.getElementByCssContainingText('.react-select__option', option);
    };
    Object.defineProperty(CreateNewPhasePageObject.prototype, "addMilestoneButton", {
        /**
         * Get Add Milestone Button
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByButtonText('Add Milestone');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CreateNewPhasePageObject.prototype, "publishButton", {
        /**
         * Get Publish Button
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByButtonText('Publish');
        },
        enumerable: false,
        configurable: true
    });
    return CreateNewPhasePageObject;
}());
exports.CreateNewPhasePageObject = CreateNewPhasePageObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLW5ldy1waGFzZS5wby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3BhZ2Utb2JqZWN0cy9waGFzZS1jcmVhdGlvbi1mbG93L2NyZWF0ZS1uZXctcGhhc2UvY3JlYXRlLW5ldy1waGFzZS5wby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2REFBcUQ7QUFDckQ7SUFBQTtJQTRFQSxDQUFDO0lBeEVDLHNCQUFXLHVEQUFpQjtRQUg1Qjs7V0FFRzthQUNIO1lBQ0UsT0FBTyxvQ0FBYSxDQUFDLHNCQUFzQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQy9ELENBQUM7OztPQUFBO0lBS0Qsc0JBQVcsdURBQWlCO1FBSDVCOztXQUVHO2FBQ0g7WUFDRSxPQUFPLG9DQUFhLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEQsQ0FBQzs7O09BQUE7SUFLRCxzQkFBVyxnREFBVTtRQUhyQjs7V0FFRzthQUNIO1lBQ0UsT0FBTyxvQ0FBYSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2pELENBQUM7OztPQUFBO0lBRUQ7OztPQUdHO0lBQ0ksNENBQVMsR0FBaEIsVUFBaUIsUUFBaUI7UUFDaEMsT0FBTyxvQ0FBYSxDQUFDLGdCQUFnQixDQUFDLFVBQVEsUUFBVSxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUVEOzs7T0FHRztJQUNJLGlEQUFjLEdBQXJCLFVBQXNCLFFBQWlCO1FBQ3JDLElBQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsZUFBYSxRQUFVLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQztRQUNuRSxPQUFPLG9DQUFhLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVEOzs7T0FHRztJQUNJLCtDQUFZLEdBQW5CLFVBQW9CLFFBQWlCO1FBQ25DLElBQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsYUFBVyxRQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUMvRCxPQUFPLG9DQUFhLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVEOztPQUVHO0lBQ1UsK0NBQVksR0FBekI7OztnQkFDRSxzQkFBTyxvQ0FBYSxDQUFDLHlCQUF5QixDQUFDLHdCQUF3QixDQUFDLEVBQUM7OztLQUMxRTtJQUVEOzs7T0FHRztJQUNJLDREQUF5QixHQUFoQyxVQUFpQyxNQUFjO1FBQzdDLE9BQU8sb0NBQWEsQ0FBQyw2QkFBNkIsQ0FBQyx1QkFBdUIsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN0RixDQUFDO0lBS0Qsc0JBQVcsd0RBQWtCO1FBSDdCOztXQUVHO2FBQ0g7WUFDRSxPQUFPLG9DQUFhLENBQUMsc0JBQXNCLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDL0QsQ0FBQzs7O09BQUE7SUFLRCxzQkFBVyxtREFBYTtRQUh4Qjs7V0FFRzthQUNIO1lBQ0UsT0FBTyxvQ0FBYSxDQUFDLHNCQUFzQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3pELENBQUM7OztPQUFBO0lBQ0gsK0JBQUM7QUFBRCxDQUFDLEFBNUVELElBNEVDO0FBNUVZLDREQUF3QiJ9