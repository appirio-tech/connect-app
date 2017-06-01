import _ from 'lodash'
import { unflatten } from 'flat'
import React, { Component, PropTypes } from 'react'

import config, { findProductCategory } from '../../../config/projectWizard'
import Wizard from '../../../components/Wizard'
import SelectProjectType from './SelectProjectType'
import SelectProjectSubType from './SelectProjectSubType'
import SelectProduct from './SelectProduct'
import IncompleteProjectConfirmation from './IncompleteProjectConfirmation'
import FillProjectDetails from './FillProjectDetails'
import update from 'react-addons-update'
import { LS_INCOMPLETE_PROJECT } from '../../../config/constants'
import './ProjectWizard.scss'

const WZ_STEP_INCOMP_PROJ_CONF = 0
// const WZ_STEP_SELECT_PROJ_TYPE = 1
const WZ_STEP_SELECT_PROD_TYPE = 1
const WZ_STEP_FILL_PROJ_DETAILS = 2
const WZ_STEP_ERROR_CREATING_PROJ = 3

class ProjectWizard extends Component {

  constructor(props) {
    super(props)

    this.state = {
      wizardStep: WZ_STEP_SELECT_PROD_TYPE,
      project: { details: {} },
      dirtyProject: { details: {} },
      isProjectDirty: false
    }

    this.updateProjectRef = this.updateProjectRef.bind(this)
    this.updateProducts = this.updateProducts.bind(this)
    this.handleProjectChange = this.handleProjectChange.bind(this)
    this.loadIncompleteProject = this.loadIncompleteProject.bind(this)
    this.removeIncompleteProject = this.removeIncompleteProject.bind(this)
    this.handleOnCreateProject = this.handleOnCreateProject.bind(this)
    this.handleStepChange = this.handleStepChange.bind(this)
  }

