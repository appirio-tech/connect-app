import { BrowserHelper, ElementHelper } from 'topcoder-testing-lib';
import * as config from '../../config/app-config.json';
import { logger } from '../../logger/logger';
import { CommonHelper } from '../common-page/common.helper';
import { LoginPage } from '../login/login.po';
import { IProjectMilestone } from './project-milestone.model';
import { ProjectMilestonePageObject } from './project-milestone.po';

let milestoneName: string;
let milestoneDescription: string;
let startDate: string[];
let endDate: string[];

export class ProjectMilestonePageHelper {
	/**
	 * Initialize Create Project Milestone page object
	 */
	public static initialize() {
		this.projectMilestonePageObject = new ProjectMilestonePageObject();
		this.loginPageObject = new LoginPage();
	}

	/**
	 * Open Home page
	 *
	 * @param isCustomer is cusomter
	 */
	public static async open(isCustomer: boolean = false) {
		await CommonHelper.goToRecentlyCreatedProject(isCustomer);
		await CommonHelper.waitForPageDisplayed();

		await BrowserHelper.waitUntilClickableOf(
			this.projectMilestonePageObject.dashboardPageLoad,
			config.Timeout.ElementClickable,
			config.LoggerErrors.ElementClickable
		);
	}

	/**
	 * Verify that User can Create / Edit / Delete Milestone
	 *
	 * @param projectMilestones 	Test Data for the test
	 */
	public static async verifyUserCanCreateEditDeleteMilestone(projectMilestones: IProjectMilestone) {
		await CommonHelper.waitForAddNewMilestones();
		await this.addMilestones(projectMilestones, 1, projectMilestones.active);

		await this.projectMilestonePageObject.getEditButton(milestoneName).click();
		logger.info('Clicked On Edit Button');

		milestoneName = milestoneName + "EDITED";
		milestoneDescription = milestoneDescription + "EDITED";
		startDate = CommonHelper.getDate(3);
		endDate = CommonHelper.getDate(5);

		// await this.clickAddNewMilestoneButtonAndVerifyTitle(projectMilestones);

		await this.specifyMilestoneDetails(milestoneName, milestoneDescription, startDate, endDate, projectMilestones.active);

		const saveButton = await this.projectMilestonePageObject.saveButton();
		await saveButton.click();
		logger.info('Save button clicked.');

		const isVerified = await this.verifyMileStoneDetails(milestoneName, milestoneDescription, startDate, endDate, projectMilestones.active);
		expect(isVerified).toEqual(true);
		logger.info('Verified Milestone Details Edited Successfully.');

		const beforeDeletionCount = (await this.projectMilestonePageObject.milestoneTableRows).length;
		logger.info(`Before Deletion Milestone Length ${beforeDeletionCount}`);

		await this.projectMilestonePageObject.getDeleteButton(milestoneName).click();
		logger.info('Clicked Delete Button');

		const popupMessage = await this.projectMilestonePageObject.popupMessage.getText();
		expect(popupMessage).toContain(projectMilestones.deleteConfirmation);
		expect(popupMessage).toContain(projectMilestones.deletePopupMessage);
		logger.info(`Verified Popup Message ${popupMessage}`);

		await this.projectMilestonePageObject.yesButton.click();
		logger.info('Clicked Yes button');

		// Verify Alert Message
		const milestoneDeletionMessage = await CommonHelper.getAlertMessageAndClosePopup();
		expect(milestoneDeletionMessage).toEqual(projectMilestones.milestoneDeletionMessage);
		logger.info(`Verified Milestone Deletion Message ${milestoneDeletionMessage}`);

		const afterDeletionCount = (await this.projectMilestonePageObject.milestoneTableRows).length;
		logger.info(`After Deletion Milestone Length ${afterDeletionCount}`);

		expect(afterDeletionCount).toBeLessThan(beforeDeletionCount);
		logger.info('Verified Milestone After Deletion Count is Less than before Deletion');
	}

