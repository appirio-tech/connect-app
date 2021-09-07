import { BrowserHelper, ElementHelper } from 'topcoder-testing-lib';
import * as appconfig from '../../../config/app-config.json';
import { logger } from '../../../logger/logger';
import { ConfigHelper } from '../../../utils/config-helper';
import { CommonHelper } from '../../common-page/common.helper';
import { IUserProfile } from './my-profile.model';
import { MyProfilePageObject } from './my-profile.po';

export class MyProfilePageHelper {
  /**
   * Initialize My Profile page object
   */
  public static initialize() {
    this.myProfilePageObject = new MyProfilePageObject();
  }

  /**
   * Opens the My Profile page
   */
  public static async open() {
    await MyProfilePageObject.open();
    await CommonHelper.waitForPageDisplayed();
    await BrowserHelper.waitUntilClickableOf(
      this.myProfilePageObject.firstNameField,
      appconfig.Timeout.ElementClickable,
      appconfig.LoggerErrors.ElementClickable
    );
  }

  /**
   * Update First Name Field
   * @param firstName first name
   */
  public static async updateFirstName(firstName: string) {
    await CommonHelper.fillInputField(
      this.myProfilePageObject.firstNameField,
      firstName
    );
    logger.info(`Updated Last Name Field: ${firstName}`);
  }

  /**
   * Update Last Name Field
   * @param lastName last name
   */
  public static async updateLastName(lastName: string) {
    await CommonHelper.fillInputField(
      this.myProfilePageObject.lastNameField,
      lastName
    );
    logger.info(`Updated Last Name Field: ${lastName}`);
  }

  /**
   * Update Title Field
   * @param title title
   */
  public static async updateTitle(title: string) {
    await CommonHelper.fillInputField(
      this.myProfilePageObject.titleField,
      title
    );
    logger.info(`Updated Title Field: ${title}`);
  }

  /**
   * Update Company Url Field
   * @param companyUrl company url
   */
  public static async updateCompanyUrl(companyUrl: string) {
    await CommonHelper.fillInputField(
      this.myProfilePageObject.companyUrlField,
      companyUrl
    );
    logger.info(`Updated Company Url Field: ${companyUrl}`);
  }

  /**
   * Update Local Time Zone Field
   * @param localTimezone local timezone
   */
  public static async updateLocalTimezone(localTimezone: string) {
    const el = await this.myProfilePageObject.localTimezoneField();
    await el.click();
    const selectOption = await this.myProfilePageObject.selectTextFromDropDown(
      localTimezone
    );
    logger.info(`Updated Local Time Field: ${localTimezone}`);
    await selectOption.click();
  }

  /**
   * Update Start Time Field
   * @param startTime start time
   */
  public static async updateStartTime(startTime: string) {
    const el = await this.myProfilePageObject.startTimeField();
    await el.click();
    const selectOption = await this.myProfilePageObject.selectTextFromDropDown(
      startTime
    );
    logger.info(`Updated Start Time Field: ${startTime}`);
    await selectOption.click();
  }

  /**
   * Update End Time Field
   * @param endTime end time
   */
  public static async updateEndTime(endTime: string) {
    const el = await this.myProfilePageObject.endTimeField();
    await el.click();
    const selectOption = await this.myProfilePageObject.selectTextFromDropDown(
      endTime
    );
    logger.info(`Updated End Time Field: ${endTime}`);
    await selectOption.click();
  }

  /**
   * Update Country Field
   * @param country country name
   */
  public static async updateCountryDropdown(country: string) {
    const el = await this.myProfilePageObject.countryField();
    await el.click();
    const selectOption = await this.myProfilePageObject.selectTextFromDropDown(
      country
    );
    logger.info(`Updated Country Field: ${country}`);
    await selectOption.click();
  }

