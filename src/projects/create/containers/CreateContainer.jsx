import _ from 'lodash'
import Cookies from 'js-cookie'
import qs from 'query-string'
import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { renderComponent, branch, compose, withProps } from 'recompose'
import { createProject as createProjectAction, fireProjectDirty, fireProjectDirtyUndo, clearLoadedProject } from '../../actions/project'
import { addProjectAttachment, updatePendingAttachment, removeProjectAttachment, removePendingAttachment } from '../../actions/projectAttachment'
import { loadProjectsMetadata } from '../../../actions/templates'
import CoderBot from '../../../components/CoderBot/CoderBot'
import spinnerWhileLoading from '../../../components/LoadingSpinner'
import ProjectWizard from '../components/ProjectWizard'
import { getProjectTemplateByAlias, getProjectTypeByKey, getProjectTypeByAlias } from '../../../helpers/templates'
import WizardWrapper from '../../../components/WizardWrapper'
import { ViewTypes } from 'appirio-tech-react-components/components/Wizard/Wizard'
import './CreateContainer.scss'
import ProjectTypeIcon from '../../../components/ProjectTypeIcon'
import { getNewProjectLink } from '../../../helpers/projectHelper'
import { getProductEstimate } from '../../../config/projectWizard'

import {
  CREATE_PROJECT_FAILURE,
  LS_INCOMPLETE_PROJECT,
  LS_INCOMPLETE_WIZARD,
  LS_INCOMPLETE_PROJECT_QUERY_PARAMS,
  SPECIAL_QUERY_PARAMS,
  PROJECT_STATUS_IN_REVIEW,
  ACCOUNTS_APP_REGISTER_URL,
  NEW_PROJECT_PATH,
  GA_CLIENT_ID,
  GA_CLICK_ID,
  ACCOUNTS_APP_LOGIN_URL,
  PROJECT_CATALOG_URL
} from '../../../config/constants'

const page404 = compose(
  withProps({code:500})
)
// this handles showing error page when there is an error in loading the page
const showCoderBotIfError = (hasError) =>
  branch(
    hasError,
    renderComponent(page404(CoderBot)),
    t => t
  )
const errorHandler = showCoderBotIfError(props => props.error && props.error.type === CREATE_PROJECT_FAILURE)

// This handles showing a spinner while the state is being loaded async
const spinner = spinnerWhileLoading(props =>
  !props.processing &&
  !props.templates.isLoading &&
  props.templates.projectTemplates !== null &&
  props.templates.projectTypes !== null
)

const enhance = compose(errorHandler, spinner)

const CreateView = (props) => {
  const { match } = props
  if (match.path === '/new-project-callback') {
    // can do some fancy loading (e.g. coderbot animation) here
    return <div><CoderBot code={ 200 } message="Creating your project..." /></div>
  }
  return (
    <div styleName="create-container">
      <ProjectWizard {...props}/>
    </div>
  )
}
const EnhancedCreateView = enhance(CreateView)

class CreateContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      creatingProject: false,
      createdProject: false,
      isProjectDirty: false,
      wizardStep: 0,
      updatedProject: {},
      projectType: {},
    }
    this.createProject = this.createProject.bind(this)
    this.onLeave = this.onLeave.bind(this)
    this.closeWizard = this.closeWizard.bind(this)
    this.prepareProjectForCreation = this.prepareProjectForCreation.bind(this)
    this.addProjectAttachment = this.addProjectAttachment.bind(this)
    this.removeProjectAttachment = this.removeProjectAttachment.bind(this)
    this.updatePendingAttachment = this.updatePendingAttachment.bind(this)
    this.handleProjectUpdate = this.handleProjectUpdate.bind(this)
    this.handleWizardStepChange = this.handleWizardStepChange.bind(this)

    if (!props.userRoles || props.userRoles.length <= 0) {
      window.location = `${ACCOUNTS_APP_LOGIN_URL}?retUrl=${window.location.href}`
    }
  }

  componentWillReceiveProps(nextProps) {
    const projectId = _.get(this.props, 'project.id', null)
    const nextProjectId = _.get(nextProps, 'project.id', null)
    const { templates: { projectTemplates, projectTypes }, match: { params }} = nextProps

    // if templates are already loaded and project type is defined in URL
    if (projectTemplates && projectTypes && params && params.project) {
      const allProjectTypes = projectTemplates.concat(projectTypes)
      const projectTypeKey = params.project
      let projectType = getProjectTypeByKey(allProjectTypes, projectTypeKey)
      if (!projectType) {
        projectType = getProjectTypeByAlias(allProjectTypes, projectTypeKey)
      }
      if (projectType) {
        this.setState({ projectType })
      }
    }

    if (!nextProps.processing && !nextProps.error && nextProjectId && projectId !== nextProjectId) {
      // update state
      this.setState({
        processing: false,
        creatingProject: false,
        createdProject: true,
        projectId: nextProjectId,
        isProjectDirty: false
      }, () => {
        const type = _.get(this.state, 'updatedProject.type')
        // go to submitted state
        console.log('go to submitted state')
        window.localStorage.removeItem(LS_INCOMPLETE_PROJECT)
        window.localStorage.removeItem(LS_INCOMPLETE_WIZARD)
        this.props.history.push('/new-project/submitted/' + nextProjectId + (type ? `?type=${type}` : ''))
      })

    } else if (this.state.creatingProject !== nextProps.processing) {
      this.setState({ creatingProject : nextProps.processing })
    }

    // when route is changed, save incomplete project
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.onLeave()
    }
  }

  componentWillMount() {
    const { processing, userRoles, match, history,
      templates } = this.props
    let projectTemplate
    // if we are on the project page validate project param
    if (match.path === '/new-project/:project?/:status?') {
      const project = match.params.project
      projectTemplate = getProjectTemplateByAlias(templates.projectTemplates, project)

      if (
        // if project is defined in URL
        project &&
        // workaround to add URL for incomplete project confirmation step
        // ideally we should have better URL naming which resolves each route with distinct patterns
        project !== 'incomplete' &&
        // project templates are loaded
        templates.projectTemplates &&
        // if project template doesn't exist
        !projectTemplate
      ) {
        history.replace('/404')
      }
    }

    // load incomplete project from local storage
    const incompleteProjectStr = window.localStorage.getItem(LS_INCOMPLETE_PROJECT)
    if(incompleteProjectStr) {
      const incompleteProject = JSON.parse(incompleteProjectStr)
      if (match.path === '/new-project-callback' && !processing && userRoles && userRoles.length > 0) {
        // if project wizard is loaded after redirection from register page
        // TODO should we validate the project again?
        console.log('calling createProjectAction...')
        const projectEstimation = getProductEstimate(projectTemplate, incompleteProject)
        const projectWithEstimation = {
          ...incompleteProject,
          estimation: _.get(projectEstimation, 'estimateBlocks', []),
        }
        this.props.createProjectAction(projectWithEstimation, PROJECT_STATUS_IN_REVIEW)
      }
    } else {
      // if there is not incomplete project, clear the exisitng project from the redux state
      // dispatches action to clear the project in the redux state to ensure that we never have a project
      // in context when creating a new project
      this.props.clearLoadedProject()
    }

    // if metadata is not loaded yet - then load it
    if (!templates.projectTemplates && !templates.isLoading) {
      this.props.loadProjectsMetadata()
    }
  }

  componentDidMount() {
    // sets window unload hook save incomplete project
    window.addEventListener('beforeunload', this.onLeave)
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onLeave)
    // when we leave component, save incomplete project
    this.onLeave()
  }

  // stores the incomplete project in local storage
  onLeave(e) {// eslint-disable-line no-unused-vars
    const { wizardStep, isProjectDirty } = this.state
    const { templates: { projectTemplates }} = this.props

    if (wizardStep === ProjectWizard.Steps.WZ_STEP_FILL_PROJ_DETAILS && isProjectDirty) {// Project Details step

      const projectTemplateId = _.get(this.state.updatedProject, 'templateId')
      const projectTemplate = _.find(projectTemplates, pt => pt.id === projectTemplateId)
      this.prepareProjectForCreation(this.state.updatedProject, projectTemplate)
      console.log('saving incomplete project', this.state.updatedProject)
      window.localStorage.setItem(LS_INCOMPLETE_PROJECT, JSON.stringify(this.state.updatedProject))
    }
    // commenting alerts for the page unload and route change hooks as discussed
    // https://github.com/appirio-tech/connect-app/issues/1037#issuecomment-324732052

    // if (isProjectDirty && !creatingProject) {
    //   return e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
    // }
  }

  /**
   * Helper method to add additional details required to create project
   *
   * @param {Object} project project data captured from user
   * @param {Object} projectTemplate project template to be used
   */
  prepareProjectForCreation(project, projectTemplate) {
    const gaClickId  = Cookies.get(GA_CLICK_ID)
    const gaClientId = Cookies.get(GA_CLIENT_ID)
    if(gaClientId || gaClickId) {
      const googleAnalytics = {}
      if (gaClickId !== 'null') {
        googleAnalytics[GA_CLICK_ID]  = gaClickId
      }
      if (gaClientId !== 'null') {
        googleAnalytics[GA_CLIENT_ID] = gaClientId
      }
      _.set(project, 'details.utm.google', googleAnalytics)
    }
    const searchParams = new URLSearchParams(window.location.search)
    const isBetaMode = searchParams.get('beta') === 'true'
    if (projectTemplate) {
      project.version = isBetaMode ? 'v4' : 'v3'
      project.templateId = projectTemplate.id
      project.type = projectTemplate.category
    }
  }

  /**
   * Creates new project if user is already logged in, otherwise, redirects user for registration/login.
   */
  createProject(project) {
    const { templates: { projectTemplates }, pendingAttachments } = this.props
    const projectTemplate = _.find(projectTemplates, { id: _.get(project, 'templateId') })

    this.setState({ creatingProject: true }, () => {
      if (this.props.userRoles && this.props.userRoles.length > 0) {
        this.prepareProjectForCreation(project, projectTemplate)
        const projectEstimation = getProductEstimate(projectTemplate, project)
        const projectWithEstimation = {
          ...project,
          estimation: _.get(projectEstimation, 'estimateBlocks', []),
          attachments: _.get(pendingAttachments, 'attachments', [])
        }
        this.props.createProjectAction(projectWithEstimation)
      } else {
        // redirect to registration/login page
        const retUrl = window.location.origin + '/new-project-callback'
        window.location = ACCOUNTS_APP_REGISTER_URL + '?retUrl=' + retUrl
      }
    })
  }

  closeWizard() {
    const { userRoles, location, orgConfig } = this.props
    const isLoggedIn = userRoles && userRoles.length > 0
    // calls leave handler
    this.onLeave()
    const returnUrl = _.get(qs.parse(location.search), 'returnUrl', null)
    const orgConfigs = _.filter(orgConfig, (o) => { return o.configName === PROJECT_CATALOG_URL })


    if (returnUrl) {
      window.location = returnUrl
    } else if (isLoggedIn && orgConfigs.length === 1) {
      (/^https?:\/\//).test(orgConfigs[0].configValue) ? window.location = orgConfigs[0].configValue : this.props.history.push(orgConfigs[0].configValue)
    } else if (isLoggedIn) {
      this.props.history.push('/projects')
    } else {
      this.props.history.push('/')
      // FIXME ideally we should push on router
      // window.location = window.location.origin
    }
  }

  handleWizardStepChange(wizardStep, updatedProject) {
    const { templates: { projectTemplates, projectTypes }, orgConfig } = this.props
    const projectTypeKey = _.get(updatedProject, 'type', null)

    let projectType = getProjectTypeByKey(projectTypes, projectTypeKey)
    if (!projectType) {
      projectType = getProjectTypeByAlias(projectTypes, projectTypeKey)
    }

    const typeAlias = _.get(projectType, 'aliases[0]')

    const projectTemplateId = _.get(updatedProject, 'templateId', null)
    const projectTemplate = _.find(projectTemplates, pt => pt.id === projectTemplateId)
    const templateAlias = _.get(projectTemplate, 'aliases[0]')

    let link
    if (wizardStep === ProjectWizard.Steps.WZ_STEP_INCOMP_PROJ_CONF) {
      let productUrl = templateAlias ? ('/' + templateAlias) : ''
      productUrl = !templateAlias && typeAlias ? ('/' + typeAlias) : productUrl
      this.props.history.push(NEW_PROJECT_PATH + productUrl + '/incomplete' + window.location.search)
    }

    if (wizardStep === ProjectWizard.Steps.WZ_STEP_SELECT_PROJ_TYPE) {
      link = getNewProjectLink(orgConfig)
      if(/^https?:\/\//.test(link)) {
        window.location = link
      } else {
        this.props.history.push(link + '/' + window.location.search)
      }
    }

    if (typeAlias && wizardStep === ProjectWizard.Steps.WZ_STEP_SELECT_PROJ_TEMPLATE) {
      this.props.history.push(NEW_PROJECT_PATH + '/' + typeAlias + window.location.search)
    }

    if (typeAlias && templateAlias && wizardStep === ProjectWizard.Steps.WZ_STEP_FILL_PROJ_DETAILS) {
      const incompleteProjectQueryParamsStr = window.localStorage.getItem(LS_INCOMPLETE_PROJECT_QUERY_PARAMS)
      const incompleteQueryParams = incompleteProjectQueryParamsStr ? JSON.parse(incompleteProjectQueryParamsStr) : {}
      const queryParams = qs.parse(window.location.search)
      const isQueryParamsChanged = !_.isEqual(
        _.omit(queryParams, SPECIAL_QUERY_PARAMS),
        _.omit(incompleteQueryParams, SPECIAL_QUERY_PARAMS)
      )
      // if we are coming to the details step and we see that query params has been changed
      // since we left incomplete project, this mean that we chose continue incomplete project
      // when we changed URL and started again, so we should restore the query params of incomplete project
      const queryParamsToApply = isQueryParamsChanged ? '?' + qs.stringify(incompleteQueryParams) : window.location.search
      this.props.history.push(NEW_PROJECT_PATH + '/' + templateAlias + queryParamsToApply)
    }

    if (typeAlias && templateAlias && wizardStep === ProjectWizard.Steps.WZ_STEP_PROJECT_SUBMITTED) {
      this.props.history.push(NEW_PROJECT_PATH + '/' + 'submitted' + window.location.search)
    }

    this.setState({
      wizardStep,
    })
  }

  handleProjectUpdate(updatedProject, dirty=true) {
    this.setState({
      isProjectDirty: dirty,
      updatedProject
    })
  }

  addProjectAttachment(attachment) {
    this.props.addProjectAttachment(this.props.project.id, attachment)
  }

  removeProjectAttachment(attachmentId) {
    const attachmentIdx = attachmentId.substr(4)
    this.props.removePendingAttachment(attachmentIdx)
  }

  updatePendingAttachment(attachmentId, updatedAttachment) {
    const attachmentIdx = attachmentId.substr(4)
    this.props.updatePendingAttachment(attachmentIdx, updatedAttachment)
  }

  render() {
    const { wizardStep, projectType } = this.state
    let type = 'unknown'
    if (wizardStep <= ProjectWizard.Steps.WZ_STEP_SELECT_PROJ_TYPE) {
      type = ViewTypes.selectSolution
    } else if (wizardStep <= ProjectWizard.Steps.WZ_STEP_FILL_PROJ_DETAILS) {
      type = ViewTypes.definedScope
    } else if (wizardStep === ProjectWizard.Steps.WZ_STEP_PROJECT_SUBMITTED) {
      type = ViewTypes.projectSubmitted
    }

    if (projectType && projectType.icon) {
      projectType.iconUI = <ProjectTypeIcon type={projectType.icon} />
    }

    return (
      <WizardWrapper className="WizardCreateProject" type={type}>
        <EnhancedCreateView
          {...this.props}
          createProject={this.createProject}
          processing={this.state.creatingProject}
          createdProject={this.state.createdProject}
          projectId={this.state.projectId}
          showModal
          closeModal={this.closeWizard}
          onStepChange={this.handleWizardStepChange}
          onProjectUpdate={this.handleProjectUpdate}
          projectTemplates={this.props.templates.projectTemplates}
          projectTypes={this.props.templates.projectTypes}
          addAttachment={this.addProjectAttachment}
          updateAttachment={this.updatePendingAttachment}
          removeAttachment={this.removeProjectAttachment}
        />
      </WizardWrapper>
    )
  }


}

CreateContainer.propTypes = {
  userRoles: PropTypes.arrayOf(PropTypes.string).isRequired
}

CreateContainer.defaultProps = {
  userRoles: []
}

const mapStateToProps = ({projectState, loadUser, templates }) => ({
  userHandle: _.get(loadUser, 'user.handle', []),
  userRoles: _.get(loadUser, 'user.roles', []),
  orgConfig: _.get(loadUser, 'orgConfig', []),
  processing: projectState.processing,
  error: projectState.error,
  project: projectState.project,
  pendingAttachments: projectState.attachmentsAwaitingPermission,
  templates,
})

const actionCreators = {
  createProjectAction,
  fireProjectDirty,
  fireProjectDirtyUndo,
  clearLoadedProject,
  loadProjectsMetadata,
  addProjectAttachment,
  updatePendingAttachment,
  removeProjectAttachment,
  removePendingAttachment,
}

export default withRouter(connect(mapStateToProps, actionCreators)(CreateContainer))
