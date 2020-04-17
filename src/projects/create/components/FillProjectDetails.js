import _ from 'lodash'
import React, { Component } from 'react'
import PT from 'prop-types'
import cn from 'classnames'
import { connect } from 'react-redux'

import './FillProjectDetails.scss'
import ProjectBasicDetailsForm from '../components/ProjectBasicDetailsForm'
import HeaderWithProgress from './HeaderWithProgress'
import UpdateUserInfo from './UpdateUserInfo'
import { formatProfileSettings } from '../../../routes/settings/helpers/settings'
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator'
import {
  getProfileSettings,
  saveProfileSettings,
  uploadProfilePhoto,
  resetProfileSetting,
} from '../../../routes/settings/actions/index'
import {
  ROLE_CONNECT_COPILOT,
  ROLE_CONNECT_MANAGER,
  ROLE_CONNECT_ACCOUNT_MANAGER,
  ROLE_CONNECT_COPILOT_MANAGER,
  ROLE_ADMINISTRATOR,
  ROLE_CONNECT_ADMIN,
  ROLE_BUSINESS_DEVELOPMENT_REPRESENTATIVE,
  ROLE_PRESALES,
  ROLE_ACCOUNT_EXECUTIVE,
  ROLE_PROGRAM_MANAGER,
  ROLE_SOLUTION_ARCHITECT,
  ROLE_PROJECT_MANAGER,
} from '../../../config/constants'

class FillProjectDetails extends Component {
  constructor(props) {
    super(props)
    this.createMarkup = this.createMarkup.bind(this)
    this.handleStepChange = this.handleStepChange.bind(this)
    this.openUserSettings = this.openUserSettings.bind(this)
    this.closeUserSettings = this.closeUserSettings.bind(this)
    this.onCreateProject = this.onCreateProject.bind(this)
    this.onRequireCheckUserSetting = this.onRequireCheckUserSetting.bind(this)
    this.state = {
      project: {},
      currentWizardStep: null,
      showUpdateUser: false,
      isSavingProject: false,
      requireCheckUserSetting: false,
    }
    props.resetProfileSetting()
  }