	/**
	 * Specify Milestone Details
	 * @param mName 			Milestone Name
	 * @param mDescription 		Milestone Description
	 * @param mStartDate 		Milestone Start Date
	 * @param mEndDate 			Milestone End Date
	 * @param status 			Milestone Status
	 */
	public static async specifyMilestoneDetails(mName: string, mDescription: string, mStartDate: string[], mEndDate: string[], status: string) {
		const milestoneNameElement = this.projectMilestonePageObject.milestoneNameTextbox;
		await milestoneNameElement.clear();
		await milestoneNameElement.sendKeys(mName);
		logger.info(`Specified Milestone Name ${mName}`);

		const milestoneDescElement = this.projectMilestonePageObject.milestoneDescriptionTextbox;
		await milestoneDescElement.clear();
		await milestoneDescElement.sendKeys(mDescription);
		logger.info(`Specified Milestone Description ${mDescription}`);

		// const startDateValue = mStartDate[0]+mStartDate[1]+mStartDate[2];
		// await this.projectMilestonePageObject.milestoneStartDateTextbox.sendKeys(startDateValue);
		// logger.info(`Specified Start Date ${startDateValue}`);

		// const endDateValue = mEndDate[0]+mEndDate[1]+mEndDate[2];
		// await this.projectMilestonePageObject.milestoneEndDateTextbox.sendKeys(endDateValue);
		// logger.info(`Specified End Date ${endDateValue}`);

		await this.projectMilestonePageObject.milestoneDropdown.click();
		await CommonHelper.waitForElementToBeVisible('xpath', this.projectMilestonePageObject.milestoneListXpath);
		const list = await this.projectMilestonePageObject.milestoneList;
		for (const milestone of list) {
			const name = await milestone.getText();
			if (name === status) {
				await milestone.click();
				logger.info(`Milestone Status ${status} selected.`);
				break;
			}
		}
	}

	public static async addNewMilestone(projectMilestones: IProjectMilestone, status: string) {
		await BrowserHelper.waitUntilClickableOf(
			this.projectMilestonePageObject.getAddButton(),
			config.Timeout.ElementClickable,
			config.LoggerErrors.ElementClickable
		);

		await this.clickAddNewMilestoneButtonAndVerifyTitle(projectMilestones);

		await this.specifyMilestoneDetails(milestoneName, milestoneDescription, startDate, endDate, status);
		logger.info(`Specified Milestone Details`);

		const saveButton = await this.projectMilestonePageObject.saveButton();
		await saveButton.click();
		logger.info('Clicked on Save button');

		const milestoneCreationMessage = await CommonHelper.getAlertMessageAndClosePopup();
		expect(milestoneCreationMessage).toEqual(projectMilestones.milestoneCreationMessage);
		logger.info(`Verified Milestone creating message ${milestoneCreationMessage}`);

		const isVerified = await this.verifyMileStoneDetails(milestoneName, milestoneDescription, startDate, endDate, status);
		expect(isVerified).toEqual(true);
		logger.info('Verified Newly created milestone details');
	}

	/**
	 * Click Add New Milestone Button and Verify Title
	 *
	 * @param projectMilestones Test Data for the test
	 */
	public static async clickAddNewMilestoneButtonAndVerifyTitle(projectMilestones: IProjectMilestone) {
		await this.projectMilestonePageObject.getAddButton().click();
		logger.info("Clicked on Add New Milestone button");

		const pageTitle = await this.projectMilestonePageObject.milestonesPageTitle.getText();
		expect(pageTitle).toBe(projectMilestones.milestone);
		logger.info(`Verified Milestone Page Title $${pageTitle}`);

		const addButton = await this.projectMilestonePageObject.getAddButton().getText();
		expect(addButton).toBe(projectMilestones.addButton);
		logger.info(`Verified Add New Milestone Button $${addButton}`);
	}

	/**
	 * Verify Milestone Details
	 *
	 * @param mName 			Milestone Name
	 * @param mDescription 		Milestone Description
	 * @param mStartDate 		Milestone Start Date
	 * @param mEndDate 			Milestone End Date
	 * @param status 			Status
	 *
	 * @returns 				True / False
	 */
	public static async verifyMileStoneDetails(mName: string, mDescription: string, mStartDate: string[], mEndDate: string[], status: string) {
		let isVerified = false;
		const list = await this.projectMilestonePageObject.milestoneTableRows
		for (const milestoneRow of list) {
			const row = await milestoneRow.getText();
			if (row.includes(mName)) {
				expect(row).toContain(mName);
				logger.info(`Verified Milestone Name ${mName}`);
				expect(row).toContain(mDescription);
				logger.info(`Verified Milestone Description ${mDescription}`);
				expect(row).toContain(status);
				logger.info(`Verified Milestone Status ${status}`);
				// expect(row).toContain(`${mStartDate[1]}-${mStartDate[0]}-${mStartDate[2]}`);
				// logger.info(`Verified Start Date ${mStartDate[1]}-${mStartDate[0]}-${mStartDate[2]}`);
				// expect(row).toContain(`${mEndDate[1]}-${mEndDate[0]}-${mEndDate[2]}`);
				// logger.info(`Verified End Date ${mStartDate[1]}-${mStartDate[0]}-${mStartDate[2]}`);
				isVerified = true;
				break;
			}
		}
		return isVerified;
	}

