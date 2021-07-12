import { ElementHelper } from 'topcoder-testing-lib';
export class CreateNewPhasePageObject {
  /**
   * Get Add New Phase Button
   */
  public get addNewPhaseButton() {
    return ElementHelper.getElementByButtonText('Add New Phase');
  }

  /**
   * Get Project Creation Form
   */
  public get phaseCreationForm() {
    return ElementHelper.getElementByClassName('_1jLI3q');
  }

  /**
   * Get title input
   */
  public get titleInput() {
    return ElementHelper.getElementByName('title');
  }

  /**
   * Get name input
   * @param appendix numeric indicator of added milestone form
   */
  public nameInput(appendix?: string) {
    return ElementHelper.getElementByName(`name_${appendix}`);
  }
  
  /**
   * Get start date input
   * @param appendix numeric indicator of added milestone form
   */
  public startDateInput(appendix?: string) {
    const inputName = appendix ? `startDate_${appendix}` : 'startDate';
    return ElementHelper.getElementByName(inputName);
  }
  
  /**
   * Get end date input
   * @param appendix numeric indicator of added milestone form
   */
  public endDateInput(appendix?: string) {
    const inputName = appendix ? `endDate_${appendix}` : 'endDate';
    return ElementHelper.getElementByName(inputName);
  }

  /**
   * Get Type Input
   */
  public async allTypeInput() {
    return ElementHelper.getAllElementsByClassName('react-select-container');
  }

  /**
   * Select option from type field dropdown
   * @param option desired option
   */
  public getOptionFromTypeDropdown(option: string) {
    return ElementHelper.getElementByCssContainingText('.react-select__option', option);
  }

  /**
   * Get Add Milestone Button
   */
  public get addMilestoneButton() {
    return ElementHelper.getElementByButtonText('Add Milestone');
  }

  /**
   * Get Publish Button
   */
  public get publishButton() {
    return ElementHelper.getElementByButtonText('Publish');
  }
}
