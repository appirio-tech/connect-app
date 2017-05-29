import _ from 'lodash'
import React, { PropTypes } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { renderComponent, branch, compose, withProps } from 'recompose'
import { createProject as createProjectAction, fireProjectDirty, fireProjectDirtyUndo } from '../../actions/project'
import CoderBot from '../../../components/CoderBot/CoderBot'
import spinnerWhileLoading from '../../../components/LoadingSpinner'
import ProjectWizard from '../components/ProjectWizard'
import { CREATE_PROJECT_FAILURE, LS_INCOMPLETE_PROJECT } from '../../../config/constants'

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
  const { route, error } = props
  if (route.path === '/new-project-callback') {
    // can do some fancy loading (e.g. coderbot animation) here
    return <div><CoderBot code={ 200 } message='Creating your project...' /></div>
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
      // close modal (if shown as modal), remove incomplete project, and navigate to project dashboard
      // this.props.closeModal()
      this.setState({
        creatingProject: false,
        isProjectDirty: false
      }, () => {
        console.log('removing incomplete project')
        window.localStorage.removeItem(LS_INCOMPLETE_PROJECT)
        this.props.router.push('/projects/' + projectId)  
      })
      
    } else if (this.state.creatingProject != nextProps.processing) {
      this.setState({ creatingProject : nextProps.processing })
    }
  }

  componentWillMount() {
    console.log('CreateContainer#componentWillMount')
    const { processing, userRoles, route } = this.props
    // load incomplete project from local storage
    const incompleteProjectStr = window.localStorage.getItem(LS_INCOMPLETE_PROJECT)
    if(incompleteProjectStr) {
      const incompleteProject = JSON.parse(incompleteProjectStr)
      if (route.path === '/new-project-callback' && !processing && userRoles && userRoles.length > 0) {
        // if project wizard is loaded after redirection from register page
        // TODO should we validate the project again?
        console.log('calling createProjectAction...')
        this.props.createProjectAction(incompleteProject)
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
  onLeave(e) {
    const { wizardStep, isProjectDirty, creatingProject } = this.state
    if (wizardStep === ProjectWizard.Steps.WZ_STEP_FILL_PROJ_DETAILS && isProjectDirty) {// Project Details step
      console.log('saving incomplete project')
      window.localStorage.setItem(LS_INCOMPLETE_PROJECT, JSON.stringify(this.state.updatedProject))
    }
    if (isProjectDirty && !creatingProject) {
      return e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
    }
  }

  /**
   * Creates new project if user is already logged in, otherwise, redirects user for registration/login.
   */
  createProject(project) {
    this.setState({ creatingProject: true }, () => {
      if (this.props.userRoles && this.props.userRoles.length > 0) {
        // if user is logged in and has a valid role, create project
        // uses dirtyProject from the state as it has the latest changes from the user
        this.props.createProjectAction(project)
      } else {
        // redirect to registration/login page
        const retUrl = window.location.origin + '/new-project-callback'
        window.location = 'https://accounts.topcoder-dev.com/#!/connect?retUrl=' + retUrl
      }
    })
  }

  render() {
    return (
      <EnhancedCreateView
        {...this.props}
        createProject={ this.createProject }
        processing={ this.state.creatingProject }
        onStepChange={ (wizardStep) => this.setState({
          wizardStep
        })}
        onProjectUpdate={ (updatedProject) => this.setState({
          isProjectDirty: true,
          updatedProject
        })}
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
