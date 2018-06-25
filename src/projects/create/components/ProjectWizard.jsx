import _ from 'lodash'
import { unflatten } from 'flat'
import qs from 'query-string'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { getProjectCreationTemplateField, getProjectTemplateByAlias,
  getProjectTemplateByKey } from '../../../helpers/templates'
import Wizard from '../../../components/Wizard'
import SelectItemType from './SelectItemType'
import IncompleteProjectConfirmation from './IncompleteProjectConfirmation'
import FillProjectDetails from './FillProjectDetails'
import update from 'react-addons-update'
import { LS_INCOMPLETE_PROJECT, PROJECT_REF_CODE_MAX_LENGTH } from '../../../config/constants'
import './ProjectWizard.scss'

const WZ_STEP_INCOMP_PROJ_CONF = 0
const WZ_STEP_SELECT_PROJ_TYPE = 1
const WZ_STEP_FILL_PROJ_DETAILS = 2
const WZ_STEP_ERROR_CREATING_PROJ = 3

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
    this.updateProjectType = this.updateProjectType.bind(this)
    this.handleProjectChange = this.handleProjectChange.bind(this)
    this.loadIncompleteProject = this.loadIncompleteProject.bind(this)
    this.removeIncompleteProject = this.removeIncompleteProject.bind(this)
    this.handleOnCreateProject = this.handleOnCreateProject.bind(this)
    this.handleStepChange = this.handleStepChange.bind(this)
    this.restoreCommonDetails = this.restoreCommonDetails.bind(this)
    this.handleWizardCancel = this.handleWizardCancel.bind(this)
    this.loadProjectFromURL = this.loadProjectFromURL.bind(this)
  }

  componentDidMount() {
    const { onStepChange, projectTemplates } = this.props
    const params = this.props.match.params
    // load incomplete project from local storage
    const incompleteProjectStr = window.localStorage.getItem(LS_INCOMPLETE_PROJECT)
    if(incompleteProjectStr) {
      const incompleteProject = JSON.parse(incompleteProjectStr)
      const incompleteProjectTemplateKey = _.get(incompleteProject, 'details.products[0]')
      let wizardStep = WZ_STEP_INCOMP_PROJ_CONF
      let updateQuery = {}
      if (incompleteProjectTemplateKey && params && params.project) {
        const project = getProjectTemplateByAlias(projectTemplates, params.project)
        if (project) {
          // load project details page directly
          if (project.key === incompleteProjectTemplateKey) {
            wizardStep = WZ_STEP_FILL_PROJ_DETAILS
            updateQuery = {$merge : incompleteProject}
          } else {
            // explicitly ignores the wizardStep returned by the method
            // we need to call this method just to get updateQuery updated with correct project type
            this.loadProjectFromURL(params, updateQuery)
          }
        }
      }
      this.setState({
        project: update(this.state.project, updateQuery),
        dirtyProject: update(this.state.dirtyProject, updateQuery),
        wizardStep,
        isProjectDirty: false
      }, () => {
        typeof onStepChange === 'function' && onStepChange(this.state.wizardStep, this.state.project)
      })
    } else {
      // if there is no incomplete project in the local storage, load the wizard with appropriate step
      const updateQuery = {}
      let wizardStep = WZ_STEP_SELECT_PROJ_TYPE
      if (params && params.project) {
        wizardStep = this.loadProjectFromURL(params, updateQuery)
      }
      // retrieve refCode from query param
      // TODO give warning after truncating
      const refCode = _.get(qs.parse(window.location.search), 'refCode', '').trim().substr(0, PROJECT_REF_CODE_MAX_LENGTH)
      if (refCode.trim().length > 0) {
        // if refCode exists, update the updateQuery to set that refCode
        if (_.get(updateQuery, 'details')) {
          updateQuery['details']['utm'] = { $set : { code : refCode }}
        } else {
          updateQuery['details'] = { utm : { $set : { code : refCode }}}
        }
      }
      this.setState({
        project: update(this.state.project, updateQuery),
        dirtyProject: update(this.state.dirtyProject, updateQuery),
        wizardStep,
        isProjectDirty: false
      }, () => {
        typeof onStepChange === 'function' && onStepChange(this.state.wizardStep)
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    const { onStepChange } = nextProps
    const params = nextProps.match.params
    const type = _.get(nextProps.project, 'type', null)
    const projectTemplateKey = _.get(nextProps.project, 'details.products[0]', null)
    // redirect user to project details form, if we already have type and project available
    let wizardStep = type && projectTemplateKey ? WZ_STEP_FILL_PROJ_DETAILS : null
    const updateQuery = {}
    if (params && params.project) { // if there exists project path param
      wizardStep = this.loadProjectFromURL(params, updateQuery)
    } else { // if there is not project path param, it should be first step of the wizard
      updateQuery['type'] = { $set : null }
      updateQuery['details'] = { products : { $set: [] } }
      wizardStep = WZ_STEP_SELECT_PROJ_TYPE
    }
    // if wizard step deduced above and stored in state are not the same, update the state
    if (wizardStep && this.state.wizardStep !== wizardStep) {
      this.setState({
        project: update(this.state.project, updateQuery),
        dirtyProject: update(this.state.dirtyProject, updateQuery),
        wizardStep
      }, () => {
        typeof onStepChange === 'function' && onStepChange(this.state.wizardStep)
      })
    }
  }

  /**
   * Loads project type from the given URL parameter.
   *
   * @param {object} urlParams   URL parameters map
   * @param {object} updateQuery query object which would be updated according to parsed project type
   *
   * @return {number} step where wizard should move after parsing the URL param
   */
  loadProjectFromURL(urlParams, updateQuery) {
    const { projectTemplates } = this.props
    const projectUrlAlias = urlParams && urlParams.project
    const statusParam  = urlParams && urlParams.status

    if ('incomplete' === statusParam) {
      return WZ_STEP_INCOMP_PROJ_CONF
    }

    if (!projectUrlAlias) return

    const projectTemplate = getProjectTemplateByAlias(projectTemplates, projectUrlAlias)

    // if we have some project template key in the URL and we can find the project template
    // show details step
    if (projectTemplate) {
      updateQuery['type'] = { $set : projectTemplate.type }
      updateQuery['details'] = { products : { $set: [projectTemplate.key] } }

      const refCode = _.get(qs.parse(window.location.search), 'refCode', '').trim().substr(0, PROJECT_REF_CODE_MAX_LENGTH)
      if (refCode) {
        updateQuery.details.utm = { $set : { code : refCode } }
      }

      return WZ_STEP_FILL_PROJ_DETAILS
    }
  }

  /**
   * Loads incomplete project from the local storage and populates the state from that project.
   * It also moves the wizard to the project details step if there exists an incomplete project.
   */
  loadIncompleteProject() {
    const { onStepChange, onProjectUpdate } = this.props
    const incompleteProjectStr = window.localStorage.getItem(LS_INCOMPLETE_PROJECT)
    if(incompleteProjectStr) {
      const incompleteProject = JSON.parse(incompleteProjectStr)
      this.setState({
        project: update(this.state.project, { $merge : incompleteProject }),
        dirtyProject: update(this.state.dirtyProject, { $merge : incompleteProject }),
        wizardStep: WZ_STEP_FILL_PROJ_DETAILS
      }, () => {
        typeof onProjectUpdate === 'function' && onProjectUpdate(this.state.dirtyProject, false)
        typeof onStepChange === 'function' && onStepChange(this.state.wizardStep, this.state.dirtyProject)
      })
    }
  }

  getRefCodeFromURL() {
    return _.get(qs.parse(window.location.search), 'refCode', '').trim().substr(0, PROJECT_REF_CODE_MAX_LENGTH)
  }

  /**
   * Removed incomplete project from the local storage and resets the state. Also, moves wizard to the first step.
   */
  removeIncompleteProject() {
    const { onStepChange } = this.props
    // remove incomplete project from local storage
    window.localStorage.removeItem(LS_INCOMPLETE_PROJECT)
    // following code assumes that componentDidMount has already updated state with correct project
    const projectType = _.get(this.state.project, 'type')
    const projectTemplateKey = _.get(this.state.project, 'details.products[0]')
    let wizardStep = WZ_STEP_SELECT_PROJ_TYPE
    let project = null
    if (projectTemplateKey) {
      project = { type: projectType, details: { products: [projectTemplateKey] } }
      wizardStep = WZ_STEP_FILL_PROJ_DETAILS
    }
    const refCode = this.getRefCodeFromURL()
    if (refCode) {
      project.details.utm = { code : refCode}
    }
    this.setState({
      project: _.merge({}, project),
      dirtyProject: _.merge({}, project),
      wizardStep
    }, () => {
      typeof onStepChange === 'function' && onStepChange(this.state.wizardStep, this.state.project)
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

  updateProjectType(projectTemplateKey) {
    window.scrollTo(0, 0)
    const { onStepChange, onProjectUpdate, projectTemplates } = this.props
    const updateQuery = {}
    if (projectTemplateKey) {
      const projectTemplate = getProjectTemplateByKey(projectTemplates, projectTemplateKey)

      const detailsQuery = { products : [projectTemplateKey] }
      this.restoreCommonDetails(projectTemplate, updateQuery, detailsQuery)

      updateQuery.type = { $set : projectTemplate.type }
      updateQuery.details = { $set : detailsQuery }
    }
    this.setState({
      project: update(this.state.project, updateQuery),
      dirtyProject: update(this.state.project, updateQuery),
      wizardStep: WZ_STEP_FILL_PROJ_DETAILS,
    }, () => {
      typeof onProjectUpdate === 'function' && onProjectUpdate(this.state.dirtyProject, false)
      typeof onStepChange === 'function' && onStepChange(this.state.wizardStep, this.state.dirtyProject)
    })
  }

  /**
   * TODO this function currently doesn't make any effect
   *      this feature was lost
   *      keep it in the code as it could be used to fix this feature
   *
   * Restores common details of the project while changing project type.
   *
   * Added for Github issue#1037
   */
  restoreCommonDetails(projectTemplate, updateQuery, detailsQuery) {
    const name = _.get(this.state.dirtyProject, 'name')
    // if name was already entered, restore it
    if (name) {
      updateQuery.name = { $set: name }
    }
    const description = _.get(this.state.dirtyProject, 'description')
    // if description was already entered, restore it
    if (description) {
      updateQuery.description = { $set: description }
    }
    const utm = _.get(this.state.dirtyProject, 'details.utm')
    // if UTM code was already entered, restore it
    if (utm) {
      detailsQuery.utm = { code : utm.code }
    }
    const appDefinitionQuery = {}
    const goal = _.get(this.state.dirtyProject, 'details.appDefinition.goal')
    // finds the goal field from the updated project template
    const goalField = getProjectCreationTemplateField(
      projectTemplate,
      'appDefinition',
      'questions',
      'details.appDefinition.goal.value'
    )
    // if goal was already entered and updated project template has the field, restore it
    if (goalField && goal) {
      appDefinitionQuery.goal = goal
    }
    const users = _.get(this.state.dirtyProject, 'details.appDefinition.users')
    // finds the users field from the target project template
    const usersField = getProjectCreationTemplateField(
      projectTemplate,
      'appDefinition',
      'questions',
      'details.appDefinition.users.value'
    )
    // if users was already entered and updated project template has the field, restore it
    if (usersField && users) {
      appDefinitionQuery.users = users
    }
    const notes = _.get(this.state.dirtyProject, 'details.appDefinition.notes')
    // finds the notes field from the target project template
    const notesField = getProjectCreationTemplateField(
      projectTemplate,
      'appDefinition',
      'notes',
      'details.appDefinition.notes'
    )
    // if notes was already entered and updated project template has the field, restore it
    if (notesField && notes) {
      appDefinitionQuery.notes = notes
    }
    detailsQuery.appDefinition = appDefinitionQuery
  }

  handleProjectChange(change) {
    const { onProjectUpdate } = this.props
    this.setState({
      // update only dirtyProject when Form changes the model
      dirtyProject: _.mergeWith({}, this.state.dirtyProject, unflatten(change),
        // customizer to override array value with changed values
        (objValue, srcValue, key) => {// eslint-disable-line no-unused-vars
          if (_.isArray(srcValue)) {
            return srcValue// srcValue contains the changed values from action payload
          }
        }
      ),
      isProjectDirty: true
    }, () => {
      typeof onProjectUpdate === 'function' && onProjectUpdate(this.state.dirtyProject)
    })
  }

  handleOnCreateProject() {
    this.props.createProject(this.state.dirtyProject)
  }

  handleStepChange(wizardStep) {
    const { onStepChange } = this.props
    // resets project type
    this.setState({
      project: update(this.state.project, { type: { $set : null }, details: { products: {$set : [] }}}),
      dirtyProject: update(this.state.project, { type: { $set : null }, details: { products: {$set : [] }}}),
      wizardStep
    }, () => {
      typeof onStepChange === 'function' && onStepChange(wizardStep, this.state.dirtyProject)
    })
  }

  handleWizardCancel() {
    this.props.closeModal()
  }

  render() {
    const { processing, showModal, userRoles, projectTemplates } = this.props
    const { project, dirtyProject, wizardStep } = this.state
    return (
      <Wizard
        showModal={showModal}
        className="ProjectWizard"
        onCancel={this.handleWizardCancel}
        onStepChange={ this.handleStepChange }
        step={wizardStep}
        shouldRenderBackButton={ (step) => step > 1 }
      >
        <IncompleteProjectConfirmation
          loadIncompleteProject={ this.loadIncompleteProject }
          removeIncompleteProject={ this.removeIncompleteProject }
          userRoles={ userRoles }
        />
        <SelectItemType
          header={'Create a new project'}
          onProjectTypeChange={ this.updateProjectType }
          userRoles={ userRoles }
          projectTemplates={ projectTemplates }
          selectButtonTitle={'Select Project'}
        />
        <FillProjectDetails
          project={ project }
          projectTemplates={ projectTemplates }
          dirtyProject={ dirtyProject }
          processing={ processing}
          onCreateProject={ this.handleOnCreateProject }
          onChangeProjectType={() => this.handleStepChange(WZ_STEP_SELECT_PROJ_TYPE) }
          onProjectChange={ this.handleProjectChange }
          submitBtnText="Continue"
          userRoles={ userRoles }
          onBackClick={() => this.handleStepChange(WZ_STEP_SELECT_PROJ_TYPE)}
        />
      </Wizard>
    )
  }
}

ProjectWizard.propTypes = {
  /**
   * Callback to be called when the wizard is shown in modal form and close button is clicked.
   */
  closeModal: PropTypes.func,
  /**
   * Flag to render the wizard as modal (allows closing of the wizard at any step)
   */
  showModal: PropTypes.bool,
  /**
   * Callback to create project. Called when the wizard finishes its last step.
   */
  createProject: PropTypes.func.isRequired,
  /**
   * Callback called on every step change in the wizard.
   */
  onStepChange: PropTypes.func,
  /**
   * Callback called for every change in project details.
   */
  onProjectUpdate: PropTypes.func,
  /**
   * Flag which indicates that a project creation is in progress.
   */
  processing: PropTypes.bool.isRequired,
  /**
   * Roles of the logged in user. Used to determine anonymous access.
   */
  userRoles: PropTypes.arrayOf(PropTypes.string),
  /**
   * Project templates list.
   */
  projectTemplates: PropTypes.array.isRequired,
}

ProjectWizard.defaultProps = {
  closeModal: () => {},
  showModal: false
}

ProjectWizard.Steps = {
  WZ_STEP_INCOMP_PROJ_CONF,
  WZ_STEP_SELECT_PROJ_TYPE,
  WZ_STEP_FILL_PROJ_DETAILS,
  WZ_STEP_ERROR_CREATING_PROJ
}

export default withRouter(ProjectWizard)