	/**
	 * Verify User Can Add Copilot On Milestone
	 *
	 * @param projectMilestones 	Test Data for the test
	 */
	public static async verifyUserCanAddCopilotOnMilestone(projectMilestones: IProjectMilestone) {
		await CommonHelper.waitForAddNewMilestones();
		milestoneName = CommonHelper.appendDate(projectMilestones.milestone);
		milestoneDescription = CommonHelper.appendDate(projectMilestones.description);
		startDate = CommonHelper.getDate();
		endDate = CommonHelper.getDate(2);

		await this.clickAddNewMilestoneButtonAndVerifyTitle(projectMilestones);

		await this.specifyMilestoneDetails(milestoneName, milestoneDescription, startDate, endDate, projectMilestones.active);

		await this.projectMilestonePageObject.getAddCopilotButton(milestoneName).click();
		logger.info('Click on Add Copilot button');
		await CommonHelper.waitForElementToBeVisible('xpath', this.projectMilestonePageObject.copilotManagementWindowTitleXpath);

		const copilotManagementWindowTitle = await this.projectMilestonePageObject.copilotManagementWindowTitle.getText();
		expect(copilotManagementWindowTitle).toEqual(projectMilestones.copilot);
		logger.info(`Verified Copilot Management Window Title ${copilotManagementWindowTitle}`);

		await this.projectMilestonePageObject.copilotDropdown.click();
		await this.projectMilestonePageObject.copilotTextbox.sendKeys(projectMilestones.copilotName);
		await CommonHelper.searchTextFromListAndClick(await this.projectMilestonePageObject.copilotList, projectMilestones.copilotName, true);

		await BrowserHelper.waitUntilClickableOf(
			this.projectMilestonePageObject.getAddButton(2),
			config.Timeout.ElementClickable,
			config.LoggerErrors.ElementClickable
		);

		await this.projectMilestonePageObject.getAddButton(2).click();
		logger.info('Clicked on Add Button');

		const copilotNameLabelValue = await this.projectMilestonePageObject.copilotNameLabel.getText();
		expect(copilotNameLabelValue).toEqual(projectMilestones.copilotName);
		logger.info(`Verified Copilot Name Label Value ${copilotNameLabelValue}`);

		await this.projectMilestonePageObject.closeIcon.click();
		logger.info('Clicked Close Icon');

		const saveButton = await this.projectMilestonePageObject.saveButton();
		await saveButton.click();
		logger.info('Clicked Save Icon');

		const milestoneCreationMessage = await CommonHelper.getAlertMessageAndClosePopup();
		expect(milestoneCreationMessage).toEqual(projectMilestones.milestoneCreationMessage);
		logger.info(`Verified Milestone Creation Message ${milestoneCreationMessage}`);

		const isVerified = await this.verifyMileStoneDetails(milestoneName, milestoneDescription, startDate, endDate, projectMilestones.active);
		expect(isVerified).toEqual(true);
		logger.info('Verified Milestone Details Successfully.');

		await CommonHelper.waitForElementToBeVisible('xpath', this.projectMilestonePageObject.copilotImageXpath.replace('MILESTONE_NAME', milestoneName));
		const copilotImageName = await this.projectMilestonePageObject.getCopilotImage(milestoneName).getAttribute("alt");
		expect(copilotImageName).toEqual(projectMilestones.copilotName);
		logger.info(`Copilot Image Verified with attribute ${copilotImageName}`);
	}

