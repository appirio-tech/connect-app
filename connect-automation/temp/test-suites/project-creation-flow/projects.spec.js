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
var topcoder_testing_lib_1 = require("topcoder-testing-lib");
var common_helper_1 = require("../../page-objects/common-page/common.helper");
var projects_helper_1 = require("../../page-objects/project-creation-flow/projects/projects.helper");
var testData = require("../../test-data/test-data.json");
var config_helper_1 = require("../../utils/config-helper");
describe('Connect App - Copilot Role Project Related Tests:', function () {
    /**
     * Sets up the browser
     */
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        var copilotUser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    copilotUser = config_helper_1.ConfigHelper.getCopilotUser();
                    return [4 /*yield*/, common_helper_1.CommonHelper.login(copilotUser.email, copilotUser.password)];
                case 1:
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
                    projects_helper_1.ProjectsHelper.initialize();
                    // Step Sequence #1: Go to the given app URL
                    return [4 /*yield*/, projects_helper_1.ProjectsHelper.open()];
                case 1:
                    // Step Sequence #1: Go to the given app URL
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[TC_003] should verify whether the Copilot can Join the project', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, projects_helper_1.ProjectsHelper.verifyCopilotProjectJoin()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[TC_004] should verify user can search for projects using project name, user handle, ref code', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, copilotManagerUser;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, projects_helper_1.ProjectsHelper.verifyProjectSearch(testData.searchProject)];
                case 1:
                    _b.sent();
                    // Logout from current user.
                    return [4 /*yield*/, common_helper_1.CommonHelper.logout()];
                case 2:
                    // Logout from current user.
                    _b.sent();
                    return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.sleep(5000)];
                case 3:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, topcoder_testing_lib_1.BrowserHelper.getCurrentUrl()];
                case 4:
                    _a.apply(void 0, [_b.sent()]).toBe(config_helper_1.ConfigHelper.getHomePageUrl());
                    copilotManagerUser = config_helper_1.ConfigHelper.getCopilotUser();
                    return [4 /*yield*/, common_helper_1.CommonHelper.login(copilotManagerUser.email, copilotManagerUser.password)];
                case 5:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[TC_005] should verify user can switch between the Project tabs', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, projects_helper_1.ProjectsHelper.verifySwitchTabs()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdHMuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3Qtc3VpdGVzL3Byb2plY3QtY3JlYXRpb24tZmxvdy9wcm9qZWN0cy5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkRBQXFEO0FBQ3JELDhFQUE0RTtBQUM1RSxxR0FBbUc7QUFDbkcseURBQTJEO0FBQzNELDJEQUF5RDtBQUV6RCxRQUFRLENBQUMsbURBQW1ELEVBQUU7SUFDNUQ7O09BRUc7SUFDSCxTQUFTLENBQUM7Ozs7O29CQUVGLFdBQVcsR0FBRyw0QkFBWSxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUNsRCxxQkFBTSw0QkFBWSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxRQUFRLENBQUMsRUFBQTs7b0JBQWpFLFNBQWlFLENBQUM7Ozs7U0FDbkUsQ0FBQyxDQUFDO0lBRUg7O09BRUc7SUFDSCxRQUFRLENBQUM7Ozt3QkFDUCxxQkFBTSw0QkFBWSxDQUFDLE1BQU0sRUFBRSxFQUFBOztvQkFBM0IsU0FBMkIsQ0FBQzs7OztTQUM3QixDQUFDLENBQUM7SUFFSCxVQUFVLENBQUM7Ozs7b0JBQ1QsZ0NBQWMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztvQkFFNUIsNENBQTRDO29CQUM1QyxxQkFBTSxnQ0FBYyxDQUFDLElBQUksRUFBRSxFQUFBOztvQkFEM0IsNENBQTRDO29CQUM1QyxTQUEyQixDQUFDOzs7O1NBQzdCLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxpRUFBaUUsRUFBRTs7O3dCQUNwRSxxQkFBTSxnQ0FBYyxDQUFDLHdCQUF3QixFQUFFLEVBQUE7O29CQUEvQyxTQUErQyxDQUFDOzs7O1NBQ2pELENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQywrRkFBK0YsRUFBRTs7Ozt3QkFDbEcscUJBQU0sZ0NBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEVBQUE7O29CQUFoRSxTQUFnRSxDQUFDO29CQUVqRSw0QkFBNEI7b0JBQzVCLHFCQUFNLDRCQUFZLENBQUMsTUFBTSxFQUFFLEVBQUE7O29CQUQzQiw0QkFBNEI7b0JBQzVCLFNBQTJCLENBQUM7b0JBQzVCLHFCQUFNLG9DQUFhLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFBOztvQkFBL0IsU0FBK0IsQ0FBQztvQkFDaEMsS0FBQSxNQUFNLENBQUE7b0JBQUMscUJBQU0sb0NBQWEsQ0FBQyxhQUFhLEVBQUUsRUFBQTs7b0JBQTFDLGtCQUFPLFNBQW1DLEVBQUMsQ0FBQyxJQUFJLENBQzlDLDRCQUFZLENBQUMsY0FBYyxFQUFFLENBQzlCLENBQUM7b0JBRUksa0JBQWtCLEdBQUcsNEJBQVksQ0FBQyxjQUFjLEVBQUUsQ0FBQztvQkFDekQscUJBQU0sNEJBQVksQ0FBQyxLQUFLLENBQ3RCLGtCQUFrQixDQUFDLEtBQUssRUFDeEIsa0JBQWtCLENBQUMsUUFBUSxDQUM1QixFQUFBOztvQkFIRCxTQUdDLENBQUM7Ozs7U0FDSCxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsaUVBQWlFLEVBQUU7Ozt3QkFDcEUscUJBQU0sZ0NBQWMsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFBOztvQkFBdkMsU0FBdUMsQ0FBQzs7OztTQUN6QyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9