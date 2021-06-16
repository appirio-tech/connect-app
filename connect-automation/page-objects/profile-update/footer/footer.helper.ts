import { FooterPageObject } from './footer.po';

export class FooterHelper {
  /**
   * Initialize Footer Page Object
   */
  public static initialize() {
    this.footerPageObject = new FooterPageObject();
  }

  /**
   * Verify whether copyright year is displayed correctly.
   */
  public static async verifyCopyright() {
    const footerText = await this.footerPageObject.footerText.getText();
    const footerTextArray = footerText.split(' ');

    const displayedYear = footerTextArray.length > 2 ? footerTextArray[2] : '';
    const expectedYear = new Date().getFullYear().toString();

    expect(expectedYear).toEqual(displayedYear);
  }

  private static footerPageObject: FooterPageObject;
}
