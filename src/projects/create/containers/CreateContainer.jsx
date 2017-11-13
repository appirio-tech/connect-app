import _ from 'lodash'
import Cookies from 'js-cookie'
import React, { PropTypes } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { renderComponent, branch, compose, withProps } from 'recompose'
import { createProject as createProjectAction, fireProjectDirty, fireProjectDirtyUndo, clearLoadedProject } from '../../actions/project'
import CoderBot from '../../../components/CoderBot/CoderBot'
import spinnerWhileLoading from '../../../components/LoadingSpinner'
import ProjectWizard from '../components/ProjectWizard'
import { findProduct, findCategory, findProductCategory } from '../../../config/projectWizard'
import {
  CREATE_PROJECT_FAILURE,
  LS_INCOMPLETE_PROJECT,
  PROJECT_STATUS_IN_REVIEW,
  ACCOUNTS_APP_REGISTER_URL,
  NEW_PROJECT_PATH,
  GA_CLIENT_ID,
  GA_CLICK_ID
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
  const { match } = props
  if (match.path === '/new-project-callback') {
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
    this.closeWizard = this.closeWizard.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const projectId = _.get(this.props, 'project.id', null)
    const nextProjectId = _.get(nextProps, 'project.id', null)
    if (!nextProps.processing && !nextProps.error && !projectId && nextProjectId) {
      // update state
      this.setState({
        creatingProject: false,
        isProjectDirty: false
      }, () => {
        // remove incomplete project, and navigate to project dashboard
        console.log('removing incomplete project')
        window.localStorage.removeItem(LS_INCOMPLETE_PROJECT)
        this.props.history.push('/projects/' + nextProjectId)
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
    const { processing, userRoles, match, history } = this.props
    // if we are on the project page validate product param
    if (match.path === '/new-project/:product?/:status?') {
      const product = match.params.product
      // first try the path param to be a project category
      let productCategory = findCategory(product, true)
      // if it is not a category, it should be a product and we should be able to find a category for it
      productCategory = !productCategory ? findProductCategory(product, true) : productCategory
      if (product && product.trim().length > 0 && !productCategory) {
        // workaround to add URL for incomplete project confirmation step
        // ideally we should have better URL naming which resolves each route with distinct patterns
        if (product !== 'incomplete') {
          history.replace('/404')
        }
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
    if (wizardStep === ProjectWizard.Steps.WZ_STEP_FILL_PROJ_DETAILS && isProjectDirty) {// Project Details step
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
   * Creates new project if user is already logged in, otherwise, redirects user for registration/login.
   */
  createProject(project) {
    this.setState({ creatingProject: true }, () => {
      if (this.props.userRoles && this.props.userRoles.length > 0) {
        // if user is logged in and has a valid role, create project
        // uses dirtyProject from the state as it has the latest changes from the user
        // this.props.createProjectAction(project)
        const gaClickId  = Cookies.get(GA_CLICK_ID)
        const gaClientId = Cookies.get(GA_CLIENT_ID)
        if(gaClientId || gaClickId) {
          const googleAnalytics = {}
          googleAnalytics[GA_CLICK_ID]  = gaClickId
          googleAnalytics[GA_CLIENT_ID] = gaClientId
          _.set(project, 'details.utm.google', googleAnalytics)
        }
        this.props.createProjectAction(project, PROJECT_STATUS_IN_REVIEW)
      } else {
        // redirect to registration/login page
        const retUrl = window.location.origin + '/new-project-callback'
        window.location = ACCOUNTS_APP_REGISTER_URL + '?retUrl=' + retUrl
      }
    })
  }

  closeWizard() {
    const { userRoles } = this.props
    const isLoggedIn = userRoles && userRoles.length > 0
    // calls leave handler
    this.onLeave()
    if (isLoggedIn) {
      this.props.history.push('/projects')
    } else {
      // this.props.history.push('/')
      // FIXME ideally we should push on router
      window.location = window.location.origin
    }
  }

  render() {
    return (
      <EnhancedCreateView
        {...this.props}
        createProject={ this.createProject }
        processing={ this.state.creatingProject }
        showModal
        closeModal={ this.closeWizard }
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
            let productUrl = productType ? ('/' + productType) : ''
            productUrl = !productType && projectType ? ('/' + projectType) : productUrl
            this.props.history.push(NEW_PROJECT_PATH + productUrl + '/incomplete' + window.location.search)
          }
          if (wizardStep === ProjectWizard.Steps.WZ_STEP_SELECT_PROJ_TYPE) {
            this.props.history.push(NEW_PROJECT_PATH + '/' + window.location.search)
          }
          if (projectType && wizardStep === ProjectWizard.Steps.WZ_STEP_SELECT_PROD_TYPE) {
            this.props.history.push(NEW_PROJECT_PATH + '/' + projectType + window.location.search)
          }
          if (projectType && productType && wizardStep === ProjectWizard.Steps.WZ_STEP_FILL_PROJ_DETAILS) {
            this.props.history.push(NEW_PROJECT_PATH + '/' + productType + window.location.search)
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
              // this.props.history.push(NEW_PROJECT_PATH + '/' + product + window.location.search)
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
const actionCreators = { createProjectAction, fireProjectDirty, fireProjectDirtyUndo, clearLoadedProject }
export default withRouter(connect(mapStateToProps, actionCreators)(CreateConainer))
