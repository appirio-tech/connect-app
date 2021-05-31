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
var create_project_helper_1 = require("../../page-objects/project-creation-flow/create-project/create-project.helper");
var testData = require("../../test-data/test-data.json");
var config_helper_1 = require("../../utils/config-helper");
describe('Connect App - Create Project Tests:', function () {
    /**
     * Sets up the browser
     */
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        var customerUser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    customerUser = config_helper_1.ConfigHelper.getCustomerUser();
                    return [4 /*yield*/, common_helper_1.CommonHelper.login(customerUser.email, customerUser.password)];
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
                    create_project_helper_1.CreateProjectPageHelper.initialize();
                    // Step Sequence #1: Go to the given app URL
                    return [4 /*yield*/, create_project_helper_1.CreateProjectPageHelper.open()];
                case 1:
                    // Step Sequence #1: Go to the given app URL
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[TC_001] should verify whether the current user can create a Design, Development & Deployment project', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, create_project_helper_1.CreateProjectPageHelper.verifyProjectCreation(testData.projectData)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLXByb2plY3Quc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3Qtc3VpdGVzL3Byb2plY3QtY3JlYXRpb24tZmxvdy9jcmVhdGUtcHJvamVjdC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOEVBQTRFO0FBQzVFLHVIQUF3SDtBQUN4SCx5REFBMkQ7QUFDM0QsMkRBQXlEO0FBRXpELFFBQVEsQ0FBQyxxQ0FBcUMsRUFBRTtJQUM5Qzs7T0FFRztJQUNILFNBQVMsQ0FBQzs7Ozs7b0JBRUYsWUFBWSxHQUFHLDRCQUFZLENBQUMsZUFBZSxFQUFFLENBQUM7b0JBQ3BELHFCQUFNLDRCQUFZLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLFFBQVEsQ0FBQyxFQUFBOztvQkFBbkUsU0FBbUUsQ0FBQzs7OztTQUNyRSxDQUFDLENBQUM7SUFFSDs7T0FFRztJQUNILFFBQVEsQ0FBQzs7O3dCQUNQLHFCQUFNLDRCQUFZLENBQUMsTUFBTSxFQUFFLEVBQUE7O29CQUEzQixTQUEyQixDQUFDOzs7O1NBQzdCLENBQUMsQ0FBQztJQUVILFVBQVUsQ0FBQzs7OztvQkFDVCwrQ0FBdUIsQ0FBQyxVQUFVLEVBQUUsQ0FBQztvQkFDckMsNENBQTRDO29CQUM1QyxxQkFBTSwrQ0FBdUIsQ0FBQyxJQUFJLEVBQUUsRUFBQTs7b0JBRHBDLDRDQUE0QztvQkFDNUMsU0FBb0MsQ0FBQzs7OztTQUN0QyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsdUdBQXVHLEVBQUU7Ozt3QkFDMUcscUJBQU0sK0NBQXVCLENBQUMscUJBQXFCLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFBOztvQkFBekUsU0FBeUUsQ0FBQzs7OztTQUMzRSxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9