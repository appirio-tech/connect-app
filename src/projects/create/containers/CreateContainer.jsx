import _ from 'lodash'
import Cookies from 'js-cookie'
import qs from 'query-string'
import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { renderComponent, branch, compose, withProps } from 'recompose'
import { createProject as createProjectAction, fireProjectDirty, fireProjectDirtyUndo, clearLoadedProject } from '../../actions/project'
import { loadProjectsMetadata } from '../../../actions/templates'
import CoderBot from '../../../components/CoderBot/CoderBot'
import spinnerWhileLoading from '../../../components/LoadingSpinner'
import ProjectWizard from '../components/ProjectWizard'
import { getProjectTemplateByAlias, getProjectTypeByKey, getProjectTypeByAlias } from '../../../helpers/templates'
import { Wizard } from 'appirio-tech-react-components'
import { ViewTypes } from 'appirio-tech-react-components/components/Wizard/Wizard'
import './CreateContainer.scss'
import ProjectTypeIcon from '../../../components/ProjectTypeIcon'

import {
  CREATE_PROJECT_FAILURE,
  LS_INCOMPLETE_PROJECT,
  LS_INCOMPLETE_WIZARD,
  PROJECT_STATUS_IN_REVIEW,
  ACCOUNTS_APP_REGISTER_URL,
  NEW_PROJECT_PATH,
  GA_CLIENT_ID,
  GA_CLICK_ID,
  CONNECT_MAIN_PAGE_URL
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
    this.createContainerView = this.createContainerView.bind(this)

    if (!props.userRoles || props.userRoles.length <= 0) {
      window.location = CONNECT_MAIN_PAGE_URL
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
        // go to submitted state
        console.log('go to submitted state')
        window.localStorage.removeItem(LS_INCOMPLETE_PROJECT)
        window.localStorage.removeItem(LS_INCOMPLETE_WIZARD)
        this.props.history.push('/new-project/submitted/' + nextProjectId)
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
    // if we are on the project page validate project param
    if (match.path === '/new-project/:project?/:status?') {
      const project = match.params.project

      if (
        // if project is defined in URL
        project &&
        // workaround to add URL for incomplete project confirmation step
        // ideally we should have better URL naming which resolves each route with distinct patterns
        project !== 'incomplete' &&
        // project templates are loaded
        templates.projectTemplates &&
        // if project template doesn't exist
        !getProjectTemplateByAlias(templates.projectTemplates, project)
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
        this.props.createProjectAction(incompleteProject, PROJECT_STATUS_IN_REVIEW)
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
    if (projectTemplate) {
      project.version = 'v3'
      project.templateId = projectTemplate.id
      project.type = projectTemplate.category
    }
  }

  /**
   * Creates new project if user is already logged in, otherwise, redirects user for registration/login.
   */
  createProject(project) {
    const { templates: { projectTemplates }} = this.props
    const projectTemplate = _.find(projectTemplates, _.get(project, 'templateId'))

    this.setState({ creatingProject: true }, () => {
      if (this.props.userRoles && this.props.userRoles.length > 0) {
        this.prepareProjectForCreation(project, projectTemplate)
        this.props.createProjectAction(project)
      } else {
        // redirect to registration/login page
        const retUrl = window.location.origin + '/new-project-callback'
        window.location = ACCOUNTS_APP_REGISTER_URL + '?retUrl=' + retUrl
      }
    })
  }

  closeWizard() {
    const { userRoles, location } = this.props
    const isLoggedIn = userRoles && userRoles.length > 0
    // calls leave handler
    this.onLeave()
    const returnUrl = _.get(qs.parse(location.search), 'returnUrl', null)
    if (returnUrl) {
      window.location = returnUrl
    } else {
      if (isLoggedIn) {
        this.props.history.push('/projects')
      } else {
        this.props.history.push('/')
        // FIXME ideally we should push on router
        // window.location = window.location.origin
      }
    }
  }

  createContainerView() {
    const { templates: { projectTemplates, projectTypes }} = this.props

    return (
      <EnhancedCreateView
        {...this.props}
        createProject={ this.createProject }
        processing={ this.state.creatingProject}
        createdProject={ this.state.createdProject }
        projectId={ this.state.projectId }
        showModal
        closeModal={ this.closeWizard }
        onStepChange={ (wizardStep, updatedProject) => {
          const projectTypeKey = _.get(updatedProject, 'type', null)
          let projectType = getProjectTypeByKey(projectTypes, projectTypeKey)
          if (!projectType) {
            projectType = getProjectTypeByAlias(projectTypes, projectTypeKey)
          }

          const typeAlias = _.get(projectType, 'aliases[0]')

          const projectTemplateId = _.get(updatedProject, 'templateId', null)
          const projectTemplate = _.find(projectTemplates, pt => pt.id === projectTemplateId)
          const templateAlias = _.get(projectTemplate, 'aliases[0]')

          if (wizardStep === ProjectWizard.Steps.WZ_STEP_INCOMP_PROJ_CONF) {
            let productUrl = templateAlias ? ('/' + templateAlias) : ''
            productUrl = !templateAlias && typeAlias ? ('/' + typeAlias) : productUrl
            this.props.history.push(NEW_PROJECT_PATH + productUrl + '/incomplete' + window.location.search)
          }

          if (wizardStep === ProjectWizard.Steps.WZ_STEP_SELECT_PROJ_TYPE) {
            this.props.history.push(NEW_PROJECT_PATH + '/' + window.location.search)
          }

          if (typeAlias && wizardStep === ProjectWizard.Steps.WZ_STEP_SELECT_PROJ_TEMPLATE) {
            this.props.history.push(NEW_PROJECT_PATH + '/' + typeAlias + window.location.search)
          }

          if (typeAlias && templateAlias && wizardStep === ProjectWizard.Steps.WZ_STEP_FILL_PROJ_DETAILS) {
            this.props.history.push(NEW_PROJECT_PATH + '/' + templateAlias + window.location.search)
          }

          if (typeAlias && templateAlias && wizardStep === ProjectWizard.Steps.WZ_STEP_PROJECT_SUBMITTED) {
            this.props.history.push(NEW_PROJECT_PATH + '/' + 'submitted' + window.location.search)
          }

          this.setState({
            wizardStep,
          })
        }
        }
        onProjectUpdate={ (updatedProject, dirty=true) => {
          // const projectType = _.get(this.state.updatedProject, 'type', null)
          const prevProduct = _.get(this.state.updatedProject, 'templateId', null)
          const product = _.get(updatedProject, 'templateId', null)
          // compares updated product with previous product to know if user has updated the product
          if (prevProduct !== product) {
            if (product) {
              // intentionally commented because now it should not be require as we handling all URL changes in onStepChange
              // earlier we were not getting updated project in onStepChange handler, hence it was required here
              // still leaving it here for next few release, in case we find any issue because of commenting this line
              // this.props.history.push(NEW_PROJECT_PATH + '/' + product + window.location.search)
            }
          }
          this.setState({
            isProjectDirty: dirty,
            updatedProject
          })
        }
        }
        projectTemplates={this.props.templates.projectTemplates}
        projectTypes={this.props.templates.projectTypes}
      />
    )
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
      <Wizard wrapperClass="WizardCreateProject" type={type} vm={{userHandle: this.props.userHandle, projectType: projectType || {}}} >
        { this.createContainerView() }
      </Wizard>
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
  processing: projectState.processing,
  error: projectState.error,
  project: projectState.project,
  templates,
})

const actionCreators = {
  createProjectAction,
  fireProjectDirty,
  fireProjectDirtyUndo,
  clearLoadedProject,
  loadProjectsMetadata,
}

export default withRouter(connect(mapStateToProps, actionCreators)(CreateContainer))
