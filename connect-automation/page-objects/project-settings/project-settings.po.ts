import { BrowserHelper, ElementHelper } from 'topcoder-testing-lib';
import { logger } from '../../logger/logger';
import { ConfigHelper } from '../../utils/config-helper';

export class ProjectSettingsPageObject {
	/**
	 * Open the Given Project URL
	 * @param expired 
	 */
	public static async open(expired = false) {
		const url = expired ? ConfigHelper.getExpiredProjectUrl() : ConfigHelper.getGivenProjectUrl()
		await BrowserHelper.open(url);
		logger.info('User navigated to Project Page');
	}

	/**
	 * Get the Project Menu
	 * 
	 * @param menu Name of the Project Menu
	 * 
	 * @returns Element of Project Menu
	 */
	public getProjectMenu(menu: string) {
		let index = 0;
		switch (menu) {
			case 'Dashboard': index = 1; break;
			case 'Messages': index = 2; break;
			case 'Assets Library': index = 5; break;
			case 'Project Settings': index = 7; break;
		} 
		return ElementHelper.getElementByXPath(`(//a[contains(@href,'/projects/')]/span)[${index}]`);
	}

	/**
	 * Get Enforce Topcoder NDA Radio Buttons List
	 */
	public get enforceTopcoderNDARadioButtons() {
		return ElementHelper.getAllElementsByXPath('//label[contains(@for,"nda-opt")]');
	}

	/**
	 * Get Intended Work Groups Close Icon
	 */
	public get intendedWorkGroupsCloseIcon() {
		return ElementHelper.getElementByXPath('//div[contains(@class,"react-select__multi-value__remove")]');
	}

	/**
	 * Get Intended Work Groups Select Input
	 */
	public get intendedWorkGroupsSelect() {
		return ElementHelper.getElementByXPath('//div[text()="Select..."]');
	}

	/**
	 * Get Intended Work Groups Input
	 */
	public get intendedWorkGroupsInput() {
		return ElementHelper.getElementByXPath('(//input[contains(@id,"react-select")])[1]');
	}

	/**
	 * Get Intended Work Group List
	 */
	public get intendedWorkGroupsList() {
		return ElementHelper.getElementByXPath('//div[@id="react-select-2-option-0"]');
	}

	/**
	 * Get Save Button
	 */
	public get saveButton() {
		return ElementHelper.getElementByXPath('//button[normalize-space()="Save"]');
	}

	/**
	 * Get Enforce Topcoder NDA Radio Button
	 * 
	 * @param value Enforce Topcoder NDA Radio button: Yes or No
	 * 
	 * @returns Enforce Topcoder NDA Radio Button
	 */
	public getEnforceTopcoderNDARadioButtonsStatus(value: string) {
		if (value === 'Yes') {
			return ElementHelper.getElementByXPath('(//label[contains(@for,"nda-opt")]/parent::div)[1]').getAttribute('class');
		} else {
			return ElementHelper.getElementByXPath('(//label[contains(@for,"nda-opt")]/parent::div)[2]').getAttribute('class');
		}
	}

	/**
	 * Get Intended Work Group Selected Value
	 */
	public get intendedWorkGroupsSelectedValue() {
		return ElementHelper.getElementByXPath('//div[contains(@class,"react-select__multi-value__label") and text()="Hide Challenges"]');
	}

	/**
	 * Get Project Settings Expiry Icon
	 */
	public get projectSettingsExpiryIcon() {
		return '//span[normalize-space()="Project Settings"]/*[local-name()="svg"]';
	}

	/**
	 * Get Assets Library Label
	 */
	public get assetsLibraryLabel() {
		return ElementHelper.getElementByXPath('//div[text()="Assets Library"]');
	}

	/**
	 * Click on the given tab
	 *
	 * @param tabName Name of the tab
	 * 
	 * @returns Element of the tab
	 */
	public clickOnTab(tabName: string) {
		return ElementHelper.getElementByXPath(`//span[text()='${tabName}']`);
	}

	/**
	 * Verifies if Tab is selected or not
	 * 
	 * @param tabName Name of the tab
	 * 
	 * @returns Either True or False
	 */
	public async isTabSelected(tabName: string) {
		const selectedTabXpath = `//span[text()='${tabName}']/parent::li`;
		const className = (await ElementHelper.getElementByXPath(selectedTabXpath).getAttribute('class')).toString()
		return (className.trim().length !== 0) ? true: false;
	}

	/**
	 * Get the tab count
	 * @param tabName Name of the Tab
	 * 
	 * @returns Element of the tab count
	 */
	public getCount(tabName: string) {
		return ElementHelper.getElementByXPath(`//span[text()='${tabName}']/following-sibling::span`);
	}

	/**
	 * Get Add New Button
	 */
	public get addNewButton() {
		return ElementHelper.getElementByXPath('//button[text()="Add new..."]');
	}

	/**
	 * Get File Upload Content Area
	 */
	public get fileUploadContentArea() {
		return '//div[@class="fsp-content"]';
	}

	/**
	 * Get File Upload Dialog Box
	 */
	public get fileUploadDialogBox() {
		return ElementHelper.getElementByXPath('//div[@class="fsp-modal"]');
	}

	/**
	 * Get File To Upload Button
	 */
	public get selectFileToUploadButton() {
		return ElementHelper.getElementByXPath('//input[@id="fsp-fileUpload"]');
	}

	/**
	 * Get Upload Button
	 */
	public get uploadButton() {
		return ElementHelper.getElementByXPath('//span[@title="Upload"]');
	}

	/**
	 * Get Attachment Options Dialog box
	 */
	public get attachmentOptionsDialogBox() {
		return ElementHelper.getElementByXPath('//div[@class="project-dialog"]');
	}