	/**
	 * Verify User Can Bulk Update the milestone
	 *
	 * @param projectMilestones 	Test data for the test
	 * @param milestoneNames 		List of Milestones to be updated
	 */
	public static async verifyUserCanBulkUpdateTheMilestone(projectMilestones: IProjectMilestone) {
		const beforeRowDates = await this.getDateDetailsForAvailableMilestones();

		await this.projectMilestonePageObject.milestoneSelectAllCheckbox.click();
		logger.info('Click on Milestone Select All checkbox');

		const message = await this.projectMilestonePageObject.projectSelectedLabel.getText();
		expect(message).toContain(projectMilestones.projectsSelected);
		logger.info(`Verified Message ${message}`);

		await this.projectMilestonePageObject.addCopilotButton.click();
		logger.info(`Clicked On Add Copilot Icon`);

		await CommonHelper.waitForElementToBeVisible('xpath', this.projectMilestonePageObject.copilotManagementWindowTitleXpath);
		const copilotManagementWindowTitle = await this.projectMilestonePageObject.copilotManagementWindowTitle.getText();
		expect(copilotManagementWindowTitle).toEqual(projectMilestones.copilot);
		logger.info(`Verified Copilot Management Window Title ${copilotManagementWindowTitle}`);

		await this.projectMilestonePageObject.copilotDropdown.click();
		await this.projectMilestonePageObject.copilotTextbox.sendKeys(projectMilestones.copilotName);
		await CommonHelper.searchTextFromListAndClick(await this.projectMilestonePageObject.copilotList, projectMilestones.copilotName, true);
		logger.info(`Selected Copilot from the list ${projectMilestones.copilotName}`);
		await this.projectMilestonePageObject.getAddButton(2).click();

		const copilotNameLabelValue = await this.projectMilestonePageObject.copilotNameLabel.getText();
		expect(copilotNameLabelValue).toEqual(projectMilestones.copilotName);
		logger.info(`Verified Copilot Name Label Value ${copilotNameLabelValue}`);

		await this.projectMilestonePageObject.closeIcon.click();
		logger.info('Clicked Close Icon');

		await this.projectMilestonePageObject.moveMilestoneButton.click();
		logger.info('Clicked Move Milestone Icon');

		await BrowserHelper.waitUntilClickableOf(
			this.projectMilestonePageObject.moveMilestonePopupMessage,
			config.Timeout.ElementClickable,
			config.LoggerErrors.ElementClickable
		);
		const moveMilestonePopupMessage = await this.projectMilestonePageObject.moveMilestonePopupMessage.getText();
		expect(moveMilestonePopupMessage).toContain(projectMilestones.moveMilestoneDatesTitle);
		expect(moveMilestonePopupMessage).toContain(projectMilestones.moveMilestoneDatesDescription);
		logger.info(`Verified Move Milestone Popup Message: ${moveMilestonePopupMessage}`);

		const moveMilestoneInputBoxElement = this.projectMilestonePageObject.moveMilestoneInputBox;
		moveMilestoneInputBoxElement.clear();
		moveMilestoneInputBoxElement.sendKeys(projectMilestones.noOfDays);
		logger.info(`Specified Value ${projectMilestones.noOfDays} in Move Milestone Textbox`);

		await this.projectMilestonePageObject.getMoveMilestoneButton().click();
		logger.info('Clicked on Move Milestone button');

		const afterRowDates = await this.getDateDetailsForAvailableMilestones();
		await this.verifyMilestoneDatesAfterMovingDates(beforeRowDates, afterRowDates, projectMilestones.noOfDays);

		await this.projectMilestonePageObject.deleteMilestoneButton.click();
		logger.info('Clicked on Move Milestone Delete button');

		await BrowserHelper.waitUntilClickableOf(
			this.projectMilestonePageObject.moveMilestonePopupMessage,
			config.Timeout.ElementClickable,
			config.LoggerErrors.ElementClickable
		);
		const popupMessage = await this.projectMilestonePageObject.popupMessage.getText();
		expect(popupMessage).toContain(projectMilestones.deleteConfirmation);
		expect(popupMessage).toContain(projectMilestones.deletePopupMessage);
		logger.info(`Verified Delete Milestone Popup Message: ${popupMessage}`);

		await this.projectMilestonePageObject.yesButton.click();
		logger.info('Clicked Yes button');

		const milestoneBulkDeletionMessage = await CommonHelper.getAlertMessageAndClosePopup();
		expect(milestoneBulkDeletionMessage).toEqual(projectMilestones.milestoneBulkDeletionMessage);
		logger.info(`Verified Delete Milestone Message ${milestoneBulkDeletionMessage}`);
	}

