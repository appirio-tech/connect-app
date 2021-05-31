import { ElementHelper } from 'topcoder-testing-lib';

export class FooterPageObject {
  /**
   * Get Footer Copyright Text
   */
  public get footerText() {
    return ElementHelper.getElementByClassName('copyright-notice');
  }
}
