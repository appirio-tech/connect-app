import * as path from 'path';
import { BrowserHelper } from 'topcoder-testing-lib';
import * as appconfig from '../../config/app-config.json';
import { CommonHelper } from '../common-page/common.helper';
import { ProjectSettingsPageObject } from '../project-settings/project-settings.po';
import { IProjectSettings } from './project-settings.model';

export class ProjectSettingsPageHelper {
	/**
	 * Initialize Create Project page object
	 */
	public static initialize() {
		this.projectSettingsPageObject = new ProjectSettingsPageObject();
	}

	/**
	 * Open Expired Project
	 */
	public static async openExpiredProject() {
		await ProjectSettingsPageObject.openExpiredProject();
	}

	/**
	 * Open Settings
	 */
	public static async openSettings() {
		await CommonHelper.waitForPageDisplayed();
		await CommonHelper.waitForElementToGetDisplayed(this.projectSettingsPageObject.getProjectMenu('Project Settings'));

		await this.projectSettingsPageObject.getProjectMenu('Project Settings').click();

		// Waiting for page to get loaded
		await BrowserHelper.waitUntilClickableOf(
			this.projectSettingsPageObject.projectSettingsForm,
			appconfig.Timeout.ElementClickable,
			appconfig.LoggerErrors.ElementClickable
		);
	}

	/**
	 * Edits Settings page
	 * 
	 * @param projectSettings Test Data for the test
	 */
	public static async editProjectSettings(projectSettings: IProjectSettings) {
		// Select Enforce NDA Yes Button
		const enforceTopcoderNDARadioButtons = await this.projectSettingsPageObject.enforceTopcoderNDARadioButtons();
		const index = (projectSettings.enforceTopcoderNDA === 'Yes') ? 0 : 1;
		await enforceTopcoderNDARadioButtons[index].click();

		// Specify the Intended Work Groups
		await this.projectSettingsPageObject.intendedWorkGroupsSelect.click();
		await this.projectSettingsPageObject.intendedWorkGroupsInput.sendKeys(projectSettings.intendedWorkGroups);
		const intendedWorkGroupsList = this.projectSettingsPageObject.intendedWorkGroupsList;
		await CommonHelper.waitForElementToGetDisplayed(intendedWorkGroupsList);
		await intendedWorkGroupsList.click();

		// Click on Save button
		await this.projectSettingsPageObject.saveButton.click();

		// Verify the Alert Message
		const message = await CommonHelper.getAlertMessageAndClosePopup();
		expect(message).toBe(projectSettings.projectUpdatedMessage);

		// Verify the Enforce NDA Yes Button is selected
		const enforceTopcoderRadioStatus = await this.projectSettingsPageObject.getEnforceTopcoderNDARadioButtonsStatus(projectSettings.enforceTopcoderNDA);
		expect(enforceTopcoderRadioStatus).toContain('selected');

		// Verify Intended Work Groups has value Hide Challenges
		const intendedWorkGroupsSelectedValue = (await this.projectSettingsPageObject.intendedWorkGroupsSelectedValue.getText()).toString();
		expect(intendedWorkGroupsSelectedValue).toEqual(projectSettings.intendedWorkGroups);
	}

	/**
	 * Resets the Project Settings as a pre-requisite for TC001
	 */
	public static async resetSettings() {
		// Resetting Enforce NDA to No
		const allProjectsBeforeSearch = await this.projectSettingsPageObject.enforceTopcoderNDARadioButtons();
		await allProjectsBeforeSearch[1].click();
		await BrowserHelper.sleep(2000);

		// Deleting the Existing Intended Work Group if present
		await this.projectSettingsPageObject.intendedWorkGroupsCloseIcon.click().catch((err) => {
			// Do Nothing
		});

		// Clicking on Save button if any changes are present
		await this.projectSettingsPageObject.saveButton.click().then(async () => {
			await CommonHelper.getAlertMessageAndClosePopup();
		}).catch((err) => {
			// Do Nothing
		});

		// Navigating to the project URL again
		await CommonHelper.goToRecentlyCreatedProject();
		await this.openSettings();
	}