  /**
   * Fill Profile Information on User Settings Page.
   */
  public static async updateProfileInformation(userProfile: IUserProfile) {
    await this.updateFirstName(userProfile.firstName);
    await this.updateLastName(userProfile.lastName);
    await this.updateTitle(userProfile.title);
    await this.updateCompanyUrl(userProfile.companyUrl);
    await this.updateLocalTimezone(userProfile.localTimezone);
    await this.updateStartTime(userProfile.startTime);
    await this.updateEndTime(userProfile.endTime);

    // Click on Save Settings button.
    await this.myProfilePageObject.submitButton.click();

    // Wait until Success Alert Message Appears
    await CommonHelper.getAlertMessageAndClosePopup();
  }

  /**
   * Select Country From Business Phone Field.
   * @param businessPhoneCountry business phone country
   */
  public static async changeBusinessPhoneCountry(businessPhoneCountry: string) {
    const countryField = this.myProfilePageObject.businessPhoneCountryField;
    await countryField.click();
    const dropDownParent = this.myProfilePageObject.businessPhoneDropdown;
    const selectOptions = await ElementHelper.getAllElementsByLinkText(
      businessPhoneCountry,
      dropDownParent
    );
    await selectOptions[0].click();
  }

  /**
   * Verifies whether the current user can update the basic information.
   * @param userProfile Test data for User Profile
   */
  public static async verifyProfileInformation(userProfile: IUserProfile) {
    // My Profile page update button becomes active only when data is changed.
    // To be able to edit in every test case we are adding timestamp to firstname field.
    userProfile = {
      ...userProfile,
      firstName: CommonHelper.appendDate(userProfile.firstName),
    };

    await this.updateProfileInformation(userProfile);

    // Go To User Profile Page Again
    await this.open();

    await BrowserHelper.waitUntilClickableOf(
      this.myProfilePageObject.myProfileSettingsForm,
      appconfig.Timeout.ElementClickable,
      appconfig.LoggerErrors.ElementClickable
    );

    const firstName = await this.myProfilePageObject.getFirstNameValue();
    const lastName = await this.myProfilePageObject.getLastNameValue();
    const title = await this.myProfilePageObject.getTitleValue();
    const companyUrl = await this.myProfilePageObject.getCompanyUrlValue();

    expect(firstName).toEqual(userProfile.firstName);
    expect(lastName).toEqual(userProfile.lastName);
    expect(title).toEqual(userProfile.title);
    expect(companyUrl).toEqual(userProfile.companyUrl);
  }

  /**
   * Verifies whether the business phone/country sync accordingly.
   * @param userProfile Test data for User Profile
   */
  public static async verifyBusinessPhoneSync(userProfile: IUserProfile) {
    const {
      country,
      countryCode,
      businessPhoneCountry,
      businessPhoneCountryCode,
      countryAbbr,
    } = userProfile;

    await this.changeBusinessPhoneCountry(businessPhoneCountry);
    let businessNumber = await this.myProfilePageObject.getBusinessPhoneValue();
    let currentCountryCode = businessNumber.substr(
      0,
      businessPhoneCountryCode.length
    );

    expect(currentCountryCode).toEqual(businessPhoneCountryCode);
    expect(
      await (await this.myProfilePageObject.countryField()).getText()
    ).toEqual(businessPhoneCountry);

    await this.updateCountryDropdown(country);
    businessNumber = await this.myProfilePageObject.getBusinessPhoneValue();
    currentCountryCode = businessNumber.substr(0, countryCode.length);
    const countryAbbreviation = await this.myProfilePageObject.countryAbbreviation();

    expect(countryAbbreviation).toEqual(countryAbbr);
    expect(currentCountryCode).toEqual(countryCode);
  }

  /**
   * Verifies whether the user can close the profile window.
   */
  public static async verifyUserCloseProfileWindow() {
    const closeButton = this.myProfilePageObject.closeButton;
    await closeButton.click();

    const currentUrl = await BrowserHelper.getCurrentUrl();
    const expectedUrl = ConfigHelper.getAllProjectsUrl();

    expect(currentUrl).toContain(expectedUrl);
  }

  private static myProfilePageObject: MyProfilePageObject;
}