	/**
	 * Adds a new Milestone
	 *
	 * @param projectMilestones 	Test Data for Adding Milestone
	 * @param count 				No. of Milestones to add
	 * @param status 				Milestone Status
	 *
	 * @returns 					Names of Milestones created
	 */
	public static async addMilestones(projectMilestones: IProjectMilestone, count: any, status: string) {
		const milestoneNames = [];

		for (let cnt = 0; cnt < count; cnt++) {
			milestoneName = CommonHelper.appendDate(projectMilestones.milestone);
			milestoneDescription = CommonHelper.appendDate(projectMilestones.description);
			startDate = CommonHelper.getDate(cnt);
			endDate = CommonHelper.getDate(cnt + 2);

			await this.addNewMilestone(projectMilestones, status);
			milestoneNames.push(milestoneName);
		}

		return milestoneNames;
	}

	/**
	 * Verify Add Milestone Button and Draft Milestone Should not be displayed for Customer
	 *
	 * @param projectMilestones 	Test Data for the test
	 *
	 * @param customerUser 			Customer User Details
	 */
	public static async verifyAddMilestoneButtonAndDraftMilestoneShouldNotBeDisplayed(projectMilestones: IProjectMilestone, customerUser: any) {
		// await this.addMilestones(projectMilestones, 1, projectMilestones.active);
		await this.addMilestones(projectMilestones, 1, projectMilestones.inReview);
		await this.addMilestones(projectMilestones, 1, projectMilestones.inReview);
		await this.addMilestones(projectMilestones, 1, projectMilestones.draft);

		await this.loginPageObject.logout();

		await CommonHelper.login(customerUser.email, customerUser.password);
		logger.info('Logged in using Customer User');

		await this.open(true);

		const isAddButtonPresent = await CommonHelper.isElementPresent('xpath', this.projectMilestonePageObject.addNewMilestoneXpath);
		expect(isAddButtonPresent).toEqual(false);
		logger.info('Verified Add Button is Not Visible for Customer User');

		const isDraftMilestonePresent = await CommonHelper.isElementPresent('xpath', this.projectMilestonePageObject.milestoneStatusXpath);
		expect(isDraftMilestonePresent).toEqual(false);
		logger.info('Verified Draft Milestone Created by Copilot User s Not Visible for Customer User');
	}

	/**
	 * Deletes All Milestones Present
	 *
	 * @param projectMilestones 	Test Data for the test
	 */
	public static async deleteAllMilestones(projectMilestones: IProjectMilestone) {
		await CommonHelper.waitForMilestones();
		await BrowserHelper.waitUntilClickableOf(
			this.projectMilestonePageObject.getAddButton(),
			config.Timeout.ElementClickable,
			config.LoggerErrors.ElementClickable
		);

		await this.projectMilestonePageObject.milestoneSelectAllCheckbox.click().then(async () => {
			logger.info('Click on Milestone Select All checkbox');

			await this.projectMilestonePageObject.deleteMilestoneButton.click();
			logger.info('Clicked on Move Milestone Delete button');

			await BrowserHelper.waitUntilClickableOf(
				this.projectMilestonePageObject.moveMilestonePopupMessage,
				config.Timeout.ElementClickable,
				config.LoggerErrors.ElementClickable
			);
			const popupMessage = await this.projectMilestonePageObject.popupMessage.getText();
			expect(popupMessage).toContain(projectMilestones.deleteConfirmation);
			expect(popupMessage).toContain(projectMilestones.deletePopupMessage);
			logger.info(`Verified Delete Milestone Popup Message: ${popupMessage}`);

			await this.projectMilestonePageObject.yesButton.click();
			logger.info('Clicked Yes button');

			const milestoneDeletionMessage = await CommonHelper.getAlertMessageAndClosePopup();
			expect(milestoneDeletionMessage).toEqual(projectMilestones.milestoneDeletionMessage);
			logger.info(`Verified Delete Milestone Message ${milestoneDeletionMessage}`);

			await BrowserHelper.waitUntilClickableOf(
				this.projectMilestonePageObject.getAddButton(),
				config.Timeout.ElementClickable,
				config.LoggerErrors.ElementClickable
			);
		}).catch((err) => {
			logger.info('No Milestones to Delete');
		});
	}