  componentWillMount() {
    this.componentWillReceiveProps(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ project: nextProps.project })
  }

  handleStepChange(currentWizardStep) {
    this.setState({ currentWizardStep })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(
      _.isEqual(nextProps.project, this.props.project) &&
      _.isEqual(nextProps.dirtyProject, this.props.dirtyProject) &&
      _.isEqual(nextState.project, this.state.project) &&
      _.isEqual(nextProps.error, this.props.error) &&
      _.isEqual(nextState.currentWizardStep, this.state.currentWizardStep) &&
      _.isEqual(nextState.showUpdateUser, this.state.showUpdateUser) &&
      _.isEqual(nextProps.projectTemplates, this.props.projectTemplates) &&
      _.isEqual(nextProps.isMissingUserInfo, this.props.isMissingUserInfo) &&
      _.isEqual(
        nextProps.isLoadedProfileSetting,
        this.props.isLoadedProfileSetting
      ) &&
      _.isEqual(
        nextProps.profileSettings.isLoading,
        this.props.profileSettings.isLoading
      ) &&
      _.isEqual(
        nextProps.profileSettings.pending,
        this.props.profileSettings.pending
      )
    )
  }

  createMarkup(projectTemplate) {
    return {
      __html: _.get(
        projectTemplate,
        'scope.formTitle',
        `Let's setup your ${projectTemplate.name} project`
      ),
    }
  }

  openUserSettings() {
    this.setState({ showUpdateUser: true })
  }

  closeUserSettings() {
    const { isMissingUserInfo } = this.props
    this.setState({
      showUpdateUser: false,
      ... (
        isMissingUserInfo ? {
          requireCheckUserSetting: false
        } : {}
      )
    })
  }

  onRequireCheckUserSetting(isRequire, cb) {
    this.setState({ requireCheckUserSetting: isRequire }, cb)
  }

  onCreateProject(newProject) {
    this.setState({ requireCheckUserSetting: false }, () => {
      this.props.onCreateProject(newProject)
    })
  }

  render() {
    const {
      project,
      processing,
      submitBtnText,
      projectTemplates,
      dirtyProject,
      productTemplates,
      productCategories,
      shouldUpdateTemplate,
      getProfileSettings,
      profileSettings,
      isMissingUserInfo,
      isLoadedProfileSetting,
    } = this.props
    const {
      currentWizardStep,
      showUpdateUser,
      isSavingProject,
      requireCheckUserSetting,
    } = this.state
    const projectTemplateId = _.get(project, 'templateId')
    const projectTemplate = _.find(projectTemplates, { id: projectTemplateId })
    const formDisclaimer = _.get(projectTemplate, 'scope.formDisclaimer')
    const showLoading = (isSavingProject ||
      profileSettings.isLoading ||
      profileSettings.pending)
    const template = projectTemplate.scope

    let header = null

    if (!_.get(template, 'wizard.enabled')) {
      header = (
        <div className="text-header-wrapper">
          <h1 dangerouslySetInnerHTML={this.createMarkup(projectTemplate)} />
        </div>
      )
    } else {
      const currentSection =
        currentWizardStep && template.sections[currentWizardStep.sectionIndex]

      if (
        !currentSection ||
        (currentSection && !currentSection.hideFormHeader)
      ) {
        header = (
          <HeaderWithProgress
            template={template}
            currentWizardStep={currentWizardStep}
            project={dirtyProject}
            hidePrice={template.hidePrice}
          />
        )
      }
    }

    return (
      <div
        className={cn('FillProjectDetailsWrapper', {
          [`form-theme-${template.theme}`]: template.theme,
        })}
      >
        {showUpdateUser && (
          <div className={`${showLoading ? 'hide': ''}`}>
            <UpdateUserInfo
              {...this.props}
              closeUserSettings={this.closeUserSettings}
            />
          </div>
        )}

        <div className={`FillProjectDetails ${(showUpdateUser || showLoading) ? 'hide' : ''}`}>
          <div className="header">{header}</div>
          <section className="two-col-content content">
            <div className="container">
              <div className="left-area">
                <div className="left-area-content">
                  <ProjectBasicDetailsForm
                    getProfileSettings={getProfileSettings}
                    profileSettings={profileSettings}
                    project={project}
                    dirtyProject={dirtyProject}
                    template={template}
                    isEditable
                    submitHandler={this.onCreateProject}
                    addAttachment={this.props.addAttachment}
                    updateAttachment={this.props.updateAttachment}
                    removeAttachment={this.props.removeAttachment}
                    attachmentsStorePath={this.props.attachmentsStorePath}
                    canManageAttachments={this.props.canManageAttachments}
                    saving={processing}
                    onProjectChange={this.props.onProjectChange}
                    submitBtnText={submitBtnText}
                    productTemplates={productTemplates}
                    onStepChange={this.handleStepChange}
                    productCategories={productCategories}
                    shouldUpdateTemplate={shouldUpdateTemplate}
                    isMissingUserInfo={isMissingUserInfo}
                    isLoadedProfileSetting={isLoadedProfileSetting}
                    openUserSettings={this.openUserSettings}
                    onRequireCheckUserSetting={this.onRequireCheckUserSetting}
                    requireCheckUserSetting={requireCheckUserSetting}
                  />
                </div>
                {formDisclaimer && (
                  <div className="left-area-footer">
                    <span>{formDisclaimer}</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {showLoading && (
          <div className="loading-container">
            <div className="loading">
              <LoadingIndicator />
            </div>
          </div>
        )}
      </div>
    )
  }
}

FillProjectDetails.defaultProps = {
  shouldUpdateTemplate: false,
}

FillProjectDetails.propTypes = {
  // onProjectChange: PT.func.isRequired,
  onBackClick: PT.func.isRequired,
  onCreateProject: PT.func.isRequired,
  onChangeProjectType: PT.func.isRequired,
  project: PT.object.isRequired,
  projectTemplates: PT.array.isRequired,
  productTemplates: PT.array.isRequired,
  productCategories: PT.array.isRequired,
  userRoles: PT.arrayOf(PT.string),
  processing: PT.bool,
  templates: PT.array.isRequired,
  error: PT.oneOfType([PT.bool, PT.object]),
  shouldUpdateTemplate: PT.bool,
  profileSettings: PT.object.isRequired,
  getProfileSettings: PT.func.isRequired,
  isMissingUserInfo: PT.bool.isRequired,
  isLoadedProfileSetting: PT.bool.isRequired,
}

const mapStateToProps = ({ settings, loadUser }) => {
  const powerUserRoles = [
    ROLE_CONNECT_COPILOT,
    ROLE_CONNECT_MANAGER,
    ROLE_CONNECT_ACCOUNT_MANAGER,
    ROLE_CONNECT_ADMIN,
    ROLE_ADMINISTRATOR,
    ROLE_CONNECT_COPILOT_MANAGER,
  ]
  const managerRoles = [
    ROLE_ADMINISTRATOR,
    ROLE_CONNECT_ADMIN,
    ROLE_CONNECT_MANAGER,
  ]
  const topCoderRoles = [
    ROLE_CONNECT_COPILOT,
    ROLE_CONNECT_MANAGER,
    ROLE_CONNECT_ACCOUNT_MANAGER,
    ROLE_CONNECT_ADMIN,
    ROLE_ADMINISTRATOR,
    ROLE_CONNECT_COPILOT_MANAGER,
    ROLE_BUSINESS_DEVELOPMENT_REPRESENTATIVE,
    ROLE_PRESALES,
    ROLE_ACCOUNT_EXECUTIVE,
    ROLE_PROGRAM_MANAGER,
    ROLE_SOLUTION_ARCHITECT,
    ROLE_PROJECT_MANAGER,
  ]
  const isTopcoderUser = _.intersection(loadUser.user.roles, topCoderRoles).length > 0
  let isMissingUserInfo = true
  const profileSettings = formatProfileSettings(settings.profile.traits)
  if (isTopcoderUser) {
    isMissingUserInfo =
      !profileSettings.firstName ||
      !profileSettings.lastName ||
      !profileSettings.country ||
      !profileSettings.timeZone ||
      !profileSettings.workingHourStart ||
      !profileSettings.workingHourEnd
  } else {
    isMissingUserInfo =
      !profileSettings.firstName ||
      !profileSettings.lastName ||
      !profileSettings.title ||
      !profileSettings.companyName ||
      !profileSettings.businessEmail ||
      !profileSettings.businessPhone
  }

  return {
    profileSettings: {
      ...settings.profile,
      settings: profileSettings,
    },
    isLoadedProfileSetting: !_.isEmpty(profileSettings),
    user: loadUser.user,
    isCustomer:
      _.intersection(loadUser.user.roles, powerUserRoles).length === 0,
    isManager: _.intersection(loadUser.user.roles, managerRoles).length > 0,
    isCopilot: _.some(
      loadUser.user.roles,
      (role) => role === ROLE_CONNECT_COPILOT
    ),
    isTopcoderUser,
    isMissingUserInfo,
  }
}

const mapDispatchToProps = {
  getProfileSettings,
  saveProfileSettings,
  uploadProfilePhoto,
  resetProfileSetting,
}

export default connect(mapStateToProps, mapDispatchToProps)(FillProjectDetails)