	/**
	 * Verify Account Expiry Information
	 */
	public static async verifyAccountExpiryInformation() {
		// Verify that Account Expiry Icon is present
		const isIconPresent = await CommonHelper.isElementPresent('xpath', this.projectSettingsPageObject.projectSettingsExpiryIcon);
		expect(isIconPresent).toBe(true);
	}

	/**
	 * Verify User can Add / Edit / Delete / Download files
	 * 
	 * @param projectSettings Test Data for the test
	 */
	public static async verifyUserCanAddEditDeleteDownloadFiles(projectSettings: IProjectSettings) {
		// Click On Assets Library Project Menu
		await this.projectSettingsPageObject.getProjectMenu('Assets Library').click();

		// Wait for Assets Library Page to Load and verify page title
		const assetsLibraryLabel = this.projectSettingsPageObject.assetsLibraryLabel;
		await CommonHelper.waitForElementToGetDisplayed(assetsLibraryLabel);
		expect((await assetsLibraryLabel.getText()).toString().toLowerCase()).toEqual('assets library');

		// Verify that Files tab is selected by default
		const isTabSelected = await this.projectSettingsPageObject.isTabSelected('Files');
		expect(isTabSelected).toBe(true);

		// Get Current File Count before adding new file
		const previousCount = (await this.projectSettingsPageObject.getCount('Files').getText()).toString();

		// Click on Add New Button and Wait for Upload Dialog box to appear
		await this.projectSettingsPageObject.addNewButton.click();
		const fileUploadDialogBox = this.projectSettingsPageObject.fileUploadDialogBox;
		await CommonHelper.waitForElementToGetDisplayed(fileUploadDialogBox)

		// Verify that File Uploader Window is displayed
		const isIconPresent = await CommonHelper.isElementPresent('xpath', this.projectSettingsPageObject.fileUploadContentArea);
		expect(isIconPresent).toBe(true);

		// Specify the File Upload Path and Click Upload Button
		await this.specifyUploadFilePathAndClickUploadButton();

		// Verify Attachment Options window displays
		const attachmentOptionsDialogBox = this.projectSettingsPageObject.attachmentOptionsDialogBox;
		await CommonHelper.waitForElementToGetDisplayed(attachmentOptionsDialogBox);
		expect(attachmentOptionsDialogBox).toBeDefined()

		// Click on Tags Text box and Specify Tag Name
		await this.projectSettingsPageObject.tagsTextbox.click();
		const tagName = CommonHelper.appendDate(projectSettings.tagName);
		await this.projectSettingsPageObject.intendedWorkGroupsInput.sendKeys(tagName + '\n');

		// Click on All Project Members Button
		await this.projectSettingsPageObject.allProjectMembersButton.click();
		await BrowserHelper.waitUntilInVisibilityOf(attachmentOptionsDialogBox)

		// Verify Alert Message
		let message = await CommonHelper.getAlertMessageAndClosePopup();
		expect(message).toBe(projectSettings.newFileAdditionMessage);

		// Verify the newly added File Name
		const uploadedFileName = (await this.projectSettingsPageObject.getAssetsLibraryFileName(tagName).getText()).toString();
		expect(uploadedFileName).toContain('sample');

		// Get Current Count after adding file
		const currentCount = (await this.projectSettingsPageObject.getCount('Files').getText()).toString();
		expect(parseInt(currentCount, 10)).toBeGreaterThan(parseInt(previousCount, 10));

		// Click on the Assets Library File Name that's newly Added and Verify new tab is opened
		await this.clickOnLinkAndVerifyNewTab(tagName);

		await BrowserHelper.waitUntilClickableOf(
			this.projectSettingsPageObject.getGridButton(tagName),
			appconfig.Timeout.ElementClickable,
			appconfig.LoggerErrors.ElementClickable
		);

		// Click On Grid Button against newly added file and click Edit Link
		await this.projectSettingsPageObject.getGridButton(tagName).click();
		await this.projectSettingsPageObject.getGridEditButton(tagName).click();

		// Get Edit Attachment Window Title and Verify
		const editAttachmentWindowTitle = (await this.projectSettingsPageObject.editAttachmentWindow.getText()).toString();
		expect(editAttachmentWindowTitle).toEqual(projectSettings.editAttachmentWindowTitle);

		// Verify Edit Attachment Tag Name
		const editAttachmentTagName = (await this.projectSettingsPageObject.editAttachmentTagName.getText()).toString();
		expect(editAttachmentTagName).toEqual(tagName);

		// Update Edit Attachment Tag Name
		const editedTitle = CommonHelper.appendDate(projectSettings.assetsLibraryTitle);
		const editAttachmentTitleInputBox = this.projectSettingsPageObject.editAttachmentTitleInputBox;
		await editAttachmentTitleInputBox.clear();
		await editAttachmentTitleInputBox.sendKeys(editedTitle);

		// Click On Save Changes button
		await this.projectSettingsPageObject.saveChangesButton.click();

		// Verify Alert Message
		message = await CommonHelper.getAlertMessageAndClosePopup();
		expect(message).toBe(projectSettings.attachmentUpdationSuccessMessage);

		// Fetch Updated file name from the Files tab
		const updatedFileName = (await this.projectSettingsPageObject.getAssetsLibraryFileName(tagName).getText()).toString();
		expect(updatedFileName).toEqual(editedTitle);

		// Click on Grid Button against given tag and click Remove button
		await this.projectSettingsPageObject.getGridButton(tagName).click();
		await this.projectSettingsPageObject.getGridRemoveButton(tagName).click();

		// Verify Delete Popup Title 
		const deletePopupTitle = (await this.projectSettingsPageObject.editAttachmentWindow.getText()).toString();
		expect(deletePopupTitle).toEqual(projectSettings.deletePopupTitle);

		// Verify Delete Popup Message 
		const deletePopupMessage = (await this.projectSettingsPageObject.deletePopupMessage.getText()).toString();
		expect(deletePopupMessage).toEqual(projectSettings.deletePopupMessage);

		// Click on Delete File Button
		await this.projectSettingsPageObject.deleteFileButton.click();

		// Verify Alert Message
		const attachmentRemovalMessage = await CommonHelper.getAlertMessageAndClosePopup();
		expect(attachmentRemovalMessage).toBe(projectSettings.attachmentRemovalMessage);

		// Verify Files Count after File Deletion
		const countAfterDeletion = (await this.projectSettingsPageObject.getCount('Files').getText()).toString();
		expect(parseInt(countAfterDeletion, 10)).toEqual(parseInt(currentCount, 10) - 1);
	}

