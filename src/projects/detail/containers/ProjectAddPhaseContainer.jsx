/**
 * ProjectPlanContainer container
 * displays content of the Project Plan tab
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import qs from 'query-string'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { renderComponent, branch, compose, withProps } from 'recompose'
import spinnerWhileLoading from '../../../components/LoadingSpinner'
import { createProduct } from '../../actions/project'
import { getProductTemplateByKey } from '../../../helpers/templates'
import { loadProjectPhasesWithProducts } from '../../actions/project'
import { loadProjectDashboard } from '../../../projects/actions/projectDashboard'


import CoderBot from '../../../components/CoderBot/CoderBot'
import Wizard from '../../../components/Wizard'
import SelectProjectType from '../../create/components/SelectProjectType'
import {
  CREATE_PROJECT_FAILURE,
} from '../../../config/constants'

import '../../../projects/create/components/ProjectWizard.scss'
import './ProjectAddPhaseContainer.scss'

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
  !props.processing && !props.addingState && !props.isLoadingPhases
)

const enhance = compose(errorHandler, spinner)


const CreateView = (props) => {
  return (
    <div>
      <Wizard
        {...props}
        showModal
        className="ProjectWizard"
        onStepChange={ () => {} }
        step={1}
        shouldRenderBackButton={ (step) => step > 1 }
      >
        <div />
        <SelectProjectType
          header={'Add New Stage'}
          onProjectTypeChange={ props.onProjectTypeChange }
          userRoles={ props.userRoles }
          projectTemplates={ props.projectTemplates }
          selectButtonTitle={'Select Product'}
        />
      </Wizard>

    </div>
  )
}
const EnhancedCreateView = enhance(CreateView)

class ProjectAddPhaseContainer extends React.Component {
  constructor(props) {
    super(props)
    this.closeWizard = this.closeWizard.bind(this)
    this.updateProjectType = this.updateProjectType.bind(this)
    this.state = {
      isChosenProduct: false,
      shouldReloadPhases: false
    }
  }

  closeWizard() {
    const { userRoles, location, project } = this.props
    const isLoggedIn = userRoles && userRoles.length > 0
    const returnUrl = _.get(qs.parse(location.search), 'returnUrl', null)
    if (returnUrl) {
      window.location = returnUrl
    } else {
      if (isLoggedIn) {
        this.props.history.push(`/projects/${project.id}/plan`)
      } else {
        this.props.history.push('/')
        // FIXME ideally we should push on router
        // window.location = window.location.origin
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps test')
    const projectId = _.get(nextProps, 'project.id', null)
    if (!nextProps.processing && !nextProps.error && projectId && this.state.isChosenProduct) {
      if (this.state.shouldReloadPhases) {
        // reload the project
        nextProps.loadProjectPhasesWithProducts(projectId)
        this.setState({shouldReloadPhases: false})
      } else if (!nextProps.isLoadingPhases) {
        // back to plan
        this.closeWizard()
      }
    }
  }

  updateProjectType(projectTemplateKey) {
    const props = this.props

    const productTemplate = getProductTemplateByKey(props.allProductTemplates, projectTemplateKey)
    if (productTemplate) {
      props.createProduct(props.project, productTemplate)
      this.setState({isChosenProduct: true, shouldReloadPhases: true})
    }
  }

  render() {
    const props = this.props

    return (
      <EnhancedCreateView
        {...this.props}
        onCancel={this.closeWizard}
        showModal
        projectTemplates={props.allProductTemplates}
        onProjectTypeChange={this.updateProjectType}
      />
    )
  }
}

ProjectAddPhaseContainer.propTypes = {
  userRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  addingState: PropTypes.bool,
  allProductTemplates: PropTypes.array
}

ProjectAddPhaseContainer.defaultProps = {
  userRoles: [],
  addingState: false,
  allProductTemplates: []
}

const mapStateToProps = ({projectState, loadUser, templates }) => ({
  userRoles: _.get(loadUser, 'user.roles', []),
  processing: projectState.processing,
  error: projectState.error,
  project: projectState.project,
  isLoadingPhases: projectState.isLoadingPhases,
  templates,
})

const actionCreators = {createProduct, loadProjectPhasesWithProducts, loadProjectDashboard}

export default withRouter(connect(mapStateToProps, actionCreators)(ProjectAddPhaseContainer))
