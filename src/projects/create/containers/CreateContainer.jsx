import _ from 'lodash'
import React, { PropTypes } from 'react'
import { withRouter, browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { renderComponent, branch, compose, withProps } from 'recompose'
import { createProjectWithStatus as createProjectAction, fireProjectDirty, fireProjectDirtyUndo } from '../../actions/project'
import CoderBot from '../../../components/CoderBot/CoderBot'
import spinnerWhileLoading from '../../../components/LoadingSpinner'
import ProjectWizard from '../components/ProjectWizard'
import { findProduct, findCategory } from '../../../config/projectWizard'
import {
  CREATE_PROJECT_FAILURE,
  LS_INCOMPLETE_PROJECT,
  PROJECT_STATUS_IN_REVIEW,
  ACCOUNTS_APP_REGISTER_URL,
  NEW_PROJECT_PATH
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
const spinner = spinnerWhileLoading(props => !props.processing)

const enhance = compose(errorHandler, spinner)

const CreateView = (props) => {
  const { route } = props
  if (route.path === '/new-project-callback') {
    // can do some fancy loading (e.g. coderbot animation) here
    return <div><CoderBot code={ 200 } message="Creating your project..." /></div>
  }
  return (
    <div>
      <ProjectWizard {...props}/>
    </div>
  )
}
const EnhancedCreateView = enhance(CreateView)

class CreateConainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      creatingProject : false,
      isProjectDirty: false,
      wizardStep: 0,
      updatedProject: {}
    }
    this.createProject = this.createProject.bind(this)
    this.onLeave = this.onLeave.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const projectId = _.get(nextProps, 'project.id', null)
    if (!nextProps.processing && !nextProps.error && projectId) {
      // update state
      this.setState({
        creatingProject: false,
        isProjectDirty: false
      }, () => {
        // remove incomplete project, and navigate to project dashboard
        console.log('removing incomplete project')
        window.localStorage.removeItem(LS_INCOMPLETE_PROJECT)
        this.props.router.push('/projects/' + projectId)
      })

    } else if (this.state.creatingProject !== nextProps.processing) {
      this.setState({ creatingProject : nextProps.processing })
    }
  }

  componentWillMount() {
    const { processing, userRoles, route } = this.props
    // load incomplete project from local storage
    const incompleteProjectStr = window.localStorage.getItem(LS_INCOMPLETE_PROJECT)
    if(incompleteProjectStr) {
      const incompleteProject = JSON.parse(incompleteProjectStr)
      if (route.path === '/new-project-callback' && !processing && userRoles && userRoles.length > 0) {
        // if project wizard is loaded after redirection from register page
        // TODO should we validate the project again?
        console.log('calling createProjectAction...')
        this.props.createProjectAction(incompleteProject, PROJECT_STATUS_IN_REVIEW)
      }
    }
  }

  componentDidMount() {
    // sets route leave hook to show unsaved changes alert and persist incomplete project
    this.props.router.setRouteLeaveHook(this.props.route, this.onLeave)

    // sets window unload hook to show unsaved changes alert and persist incomplete project
    window.addEventListener('beforeunload', this.onLeave)
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onLeave)
  }

  // stores the incomplete project in local storage
  onLeave(e) {// eslint-disable-line no-unused-vars
    const { wizardStep } = this.state
    if (wizardStep === ProjectWizard.Steps.WZ_STEP_FILL_PROJ_DETAILS) {// Project Details step
      console.log('saving incomplete project')
      window.localStorage.setItem(LS_INCOMPLETE_PROJECT, JSON.stringify(this.state.updatedProject))
    }
    // commenting alerts for the page unload and route change hooks as discussed
    // https://github.com/appirio-tech/connect-app/issues/1037#issuecomment-324732052

    // if (isProjectDirty && !creatingProject) {
    //   return e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
    // }
  }

  /**
   * Creates new project if user is already logged in, otherwise, redirects user for registration/login.
   */
  createProject(project) {
    this.setState({ creatingProject: true }, () => {
      if (this.props.userRoles && this.props.userRoles.length > 0) {
        // if user is logged in and has a valid role, create project
        // uses dirtyProject from the state as it has the latest changes from the user
        // this.props.createProjectAction(project)
        this.props.createProjectAction(project, PROJECT_STATUS_IN_REVIEW)
      } else {
        // redirect to registration/login page
        const retUrl = window.location.origin + '/new-project-callback'
        window.location = ACCOUNTS_APP_REGISTER_URL + '?retUrl=' + retUrl
      }
    })
  }

  render() {
    return (
      <EnhancedCreateView
        {...this.props}
        createProject={ this.createProject }
        processing={ this.state.creatingProject }
        onStepChange={ (wizardStep, updatedProject) => {
          // type of the project
          let projectType = _.get(updatedProject, 'type', null)
          // finds project category object from the catalogue
          const projectCategory = findCategory(projectType)
          // updates the projectType variable to use first alias to create SEO friendly URL
          projectType = _.get(projectCategory, 'aliases[0]', projectType)
          // product of the project
          let productType = _.get(updatedProject, 'details.products[0]', null)
          // finds product object from the catalogue
          const product = findProduct(productType)
          // updates the productType variable to use first alias to create SEO friendly URL
          productType = _.get(product, 'aliases[0]', productType)
          if (wizardStep === ProjectWizard.Steps.WZ_STEP_INCOMP_PROJ_CONF) {
            browserHistory.push(NEW_PROJECT_PATH + '/incomplete')
          }
          if (wizardStep === ProjectWizard.Steps.WZ_STEP_SELECT_PROJ_TYPE) {
            browserHistory.push(NEW_PROJECT_PATH + '/' + window.location.search)
          }
          if (projectType && wizardStep === ProjectWizard.Steps.WZ_STEP_SELECT_PROD_TYPE) {
            browserHistory.push(NEW_PROJECT_PATH + '/' + projectType + window.location.search)
          }
          if (projectType && productType && wizardStep === ProjectWizard.Steps.WZ_STEP_FILL_PROJ_DETAILS) {
            browserHistory.push(NEW_PROJECT_PATH + '/' + productType + window.location.search)
          }
          this.setState({
            wizardStep
          })
        }
        }
        onProjectUpdate={ (updatedProject, dirty=true) => {
          // const projectType = _.get(this.state.updatedProject, 'type', null)
          const prevProduct = _.get(this.state.updatedProject, 'details.products[0]', null)
          const product = _.get(updatedProject, 'details.products[0]', null)
            // compares updated product with previous product to know if user has updated the product
          if (prevProduct !== product) {
            if (product) {
              // intentionally commented because now it should not be require as we handling all URL changes in onStepChange
              // earlier we were not getting updated project in onStepChange handler, hence it was required here
              // still leaving it here for next few release, in case we find any issue because of commenting this line
              // browserHistory.push(NEW_PROJECT_PATH + '/' + product + window.location.search)
            }
          }
          this.setState({
            isProjectDirty: dirty,
            updatedProject
          })
        }
        }
      />
    )
  }
}

CreateConainer.propTypes = {
  userRoles: PropTypes.arrayOf(PropTypes.string).isRequired
}

CreateConainer.defaultProps = {
  userRoles: []
}

const mapStateToProps = ({projectState, loadUser }) => ({
  userRoles: _.get(loadUser, 'user.roles', []),
  processing: projectState.processing,
  error: projectState.error,
  project: projectState.project
})
const actionCreators = { createProjectAction, fireProjectDirty, fireProjectDirtyUndo  }
export default withRouter(connect(mapStateToProps, actionCreators)(CreateConainer))