	/**
	 * Get Tags Text box
	 */
	public get tagsTextbox() {
		return ElementHelper.getElementByXPath('//div[text()="Add tags"]');
	}

	/**
	 * Get All Project Members button
	 */
	public get allProjectMembersButton() {
		return ElementHelper.getElementByXPath('//button[text()="All project members"]');
	}

	/**
	 * Get Assets Library File Name
	 * 
	 * @param tagName Name of the tag
	 * 
	 * @returns Element of Assets Library File Name
	 */
	public getAssetsLibraryFileName(tagName: string) {
		return ElementHelper.getElementByXPath(`//span[text()='${tagName}']/preceding-sibling::p/a`);
	}

	/**
	 * Get Grid button for the tag
	 * 
	 * @param tagName Name of the tag
	 * 
	 * @returns Element of the Grid Button for the tag
	 */
	public getGridButton(tagName: string) {
		return ElementHelper.getElementByXPath(`//span[text()='${tagName}']/ancestor::li//div[contains(@class,'edit-toggle-container')]`);
	}

	/**
	 * Get Grid Edit Button for the tag
	 * 
	 * @param tagName Name of the tag
	 * 
	 * @returns Element of Edit button for the tag
	 */
	public getGridEditButton(tagName: string) {
		return ElementHelper.getElementByXPath(`//span[text()='${tagName}']/ancestor::li//a[text()='Edit']`);
	}

	/**
	 * Get Edit Attachment Window
	 */
	public get editAttachmentWindow() {
		return ElementHelper.getElementByXPath('//div[@class="modal-title danger"]');
	}

	/**
	 * Get Edit Attachment Tag Name
	 */
	public get editAttachmentTagName() {
		return ElementHelper.getElementByXPath('//div[contains(@class,"react-select__multi-value__label")]');
	}

	/**
	 * Get Edit Attachment Title Input Box
	 */
	public get editAttachmentTitleInputBox() {
		return ElementHelper.getElementByXPath('//input[@class="edit-input"]');
	}

	/**
	 * Get Save Changes Button
	 */
	public get saveChangesButton() {
		return ElementHelper.getElementByXPath('//button[text()="Save Changes"]');
	}

	/**
	 * Get Grid Remove Button for the tag
	 * 
	 * @param tagName Name of the tag
	 * 
	 * @returns Element of Grid Remove button for the tag
	 */
	public getGridRemoveButton(tagName: string) {
		return ElementHelper.getElementByXPath(`//span[text()='${tagName}']/ancestor::li//a[text()='Remove']`);
	}

	/**
	 * Get Delete Popup Message
	 */
	public get deletePopupMessage() {
		return ElementHelper.getElementByXPath('//p[@class="message"]');
	}

	/**
	 * Get Delete File Button
	 */
	public get deleteFileButton() {
		return ElementHelper.getElementByXPath('//button[text()="Delete file"]');
	}

	/**
	 * Get Add Link Popup Title
	 */
	public get addLinkPopupTitle() {
		return ElementHelper.getElementByXPath('//div[contains(@class,"modal-title")]');
	}

	/**
	 * Get Link Name Text box
	 */
	public get linkNameTextbox() {
		return ElementHelper.getElementByXPath('//input[@name="title"]');
	}

	/**
	 * Get Link URL text box
	 */
	public get linkUrlTextbox() {
		return ElementHelper.getElementByXPath('//input[@name="address"]');
	}

	/**
	 * Get Link Button
	 */
	public get addLinkButton() {
		return ElementHelper.getElementByXPath('//button[@type="submit"]');
	}

	/**
	 * Get Edit Lnk Text box
	 */
	public get editLinkTitleTextbox() {
		return ElementHelper.getElementByXPath('(//input[@class="edit-input"])[1]');
	}

	/**
	 * Get Edit Link Address Text box
	 */
	public get editLinkAddressTextbox() {
		return ElementHelper.getElementByXPath('(//input[@class="edit-input"])[2]');
	}

	/**
	 * Get Edit Link Button
	 */
	public get editLinkButton() {
		return ElementHelper.getElementByXPath('//button[text()="Edit link"]');
	}

	/**
	 * Get Delete Link Button
	 */
	public get deleteLinkButton() {
		return ElementHelper.getElementByXPath('//button[text()="Delete link"]');
	}

	/**
	 * Get Message Creation Window
	 */
	public get messageCreationWindow() {
		return ElementHelper.getElementByXPath('//input[@class="new-post-title"]');
	}

	/**
	 * Get Message Description Text Box
	 */
	public get messageDescriptionTextbox() {
		return ElementHelper.getElementByXPath('//div[@role="combobox"]');
	}

	/**
	 * Get Attach A File Link
	 */
	public get attachAFileLink() {
		return ElementHelper.getElementByXPath('//div[@class="tc-attachment-button"]');
	}

	/**
	 * Get Post Button
	 */
	public get postButton() {
		return ElementHelper.getElementByXPath('//button[normalize-space()="Post"]');
	}

	/**
	 * Get Earlier Message file based on the name provided
	 * 
	 * @param fileName Name of the File
	 * 
	 * @returns  Element of Earlier Message File
	 */
	public earlierMessagesFile(fileName: string) {
		return ElementHelper.getElementByXPath(`//div[text()='${fileName}']`);
	}

	/**
	 * Get Assets Library File Name
	 * 
	 * @param fileName Name of the File
	 * 
	 * @returns Element of the Assets Library File
	 */
	public getAssetsLibraryFile(fileName: string) {
		return ElementHelper.getElementByXPath(`//p[text()='${fileName}']`);
	}

	/**
	 * Get Upload File
	 */
	public get uploadedFile() {
		return ElementHelper.getElementByXPath('//a[contains(@href, "/projects/messages")]');
	}
}