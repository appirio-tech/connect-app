import _ from 'lodash'
import { unflatten } from 'flat'
import React, { Component, PropTypes } from 'react'

import config from '../../../config/projectWizard'
import Wizard from '../../../components/Wizard'
import SelectProjectType from './SelectProjectType'
import SelectProjectSubType from './SelectProjectSubType'
import IncompleteProjectConfirmation from './IncompleteProjectConfirmation'
import FillProjectDetails from '../containers/FillProjectDetailsContainer'
import update from 'react-addons-update'
import { LS_INCOMPLETE_PROJECT } from '../../../config/constants'
import './ProjectWizard.scss'

const WZ_STEP_INCOMP_PROJ_CONF = 0
const WZ_STEP_SELECT_PROJ_TYPE = 1
const WZ_STEP_SELECT_PROD_TYPE = 2
const WZ_STEP_FILL_PROJ_DETAILS = 3
const WZ_STEP_ERROR_CREATING_PROJ = 4

class ProjectWizard extends Component {

  constructor(props) {
    super(props)

    this.state = {
      wizardStep: WZ_STEP_SELECT_PROJ_TYPE,
      project: { details: {} },
      dirtyProject: { details: {} },
      isProjectDirty: false
    }

    this.updateProjectRef = this.updateProjectRef.bind(this)
    this.updateProducts = this.updateProducts.bind(this)
    this.handleProjectChange = this.handleProjectChange.bind(this)
    this.onLeave = this.onLeave.bind(this)
    this.loadIncompleteProject = this.loadIncompleteProject.bind(this)
    this.removeIncompleteProject = this.removeIncompleteProject.bind(this)
    this.handleOnCreateProject = this.handleOnCreateProject.bind(this)
  }

  componentDidMount() {
    // sets route leave hook to show unsaved changes alert and persist incomplete project
    this.props.router.setRouteLeaveHook(this.props.route, this.onLeave)
    // sets window unload hook to show unsaved changes alert and persist incomplete project
    window.addEventListener('beforeunload', this.onLeave)


    const { userRoles, location } = this.props
    // load incomplete project from local storage
    const incompleteProjectStr = window.localStorage.getItem(LS_INCOMPLETE_PROJECT)
    if(incompleteProjectStr) {
      const incompleteProject = JSON.parse(incompleteProjectStr)
      this.setState({
        project: update(this.state.project, {$merge : incompleteProject}),
        dirtyProject: update(this.state.dirtyProject, {$merge : incompleteProject}),
        wizardStep: WZ_STEP_INCOMP_PROJ_CONF
      })
    } else {
      // if there is no incomplete project in the local storage, load the wizard with appropriate step
      const { type, product } = this.props.params
      const updateQuery = {}
      let wizardStep = WZ_STEP_SELECT_PROJ_TYPE
      if (type) {
        updateQuery['type'] = { $set: type }
        wizardStep = WZ_STEP_SELECT_PROD_TYPE
      }
      if (product) {
        updateQuery['details'] = { 'products' : { $set: [product] } }
        wizardStep = WZ_STEP_FILL_PROJ_DETAILS
      }
      this.setState({
        project: update(this.state.project, updateQuery),
        dirtyProject: update(this.state.dirtyProject, updateQuery),
        wizardStep
      })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onLeave)
  }

  componentWillReceiveProps(nextProps) {
    const type = _.get(nextProps.project, 'type', null)
    const product = _.get(nextProps.project, 'details.products[0]', null)
    let wizardStep = type && product ? WZ_STEP_FILL_PROJ_DETAILS : null
    if (wizardStep) {
      this.setState({
        wizardStep: wizardStep
      })
    }
  }

  // stores the incomplete project in local storage
  onLeave(e) {
    const { wizardStep, isProjectDirty, processing } = this.state
    if (wizardStep === WZ_STEP_FILL_PROJ_DETAILS && isProjectDirty) {// Project Details step
      window.localStorage.setItem(LS_INCOMPLETE_PROJECT, JSON.stringify(this.state.dirtyProject))
    }
    if (isProjectDirty && !processing) {
      return e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
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
      wizardStep: WZ_STEP_SELECT_PROJ_TYPE
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

  updateProducts(product) {
    const products = _.get(this.state.project, 'details.products')
    let updateQuery = { details: { products : { $set : [product] }}}
    if (!products) {
      updateQuery = { details: { $set : { products : [product] }}}
    }
    this.setState({ 
      project: update(this.state.project, updateQuery),
      dirtyProject: update(this.state.project, updateQuery)
    })
  }

  handleProjectChange(change) {
    this.setState({
      // update only dirtyProject when Form changes the model
      dirtyProject: _.merge({}, this.state.dirtyProject, unflatten(change)),
      isProjectDirty: true
    })
  }

  handleOnCreateProject() {
    this.props.createProject(this.state.dirtyProject)
  }

  render() {
    const { processing, route, userRoles, createProject } = this.props
    const { project, dirtyProject } = this.state
    return (
      <Wizard
        hideModal={true}
        className="ProjectWizard"
        onCancel={() => this.props.closeModal()}
        onStepChange={wizardStep => this.setState({
          // In this wizard we have just two steps, and this callback is triggered
          // only to move from the second step back to the first, thus we always
          // should reset the projectSubType when this callback is fired.
          project: update(project, { details: { products: {$set : [] }}}),
          wizardStep
        })}
        step={this.state.wizardStep}
      >
        <IncompleteProjectConfirmation
          loadIncompleteProject={ this.loadIncompleteProject }
          removeIncompleteProject={ this.removeIncompleteProject }/>
        <SelectProjectType
          onProjectNameChange={projectName => this.setState({ 
            project: update(project, { name: {$set : projectName }})
          })}
          onProjectRefChange={ this.updateProjectRef }
          onProjectTypeChange={projectType => {this.setState({
            project: update(project, { type: {$set : config[projectType].id }}),
            wizardStep: WZ_STEP_SELECT_PROD_TYPE
          })}}
          projectName={ _.get(project, 'name', '') }
          projectRef={ _.get(project, 'details.utm.code', '') }
          projectType={ _.get(project, 'type', '') }
          projectSubType={ _.get(project, 'details.products[0]', '') }
        />
        <SelectProjectSubType
          createProject={projectType => this.setState({
            wizardStep: WZ_STEP_FILL_PROJ_DETAILS
          })}
          onProjectNameChange={projectName => this.setState({ 
            project: update(project, { name: {$set : projectName }})
          })}
          onProjectRefChange={ this.updateProjectRef }
          onSubCategoryChange={ this.updateProducts }
          projectName={ _.get(project, 'name', '') }
          projectRef={ _.get(project, 'details.utm.code', '') }
          projectType={ _.get(project, 'type', '') }
          projectSubType={ _.get(project, 'details.products[0]', '') }
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
          route={route}
          submitBtnText="Continue"
        />
      </Wizard>
    )
  }
}

ProjectWizard.propTypes = {
  userRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  closeModal: PropTypes.func.isRequired
}

ProjectWizard.defaultProps = {
  userRoles: [],
  closeModal: () => {}
}

export default ProjectWizard