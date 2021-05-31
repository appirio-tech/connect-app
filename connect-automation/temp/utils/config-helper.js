"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigHelper = void 0;
var config = require("../config/config.json");
exports.ConfigHelper = {
    /**
     * Get current config
     */
    getConfig: function () {
        return config;
    },
    /**
     * Get login URL
     */
    getLoginUrl: function () {
        return this.getConfig().loginUrl;
    },
    /**
     * Get homepage URL
     */
    getHomePageUrl: function () {
        return this.getConfig().homePageUrl;
    },
    /**
     * Get Redirected login URL
     */
    getRedirectLoginUrl: function () {
        return this.getConfig().redirectLoginUrl;
    },
    /**
     * Get logout URL
     */
    getLogoutUrl: function () {
        return this.getConfig().logoutUrl;
    },
    /**
     * Get Username
     */
    getUserName: function () {
        return this.getConfig().username;
    },
    /**
     * Get Password
     */
    getPassword: function () {
        return this.getConfig().password;
    },
    /**
     * Get My Profile Page Url
     */
    getMyProfileUrl: function () {
        return this.getConfig().myProfileUrl;
    },
    /**
     * Get Notification Settings Page Url
     */
    getNotificationSettingsUrl: function () {
        return this.getConfig().notificationSettingsUrl;
    },
    /**
     * Get Account & Security Page Url
     */
    getAccountAndSecurityUrl: function () {
        return this.getConfig().accountAndSecurityUrl;
    },
    /**
     * Get Notification Settings Page Url
     */
    getNotificationUrl: function () {
        return this.getConfig().notificationsUrl;
    },
    /**
     * Get All Projects Page Url
     */
    getAllProjectsUrl: function () {
        return this.getConfig().allProjectsUrl;
    },
    /**
     * Gets email, password of customer user
     */
    getCustomerUser: function () {
        return this.getConfig().customerRole;
    },
    /**
     * Gets email, password of copilot user
     */
    getCopilotUser: function () {
        return this.getConfig().copilotRole;
    },
    /**
     * Gets email, password of copilot manager user
     */
    getCopilotManagerUser: function () {
        return this.getConfig().copilotManagerRole;
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLWhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3V0aWxzL2NvbmZpZy1oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOENBQWdEO0FBRW5DLFFBQUEsWUFBWSxHQUFHO0lBQzFCOztPQUVHO0lBQ0gsU0FBUztRQUNQLE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFRDs7T0FFRztJQUNILFdBQVc7UUFDVCxPQUFPLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUM7SUFDbkMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsY0FBYyxFQUFkO1FBQ0UsT0FBTyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsV0FBVyxDQUFDO0lBQ3RDLENBQUM7SUFFRDs7T0FFRztJQUNILG1CQUFtQjtRQUNqQixPQUFPLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztJQUMzQyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxZQUFZO1FBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsU0FBUyxDQUFDO0lBQ3BDLENBQUM7SUFFRDs7T0FFRztJQUNILFdBQVc7UUFDVCxPQUFPLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUM7SUFDbkMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsV0FBVztRQUNULE9BQU8sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQztJQUNuQyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxlQUFlO1FBQ2IsT0FBTyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsWUFBWSxDQUFDO0lBQ3ZDLENBQUM7SUFFRDs7T0FFRztJQUNILDBCQUEwQjtRQUN4QixPQUFPLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQztJQUNsRCxDQUFDO0lBRUQ7O09BRUc7SUFDSCx3QkFBd0I7UUFDdEIsT0FBTyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMscUJBQXFCLENBQUM7SUFDaEQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsa0JBQWtCO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLGdCQUFnQixDQUFDO0lBQzNDLENBQUM7SUFFRDs7T0FFRztJQUNILGlCQUFpQjtRQUNmLE9BQU8sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLGNBQWMsQ0FBQztJQUN6QyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxlQUFlO1FBQ2IsT0FBTyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsWUFBWSxDQUFDO0lBQ3ZDLENBQUM7SUFFRDs7T0FFRztJQUNILGNBQWM7UUFDWixPQUFPLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxXQUFXLENBQUM7SUFDdEMsQ0FBQztJQUVEOztPQUVHO0lBQ0gscUJBQXFCO1FBQ25CLE9BQU8sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLGtCQUFrQixDQUFDO0lBQzdDLENBQUM7Q0FDRixDQUFDIn0=