	/**
	 * Gets Date Details for the Available Milestones
	 *
	 * @returns Date Details
	 */
	public static async getDateDetailsForAvailableMilestones() {
		const availableDates = [];
		const tableRows = await this.projectMilestonePageObject.milestoneTableRows;
		for (const test of tableRows) {
			const tableTds = await ElementHelper.getAllElementsByTag("td", test);
			for (let innerCnt = 0; innerCnt < tableTds.length; innerCnt++) {
				const dateString = await tableTds[innerCnt].getText();
				if (innerCnt === 4) {
					availableDates.push(dateString);
				}
				if (innerCnt === 5) {
					availableDates.push(dateString);
					break;
				}
			}
		}
		return availableDates;
	}

	/**
	 * Verify Date Difference after moving milestone dates
	 *
	 * @param beforeRowDates 		Before Moving Milestone Dates
	 * @param afterRowDates 		After Moving Milestone Dates
	 * @param differenceToCheck 	Difference number to check
	 */
	public static async verifyMilestoneDatesAfterMovingDates(beforeRowDates: string[], afterRowDates: string[], differenceToCheck: number) {
		for (let cnt = 0; cnt < beforeRowDates.length; cnt++) {
			const datesArray1 = beforeRowDates[cnt];
			const datesArray2 = afterRowDates[cnt];
			const date1 = new Date(datesArray1);
			const date2 = new Date(datesArray2);
			const diffTime = Math.abs(date2.getTime() - date1.getTime());
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
			expect(diffDays).toEqual(differenceToCheck);
			logger.info(`Verified Date Difference between dates ${date1.getDate()} and ${date2.getDate()} as ${differenceToCheck}`);
		}
	}

	/**
	 * approve the milestone which are in review status
	 */
	public static async takeActionOnMilestone(projectMilestones: IProjectMilestone, customerUser: any, copilotUser: any) {
		await CommonHelper.waitForMilestones();
		await this.verifyAddMilestoneButtonAndDraftMilestoneShouldNotBeDisplayed(projectMilestones, customerUser);
		await this.approveMilestoneAndVerify()

		await this.loginPageObject.logout();

		await CommonHelper.login(copilotUser.email, copilotUser.password);
		logger.info('Logged in using Copilot User');

		await this.open();
		const milestoneApproveNotification = this.projectMilestonePageObject.allMilestoneApproveNotification()
		await BrowserHelper.waitUntilVisibilityOf(milestoneApproveNotification)
		logger.info(`'${await milestoneApproveNotification.getText()}' is displayed on the page.`)
		expect(milestoneApproveNotification.getText()).toContain(projectMilestones.allMilestoneApprovedNotificationStr)
		await CommonHelper.waitAndClickElement(this.projectMilestonePageObject.getDismissAllMilestoneApprovedNotificationButton())
		logger.info(`The notification alert is dismissed.`)
	}

	/**
	 * approve all milestone with customer role
	 * @param message
	 */
	public static async approveMilestoneAndVerify() {
		const approveMilestoneButton = await this.projectMilestonePageObject.getAllMilestoneActionButtonsForCustomer('approve')
		let numberOfInReviewMilestones = (approveMilestoneButton).length
		let index: number = 0;

		logger.info(`Total ${numberOfInReviewMilestones} numbers of milestone found with 'In review' status`)

		const approveMilestoneButton1 = this.projectMilestonePageObject.getMilestoneActionButtonForCustomer('approve')
		await BrowserHelper.sleep(2000);
		while (numberOfInReviewMilestones !== 0) {
			logger.info("Approve milestone button is displayed on  the page.")
			try {
				expect(await BrowserHelper.waitUntilClickableOf(approveMilestoneButton1))
				await CommonHelper.waitAndClickElement(approveMilestoneButton1)
				logger.info(`${index + 1} milestone approved.`)
				index++
				numberOfInReviewMilestones--;
				const approvedAlert = await CommonHelper.getAlertMessageAndClosePopup();
				await BrowserHelper.waitUntilInVisibilityOf(approvedAlert)
			} catch (StaleElementReferenceError) {
				await BrowserHelper.sleep(4000);
			}
		}
		index = 0;
		logger.info("All milestone with 'In review' status are approved.")
	}

	private static loginPageObject: LoginPage;
	private static projectMilestonePageObject: ProjectMilestonePageObject;
}
