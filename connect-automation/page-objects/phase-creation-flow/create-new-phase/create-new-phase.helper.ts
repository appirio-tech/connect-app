import * as moment from 'moment';
import { BrowserStack } from 'protractor/built/driverProviders';
import { BrowserHelper } from 'topcoder-testing-lib';
import { logger } from '../../../logger/logger';
import { CommonHelper } from '../../common-page/common.helper';
import { IPhaseCreationData } from './create-new-phase.model';
import { CreateNewPhasePageObject } from './create-new-phase.po';

export class CreateNewPhaseHelper {
  /**
   * Initialize Create New Phase page object
   */
  public static initialize() {
    this.createNewPhasePageObject = new CreateNewPhasePageObject();
  }

  /**
   * Verify whether user can create a phase and publish it.
   * @param formData phase creation form data defined in test data
   */
  public static async verifyCreateNewPhase(formData: IPhaseCreationData) {
    await this.clickOnAddNewPhaseButton();
    await this.fillCreatePhaseForm(formData.title, formData.daysBetweenStartAndEndDate);

    await BrowserHelper.sleep(3000);
    await this.createNewPhasePageObject.publishButton.click();

    const alertElement = CommonHelper.alertBox();
    await CommonHelper.waitForSuccessAlert(alertElement);
    expect(await CommonHelper.successAlert().getText()).toBe(
      `PROJECT PHASE CREATED.`
    );
  }

  private static createNewPhasePageObject: CreateNewPhasePageObject;

  /**
   * Click Add New Phase button, verify phase creation screen appearance
   */
  private static async clickOnAddNewPhaseButton() {
    await BrowserHelper.waitUntilClickableOf(this.createNewPhasePageObject.addNewPhaseButton);
    await this.createNewPhasePageObject.addNewPhaseButton.click();
    // Phase creation form should appear
    const newPhaseFormElement = this.createNewPhasePageObject.phaseCreationForm;
    await BrowserHelper.waitUntilPresenceOf(newPhaseFormElement);
    expect(newPhaseFormElement).toBeDefined();
  }

  /**
   * Put the phase name, start date and end date to phase creation form
   * @param title form phase name
   * @param daysBetweenStartAndEndDate number of days between start and end date. default to 3 days.
   */
  private static async fillCreatePhaseForm(title: string, daysBetweenStartAndEndDate = 3) {
    // Fill title field
    const titleWithDate = CommonHelper.appendDate(title);
    await this.createNewPhasePageObject.titleInput.sendKeys(titleWithDate);
    logger.info(`Filled title field with: ${titleWithDate}`);

    // Fill start date field
    const startDate = moment().format(CommonHelper.dateFormat());
    await this.createNewPhasePageObject.startDateInput().sendKeys(startDate);
    logger.info(`Filled start date field with: ${startDate.slice(2)}`);
    
    // Fill end date field
    const endDate = moment().add(daysBetweenStartAndEndDate, 'days').format(CommonHelper.dateFormat());
    await this.createNewPhasePageObject.endDateInput().sendKeys(endDate);
    logger.info(`Filled end date field with: ${endDate.slice(2)}`);
  }
}
