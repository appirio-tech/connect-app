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
var footer_helper_1 = require("../../page-objects/profile-update/footer/footer.helper");
var config_helper_1 = require("../../utils/config-helper");
describe('Connect App - Footer Menu Tests:', function () {
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
            // Initialize Footer Menu Helper
            footer_helper_1.FooterHelper.initialize();
            return [2 /*return*/];
        });
    }); });
    it('[TC_006] should verify copyright year is displaying correctly.', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, footer_helper_1.FooterHelper.verifyCopyright()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9vdGVyLW1lbnUuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3Qtc3VpdGVzL3Byb2ZpbGUtdXBkYXRlL2Zvb3Rlci1tZW51LnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4RUFBNEU7QUFDNUUsd0ZBQXNGO0FBQ3RGLDJEQUF5RDtBQUV6RCxRQUFRLENBQUMsa0NBQWtDLEVBQUU7SUFDM0M7O09BRUc7SUFDSCxTQUFTLENBQUM7Ozs7Z0JBQ1IsMENBQTBDO2dCQUMxQyxxQkFBTSw0QkFBWSxDQUFDLEtBQUssQ0FDdEIsNEJBQVksQ0FBQyxXQUFXLEVBQUUsRUFDMUIsNEJBQVksQ0FBQyxXQUFXLEVBQUUsQ0FDM0IsRUFBQTs7b0JBSkQsMENBQTBDO29CQUMxQyxTQUdDLENBQUM7Ozs7U0FDSCxDQUFDLENBQUM7SUFFSDs7T0FFRztJQUNILFFBQVEsQ0FBQzs7O3dCQUNQLHFCQUFNLDRCQUFZLENBQUMsTUFBTSxFQUFFLEVBQUE7O29CQUEzQixTQUEyQixDQUFDOzs7O1NBQzdCLENBQUMsQ0FBQztJQUVILFVBQVUsQ0FBQzs7WUFDVCxnQ0FBZ0M7WUFDaEMsNEJBQVksQ0FBQyxVQUFVLEVBQUUsQ0FBQzs7O1NBQzNCLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxnRUFBZ0UsRUFBRTs7O3dCQUNuRSxxQkFBTSw0QkFBWSxDQUFDLGVBQWUsRUFBRSxFQUFBOztvQkFBcEMsU0FBb0MsQ0FBQzs7OztTQUN0QyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9