	/**
	 * Verify User can Add / Edit / Delete / Download links
	 * 
	 * @param projectSettings Test Data for the test
	 */
	public static async verifyUserCanAddEditDeleteDownloadLinks(projectSettings: IProjectSettings) {
		// Click on Assets Library Link
		await this.projectSettingsPageObject.getProjectMenu('Assets Library').click();

		// Verify Assets Library Window is Displayed and Verify Page Title
		const assetsLibraryLabel = this.projectSettingsPageObject.assetsLibraryLabel;
		await CommonHelper.waitForElementToGetDisplayed(assetsLibraryLabel);
		expect((await assetsLibraryLabel.getText()).toString().toLowerCase()).toEqual('assets library');

		// Get Count Before adding new link
		const previousCount = (await this.projectSettingsPageObject.getCount('Links').getText()).toString();

		// Click on Links Tab
		await this.projectSettingsPageObject.clickOnTab('Links').click()

		// Click on Add New Button and Verify Add Link Popup Title
		await this.projectSettingsPageObject.addNewButton.click();
		const addLinkPopupTitle = this.projectSettingsPageObject.addLinkPopupTitle;
		await CommonHelper.waitForElementToGetDisplayed(addLinkPopupTitle)
		expect((await addLinkPopupTitle.getText()).toString().toLocaleLowerCase()).toBe('add a link')

		// Specify Name / URL and Tag in Link popup window
		const titleName = CommonHelper.appendDate(projectSettings.assetsLibraryTitle);
		await this.projectSettingsPageObject.linkNameTextbox.sendKeys(titleName);
		await this.projectSettingsPageObject.linkUrlTextbox.sendKeys(projectSettings.addALinkURL);
		await this.projectSettingsPageObject.tagsTextbox.click();
		const tagName = CommonHelper.appendDate(projectSettings.tagName);
		await this.projectSettingsPageObject.intendedWorkGroupsInput.sendKeys(tagName + '\n');

		// Click Add Link Button
		await this.projectSettingsPageObject.addLinkButton.click();

		// Verify Alert Message
		let message = await CommonHelper.getAlertMessageAndClosePopup();
		expect(message).toBe(projectSettings.linkAttachmentSuccessMessage);

		// Verify Uploaded link Name
		const uploadedLinkName = (await this.projectSettingsPageObject.getAssetsLibraryFileName(tagName).getText()).toString();
		expect(uploadedLinkName).toEqual(titleName)

		// Verify Link could should be updated by 1
		const currentCount = (await this.projectSettingsPageObject.getCount('Links').getText()).toString();
		expect(parseInt(currentCount, 10)).toEqual(parseInt(previousCount, 10) + 1);

		// Click on Recently Added Link and Verify new tab is opened
		await this.clickOnLinkAndVerifyNewTab(tagName);

		await BrowserHelper.waitUntilClickableOf(
			this.projectSettingsPageObject.getGridButton(tagName),
			appconfig.Timeout.ElementClickable,
			appconfig.LoggerErrors.ElementClickable
		);

		// Click On Grid Button against newly added Link and click Edit button
		await this.projectSettingsPageObject.getGridButton(tagName).click();
		await this.projectSettingsPageObject.getGridEditButton(tagName).click();

		// Verify Edit Link Windows Title
		const editLinkWindowTitle = (await this.projectSettingsPageObject.editAttachmentWindow.getText()).toString();
		expect(editLinkWindowTitle).toEqual(projectSettings.editLinkWindowTitle);

		// Verify Edit Link Title
		const editLinkTitleName = this.projectSettingsPageObject.editLinkTitleTextbox;
		expect((await editLinkTitleName.getAttribute('value')).toString().toLowerCase()).toEqual(titleName.toLowerCase());

		// Verify Edit Link URL
		const editLinkAddress = (await this.projectSettingsPageObject.editLinkAddressTextbox.getAttribute('value')).toString()
		expect(editLinkAddress).toEqual(projectSettings.addALinkURL)

		// Verify Edit Link Tag
		const editLinkTagName = (await this.projectSettingsPageObject.editAttachmentTagName.getText()).toString()
		expect(editLinkTagName).toEqual(tagName)

		// Update Title Name
		const updatedTitleName = CommonHelper.appendDate(titleName);
		await editLinkTitleName.clear();
		await editLinkTitleName.sendKeys(updatedTitleName);

		// Click on Edit Link button
		await this.projectSettingsPageObject.editLinkButton.click()

		// Verify Alert Message
		message = await CommonHelper.getAlertMessageAndClosePopup();
		expect(message).toBe(projectSettings.attachmentUpdationSuccessMessage);

		// Verify Updated Link Title
		const updatedFileName = (await this.projectSettingsPageObject.getAssetsLibraryFileName(tagName).getText()).toString();
		expect(updatedFileName).toEqual(updatedTitleName)

		// Click on Grid Button against newly added Link and click Remove Button
		await this.projectSettingsPageObject.getGridButton(tagName).click();
		await this.projectSettingsPageObject.getGridRemoveButton(tagName).click();

		// Verify Delete Link Popup Title
		const deletePopupTitle = (await this.projectSettingsPageObject.editAttachmentWindow.getText()).toString();
		expect(deletePopupTitle).toEqual(projectSettings.deleteLinkPopupTitle);

		// Verify Delete Link Popup Message
		const deletePopupMessage = (await this.projectSettingsPageObject.deletePopupMessage.getText()).toString();
		expect(deletePopupMessage).toEqual(projectSettings.deletePopupMessage);

		// Click on Delete Link Button
		await this.projectSettingsPageObject.deleteLinkButton.click();

		// Verify Alert Message
		const attachmentRemovalMessage = await CommonHelper.getAlertMessageAndClosePopup();
		expect(attachmentRemovalMessage).toBe(projectSettings.attachmentRemovalMessage);

		// Verify Link Count after Deleting link
		const countAfterDeletion = (await this.projectSettingsPageObject.getCount('Links').getText()).toString();
		expect(parseInt(countAfterDeletion, 10)).toEqual(parseInt(currentCount, 10) - 1);
	}

