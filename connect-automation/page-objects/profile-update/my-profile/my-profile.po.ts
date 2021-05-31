import { BrowserHelper, ElementHelper } from 'topcoder-testing-lib';
import { logger } from '../../../logger/logger';
import { TcElementImpl } from 'topcoder-testing-lib/dist/src/tc-element-impl';
import { CommonHelper } from '../../common-page/common.helper';
import { ConfigHelper } from '../../../utils/config-helper';

export class MyProfilePageObject {
  /**
   * Open the My Profile page
   */
  public static async open() {
    await BrowserHelper.open(ConfigHelper.getMyProfileUrl());
    logger.info('User navigated to My Profile Page');
  }

  /**
   * Get First Name field
   */
  public get firstNameField() {
    return ElementHelper.getElementByName('firstName');
  }

  /**
   * Get First Name value
   */
  public async getFirstNameValue() {
    return ElementHelper.getElementByName('firstName').getAttribute('value');
  }

  /**
   * Get Last Name field
   */
  public get lastNameField() {
    return ElementHelper.getElementByName('lastName');
  }

  /**
   * Get Last Name field value
   */
  public async getLastNameValue() {
    return ElementHelper.getElementByName('lastName').getAttribute('value');
  }

  /**
   * Get Title field
   */
  public get titleField() {
    return ElementHelper.getElementByName('title');
  }

  /**
   * Get Business Phone field
   */
  public get businessPhoneField() {
    return ElementHelper.getElementByName('businessPhone');
  }

  /**
   * Get Business Phone field
   */
  public async getBusinessPhoneValue() {
    return ElementHelper.getElementByName('businessPhone').getAttribute(
      'value'
    );
  }

  /**
   * Get Country Abbreviation from Business Phone dropdown
   */
  public async countryAbbreviation() {
    return ElementHelper.getElementByClassName(
      'dropdown-menu-header'
    ).getText();
  }

  /**
   * Get title field value
   */
  public async getTitleValue() {
    return ElementHelper.getElementByName('title').getAttribute('value');
  }

  /**
   * Get Company Url Field
   */
  public get companyUrlField() {
    return ElementHelper.getElementByName('companyURL');
  }

  /**
   * Get Company Url value
   */
  public async getCompanyUrlValue() {
    return ElementHelper.getElementByName('companyURL').getAttribute('value');
  }

  /**
   * Get Local TimeZone Field
   */
  public async localTimezoneField() {
    const xpath = `//span[text()='Local Timezone']/../following-sibling::div//div`;
    const parentEl = await ElementHelper.getAllElementsByXPath(xpath);
    return ElementHelper.getElementByCss(
      'div.react-select__control',
      parentEl[0]
    );
  }

  /**
   * Get Start Time Field
   */
  public async startTimeField() {
    const xpath = `//label[text()='Start Time']/following-sibling::div`;
    const parentEl = await ElementHelper.getAllElementsByXPath(xpath);
    return ElementHelper.getElementByCss(
      'div.react-select__control',
      parentEl[0]
    );
  }

  /**
   * Get End Time Field
   */
  public async endTimeField() {
    const xpath = `//label[text()='End Time']/following-sibling::div`;
    const parentEl = await ElementHelper.getAllElementsByXPath(xpath);
    return ElementHelper.getElementByCss(
      'div.react-select__control',
      parentEl[0]
    );
  }

  /**
   * Get Country Field
   */
  public async countryField() {
    const xpath = `//span[text()='Country']/../following-sibling::div//div`;
    const parentEl = await ElementHelper.getAllElementsByXPath(xpath);
    return ElementHelper.getElementByCss(
      'div.react-select__control',
      parentEl[0]
    );
  }

  /**
   * Get Submit Button
   */
  public get submitButton() {
    return ElementHelper.getElementByButtonText('Save settings');
  }

  /**
   * Get Success Alert Span
   */
  public get successAlert() {
    return CommonHelper.findElementByText(
      'span',
      'Settings successfully saved.'
    );
  }
  /**
   * Find Selected Text From Dropdown Menu
   * @param text string
   * @param parent (optional) parent element
   */
  public async selectTextFromDropDown(text: string, parent?: TcElementImpl) {
    const results = await CommonHelper.findTextFromDropDown(text, parent);
    if (results.length > 2) {
      return results[2];
    } else {
      return results[0];
    }
  }

  /**
   * Get Close Button
   */
  public get closeButton() {
    return ElementHelper.getElementByClassName('close');
  }

  /**
   * Get Business Phone Country Field Element
   */
  public get businessPhoneCountryField() {
    return ElementHelper.getElementByClassName('dropdown-wrap undefined');
  }

  /**
   * Get Business Phone Dropdown Element
   */
  public get businessPhoneDropdown() {
    return ElementHelper.getElementByClassName('dropdown-menu-list');
  }
}
