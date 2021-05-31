"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfilePageObject = void 0;
var topcoder_testing_lib_1 = require("topcoder-testing-lib");
var UserProfilePageObject = /** @class */ (function () {
    function UserProfilePageObject() {
    }
    Object.defineProperty(UserProfilePageObject.prototype, "menuDropdown", {
        /**
         * Get Menu Dropdown Element
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByClassName('menu-wrap');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UserProfilePageObject.prototype, "myProfileLink", {
        /**
         * Get My Profile Link
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByLinkText('My profile');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UserProfilePageObject.prototype, "notificationSettingsLink", {
        /**
         * Get Notification Settings Link
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByLinkText('Notification settings');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UserProfilePageObject.prototype, "accountSecurityLink", {
        /**
         * Get Account & Security Link
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByLinkText('Account & security');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UserProfilePageObject.prototype, "logoutLink", {
        /**
         * Get Logout Link
         */
        get: function () {
            return topcoder_testing_lib_1.ElementHelper.getElementByLinkText('Log out');
        },
        enumerable: false,
        configurable: true
    });
    return UserProfilePageObject;
}());
exports.UserProfilePageObject = UserProfilePageObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1wcm9maWxlLW1lbnUucG8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wYWdlLW9iamVjdHMvcHJvZmlsZS11cGRhdGUvdXNlci1wcm9maWxlLW1lbnUvdXNlci1wcm9maWxlLW1lbnUucG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkRBQXFEO0FBRXJEO0lBQUE7SUFtQ0EsQ0FBQztJQS9CQyxzQkFBVywrQ0FBWTtRQUh2Qjs7V0FFRzthQUNIO1lBQ0UsT0FBTyxvQ0FBYSxDQUFDLHFCQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzFELENBQUM7OztPQUFBO0lBS0Qsc0JBQVcsZ0RBQWE7UUFIeEI7O1dBRUc7YUFDSDtZQUNFLE9BQU8sb0NBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMxRCxDQUFDOzs7T0FBQTtJQUtELHNCQUFXLDJEQUF3QjtRQUhuQzs7V0FFRzthQUNIO1lBQ0UsT0FBTyxvQ0FBYSxDQUFDLG9CQUFvQixDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDckUsQ0FBQzs7O09BQUE7SUFLRCxzQkFBVyxzREFBbUI7UUFIOUI7O1dBRUc7YUFDSDtZQUNFLE9BQU8sb0NBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQ2xFLENBQUM7OztPQUFBO0lBS0Qsc0JBQVcsNkNBQVU7UUFIckI7O1dBRUc7YUFDSDtZQUNFLE9BQU8sb0NBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN2RCxDQUFDOzs7T0FBQTtJQUNILDRCQUFDO0FBQUQsQ0FBQyxBQW5DRCxJQW1DQztBQW5DWSxzREFBcUIifQ==