	/**
	 * Verify that users can add Message with file attachment
	 * 
	 * @param projectSettings Test data for the test
	 */
	public static async verifyUserCanAddMessageWithFileAttachment(projectSettings: IProjectSettings) {
		// Clicks on Messages Menu
		await this.projectSettingsPageObject.getProjectMenu('Messages').click();

		// Verify Message Creation Window
		const messageCreationWindow = this.projectSettingsPageObject.messageCreationWindow;
		await CommonHelper.waitForElementToGetDisplayed(messageCreationWindow);
		expect(messageCreationWindow).toBeDefined();
		messageCreationWindow.click();

		// Specify Discussion Title 
		const discussionTitle = CommonHelper.appendDate(projectSettings.discussionTitle);
		messageCreationWindow.sendKeys(discussionTitle);

		// Specify Message Description
		await this.projectSettingsPageObject.messageDescriptionTextbox.sendKeys(discussionTitle);

		// Click on Attach a file link and specify the file to be attached
		await this.projectSettingsPageObject.attachAFileLink.click();
		const fileUploadDialogBox = this.projectSettingsPageObject.fileUploadDialogBox;
		await CommonHelper.waitForElementToGetDisplayed(fileUploadDialogBox)

		// Specify the File Upload Path and Click Upload Button
		await this.specifyUploadFilePathAndClickUploadButton();

		// Wait until post button disappears
		await BrowserHelper.waitUntilInVisibilityOf(this.projectSettingsPageObject.fileUploadDialogBox);

		// Click on Post Button
		await this.projectSettingsPageObject.postButton.click();

		// Get Recently added Message from Earlier Message Section and Verify
		const earlierMessagesFileName = this.projectSettingsPageObject.earlierMessagesFile(discussionTitle);
		await CommonHelper.waitForElementToGetDisplayed(earlierMessagesFileName);
		expect((await earlierMessagesFileName.getText()).toString()).toEqual(discussionTitle);

		// Click on Assets Library Menu
		await this.projectSettingsPageObject.getProjectMenu('Assets Library').click();

		// Get Assets Library File that's recently added and click on it
		const assetsLibraryFile = this.projectSettingsPageObject.getAssetsLibraryFile(discussionTitle);
		await CommonHelper.waitForElementToGetDisplayed(assetsLibraryFile);
		await assetsLibraryFile.click();

		// Verify the uploaded file name
		const uploadedFileName = (await this.projectSettingsPageObject.uploadedFile.getText()).toString();
		expect(uploadedFileName).toContain('sample');
	}