  componentDidMount() {
    const { location, params } = this.props
    // load incomplete project from local storage
    const incompleteProjectStr = window.localStorage.getItem(LS_INCOMPLETE_PROJECT)
    if(incompleteProjectStr) {
      const incompleteProject = JSON.parse(incompleteProjectStr)
      this.setState({
        project: update(this.state.project, {$merge : incompleteProject}),
        dirtyProject: update(this.state.dirtyProject, {$merge : incompleteProject}),
        wizardStep: WZ_STEP_INCOMP_PROJ_CONF,
        isProjectDirty: false
      }, () => {
        this.props.onStepChange(this.state.wizardStep)
      })
    } else {
      // if there is no incomplete project in the local storage, load the wizard with appropriate step
      const updateQuery = {}
      let wizardStep = WZ_STEP_SELECT_PROD_TYPE
      if (params && params.product) {
        const prodCategory = findProductCategory(params.product)
        if (prodCategory) {
          updateQuery['type'] = { $set : config[prodCategory].id }
        }
        updateQuery['details'] = { 'products' : { $set: [params.product] } }
        wizardStep = WZ_STEP_FILL_PROJ_DETAILS
      }
      this.setState({
        project: update(this.state.project, updateQuery),
        dirtyProject: update(this.state.dirtyProject, updateQuery),
        wizardStep,
        isProjectDirty: false
      }, () => {
        this.props.onStepChange(this.state.wizardStep)
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    const type = _.get(nextProps.project, 'type', null)
    const product = _.get(nextProps.project, 'details.products[0]', null)
    let wizardStep = type && product ? WZ_STEP_FILL_PROJ_DETAILS : null
    if (wizardStep) {
      this.setState({
        wizardStep: wizardStep
      }, () => {
        this.props.onStepChange(this.state.wizardStep)
      })
    }
  }

  /**
   * Loads incomplete project from the local storage and populates the state from that project.
   * It also moves the wizard to the project details step if there exists an incomplete project.
   */
  loadIncompleteProject() {
    const incompleteProjectStr = window.localStorage.getItem(LS_INCOMPLETE_PROJECT)
    if(incompleteProjectStr) {
      const incompleteProject = JSON.parse(incompleteProjectStr)
      this.setState({
        project: update(this.state.project, { $merge : incompleteProject }),
        dirtyProject: update(this.state.dirtyProject, { $merge : incompleteProject }),
        wizardStep: WZ_STEP_FILL_PROJ_DETAILS
      }, () => {
        this.props.onStepChange(this.state.wizardStep)
      })
    }
  }

  /**
   * Removed incomplete project from the local storage and resets the state. Also, moves wizard to the first step.
   */
  removeIncompleteProject() {
    window.localStorage.removeItem(LS_INCOMPLETE_PROJECT)
    this.setState({
      project: { details: {} },
      dirtyProject: { details: {} },
      wizardStep: WZ_STEP_SELECT_PROD_TYPE
    }, () => {
      this.props.onStepChange(this.state.wizardStep)
    })
  }

  updateProjectRef(projectRef) {
    const details = _.get(this.state.project, 'details.utm.code')
    let updateQuery = { details: { utm : { code : {$set : projectRef }}}}
    if (!details) {
      updateQuery = { details: { $set : { utm : { code : projectRef }}}}
    }
    this.setState({ 
      project: update(this.state.project, updateQuery),
      dirtyProject: update(this.state.project, updateQuery)
    })
  }

  updateProducts(projectType, product) {
    const products = _.get(this.state.project, 'details.products')
    let updateQuery = { details: { products : { $set : [product] }}}
    if (!products) {
      updateQuery = { details: { $set : { products : [product] }}}
    }
    if (projectType) {
      updateQuery.type = {$set : projectType }
    }
    this.setState({ 
      project: update(this.state.project, updateQuery),
      dirtyProject: update(this.state.project, updateQuery),
      wizardStep: WZ_STEP_FILL_PROJ_DETAILS
    }, () => {
      this.props.onStepChange(this.state.wizardStep)
    })
  }

  handleProjectChange(change) {
    this.setState({
      // update only dirtyProject when Form changes the model
      dirtyProject: _.merge({}, this.state.dirtyProject, unflatten(change)),
      isProjectDirty: true
    }, () => {
      this.props.onProjectUpdate(this.state.dirtyProject)
    })
  }

  handleOnCreateProject() {
    this.props.createProject({})
  }

  handleStepChange(wizardStep) {
    this.setState({
      // In this wizard we have just two steps, and this callback is triggered
      // only to move from the second step back to the first, thus we always
      // should reset the projectSubType when this callback is fired.
      project: update(this.state.project, { details: { products: {$set : [] }}}),
      wizardStep
    }, () => {
      this.props.onStepChange(wizardStep)
    })
  }

  render() {
    const { processing, createProject, showModal, userRoles } = this.props
    const { project, dirtyProject } = this.state
    return (
      <Wizard
        showModal={showModal}
        className="ProjectWizard"
        onCancel={() => this.props.closeModal()}
        onStepChange={ this.handleStepChange }
        step={this.state.wizardStep}
        shouldRenderBackButton={ (step) => userRoles && userRoles.length && step > 1 }
      >
        <IncompleteProjectConfirmation
          loadIncompleteProject={ this.loadIncompleteProject }
          removeIncompleteProject={ this.removeIncompleteProject }/>
        <SelectProduct
          onProductChange={ this.updateProducts }
        />
        <FillProjectDetails
          project={ project }
          dirtyProject={ dirtyProject }
          processing={ processing}
          onCreateProject={ this.handleOnCreateProject }
          onProjectNameChange={projectName => this.setState({ 
            project: update(project, { name: {$set : projectName }})
          })}
          onProjectRefChange={projectRef => this.setState({ 
            project: update(project, { details: { utm : { code : {$set : projectRef }}}})
          })}
          onProjectChange={ this.handleProjectChange }
          submitBtnText="Continue"
          userRoles={ userRoles }
        />
      </Wizard>
    )
  }
}

ProjectWizard.propTypes = {
  closeModal: PropTypes.func,
  showModal: PropTypes.bool,
  createProject: PropTypes.func.isRequired,
  onStepChange: PropTypes.func.isRequired,
  onProjectUpdate: PropTypes.func.isRequired,
  processing: PropTypes.bool.isRequired,
  userRoles: PropTypes.arrayOf(PropTypes.string)
}

ProjectWizard.defaultProps = {
  closeModal: () => {},
  showModal: false
}

ProjectWizard.Steps = {
  WZ_STEP_INCOMP_PROJ_CONF,
  // WZ_STEP_SELECT_PROJ_TYPE,
  WZ_STEP_SELECT_PROD_TYPE,
  WZ_STEP_FILL_PROJ_DETAILS,
  WZ_STEP_ERROR_CREATING_PROJ
}

export default ProjectWizard