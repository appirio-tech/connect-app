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
var common_helper_1 = require("../../page-objects/common-page/common.helper");
var testData = require("../../test-data/test-data.json");
var config_helper_1 = require("../../utils/config-helper");
var my_profile_helper_1 = require("../../page-objects/profile-update/my-profile/my-profile.helper");
describe('Connect App - My Profile Page Tests:', function () {
    /**
     * Sets up the browser
     */
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Precondition: User should be logged in.
                return [4 /*yield*/, common_helper_1.CommonHelper.login(config_helper_1.ConfigHelper.getUserName(), config_helper_1.ConfigHelper.getPassword())];
                case 1:
                    // Precondition: User should be logged in.
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    /**
     * Logs out
     */
    afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, common_helper_1.CommonHelper.logout()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    my_profile_helper_1.MyProfilePageHelper.initialize();
                    return [4 /*yield*/, my_profile_helper_1.MyProfilePageHelper.open()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[TC_001] should verify whether the current user can update the basic information.', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, my_profile_helper_1.MyProfilePageHelper.verifyProfileInformation(testData.userProfile)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[TC_002] should verify whether the Business Phone/Country sync accordingly.', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, my_profile_helper_1.MyProfilePageHelper.verifyBusinessPhoneSync(testData.userProfile)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[TC_003] should verify whether the user can close the profile window.', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, my_profile_helper_1.MyProfilePageHelper.verifyUserCloseProfileWindow()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXktcHJvZmlsZS5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vdGVzdC1zdWl0ZXMvcHJvZmlsZS11cGRhdGUvbXktcHJvZmlsZS5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOEVBQTRFO0FBQzVFLHlEQUEyRDtBQUMzRCwyREFBeUQ7QUFDekQsb0dBQXFHO0FBRXJHLFFBQVEsQ0FBQyxzQ0FBc0MsRUFBRTtJQUMvQzs7T0FFRztJQUNILFNBQVMsQ0FBQzs7OztnQkFDUiwwQ0FBMEM7Z0JBQzFDLHFCQUFNLDRCQUFZLENBQUMsS0FBSyxDQUN0Qiw0QkFBWSxDQUFDLFdBQVcsRUFBRSxFQUMxQiw0QkFBWSxDQUFDLFdBQVcsRUFBRSxDQUMzQixFQUFBOztvQkFKRCwwQ0FBMEM7b0JBQzFDLFNBR0MsQ0FBQzs7OztTQUNILENBQUMsQ0FBQztJQUVIOztPQUVHO0lBQ0gsUUFBUSxDQUFDOzs7d0JBQ1AscUJBQU0sNEJBQVksQ0FBQyxNQUFNLEVBQUUsRUFBQTs7b0JBQTNCLFNBQTJCLENBQUM7Ozs7U0FDN0IsQ0FBQyxDQUFDO0lBRUgsVUFBVSxDQUFDOzs7O29CQUNULHVDQUFtQixDQUFDLFVBQVUsRUFBRSxDQUFDO29CQUNqQyxxQkFBTSx1Q0FBbUIsQ0FBQyxJQUFJLEVBQUUsRUFBQTs7b0JBQWhDLFNBQWdDLENBQUM7Ozs7U0FDbEMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLG1GQUFtRixFQUFFOzs7d0JBQ3RGLHFCQUFNLHVDQUFtQixDQUFDLHdCQUF3QixDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBQTs7b0JBQXhFLFNBQXdFLENBQUM7Ozs7U0FDMUUsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDZFQUE2RSxFQUFFOzs7d0JBQ2hGLHFCQUFNLHVDQUFtQixDQUFDLHVCQUF1QixDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBQTs7b0JBQXZFLFNBQXVFLENBQUM7Ozs7U0FDekUsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHVFQUF1RSxFQUFFOzs7d0JBQzFFLHFCQUFNLHVDQUFtQixDQUFDLDRCQUE0QixFQUFFLEVBQUE7O29CQUF4RCxTQUF3RCxDQUFDOzs7O1NBQzFELENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=