	/**
	 * Click on the link and Verify New Opened Tab
	 * 
	 * @param tagName Name of the tag
	 */
	public static async clickOnLinkAndVerifyNewTab(tagName: string) {
		await this.projectSettingsPageObject.getAssetsLibraryFileName(tagName).click();
		await BrowserHelper.sleep(2000);
		await BrowserHelper.getAllWindowHandles().then((handles) => {
			expect(handles.length).toEqual(2);
			BrowserHelper.switchToWindow(handles[1]);
			BrowserHelper.close();
			BrowserHelper.switchToWindow(handles[0]);
		});
		await BrowserHelper.sleep(2000);
	}

	/**
	 * Specify Upload File Path and Click Upload Button
	 */
	public static async specifyUploadFilePathAndClickUploadButton() {
		// Specify the File Upload Path
		const fileToUploadElement = this.projectSettingsPageObject.selectFileToUploadButton;
		const fileToUpload = '../../sample.pdf';
		let absolutePath = path.resolve(__dirname, fileToUpload);
		absolutePath = absolutePath.replace('/temp/', '/');
		await fileToUploadElement.sendKeys(absolutePath);

		// Click on Upload Button
		await this.projectSettingsPageObject.uploadButton.click();
	}

	private static projectSettingsPageObject: ProjectSettingsPageObject;
}
