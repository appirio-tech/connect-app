import get from 'lodash/get'
import merge from 'lodash/merge'
import mergeWith from 'lodash/mergeWith'
import isArray from 'lodash/isArray'
import { unflatten } from 'flat'
import qs from 'query-string'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { findProduct, findCategory, findProductCategory, findProductsOfCategory, getProjectCreationTemplateField } from '../../../config/projectWizard'
import Wizard from '../../../components/Wizard'
import SelectProjectType from './SelectProjectType'
import SelectProduct from './SelectProduct'
import IncompleteProjectConfirmation from './IncompleteProjectConfirmation'
import FillProjectDetails from './FillProjectDetails'
import update from 'react-addons-update'
import { LS_INCOMPLETE_PROJECT, PROJECT_REF_CODE_MAX_LENGTH } from '../../../config/constants'
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
    this.updateProjectType = this.updateProjectType.bind(this)
    this.updateProducts = this.updateProducts.bind(this)
    this.handleProjectChange = this.handleProjectChange.bind(this)
    this.loadIncompleteProject = this.loadIncompleteProject.bind(this)
    this.removeIncompleteProject = this.removeIncompleteProject.bind(this)
    this.handleOnCreateProject = this.handleOnCreateProject.bind(this)
    this.handleStepChange = this.handleStepChange.bind(this)
    this.restoreCommonDetails = this.restoreCommonDetails.bind(this)
    this.handleWizardCancel = this.handleWizardCancel.bind(this)
    this.loadProjectAndProductFromURL = this.loadProjectAndProductFromURL.bind(this)
  }

  componentDidMount() {
    const { onStepChange } = this.props
    const params = this.props.match.params
    // load incomplete project from local storage
    const incompleteProjectStr = window.localStorage.getItem(LS_INCOMPLETE_PROJECT)
    if(incompleteProjectStr) {
      const incompleteProject = JSON.parse(incompleteProjectStr)
      const incompleteProduct = get(incompleteProject, 'details.products[0]')
      let wizardStep = WZ_STEP_INCOMP_PROJ_CONF
      let updateQuery = {}
      if (incompleteProduct && params && params.product) {
        // assumes the params.product to be id of a product because incomplete project is set only
        // after user selects a particular product
        const product = findProduct(params.product, true)
        if (product) {
          // load project detais page directly if product of save project and deep link are the same
          if (product.id === incompleteProduct) {
            wizardStep = WZ_STEP_FILL_PROJ_DETAILS
            updateQuery = {$merge : incompleteProject}
          } else {
            // explicitly ignores the wizardStep returned by the method
            // we need to call this method just to get updateQuery updated with correct project type and product
            this.loadProjectAndProductFromURL(params, updateQuery)
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
      if (params && params.product) {
        wizardStep = this.loadProjectAndProductFromURL(params, updateQuery)
      }
      // retrieve refCode from query param
      // TODO give warning after truncating
      const refCode = get(qs.parse(window.location.search), 'refCode', '').trim().substr(0, PROJECT_REF_CODE_MAX_LENGTH)
      if (refCode.trim().length > 0) {
        // if refCode exists, update the updateQuery to set that refCode
        if (get(updateQuery, 'details')) {
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
    const type = get(nextProps.project, 'type', null)
    const product = get(nextProps.project, 'details.products[0]', null)
    // redirect user to project details form, if we already have category and product available
    let wizardStep = type && product ? WZ_STEP_FILL_PROJ_DETAILS : null
    const updateQuery = {}
    if (params && params.product) { // if there exists product path param
      wizardStep = this.loadProjectAndProductFromURL(params, updateQuery)
    } else { // if there is not product path param, it should be first step of the wizard
      updateQuery['type'] = { $set : null }
      updateQuery['details'] = { products : { $set: [] } }
      wizardStep = WZ_STEP_SELECT_PROJ_TYPE
    }
    // if wizard setp deduced above and stored in state are not the same, update the state
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
   * Loads project type and product from the given URL parameter.
   *
   * @param {object} urlParams   URL parameters map
   * @param {object} updateQuery query object which would be updated according to parsed project type and product
   *
   * @return {number} step where wizard should move after parsing the URL param
   */
  loadProjectAndProductFromURL(urlParams, updateQuery) {
    const productParam = urlParams && urlParams.product
    const statusParam  = urlParams && urlParams.status
    if ('incomplete' === statusParam) {
      return WZ_STEP_INCOMP_PROJ_CONF
    }
    if (!productParam) return
    // first try the path param to be a project category
    let projectType = findCategory(productParam, true)
    if (projectType) {// if its a category
      updateQuery['type'] = { $set : projectType.id }
      return WZ_STEP_SELECT_PROD_TYPE
    } else {
      // if it is not a category, it should be a product and we should be able to find a category for it
      projectType = findProductCategory(productParam, true)
      // finds product object from product alias
      const product = findProduct(productParam, true)
      const refCode = get(qs.parse(window.location.search), 'refCode', '').trim().substr(0, PROJECT_REF_CODE_MAX_LENGTH)
      if (projectType) {// we can have `incomplete` as params.product
        updateQuery['type'] = { $set : projectType.id }
        updateQuery['details'] = { products : { $set: [product.id] } }
        if (refCode) {
          updateQuery.details.utm = { $set : { code : refCode } }
        }
        return WZ_STEP_FILL_PROJ_DETAILS
      }
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
    return get(qs.parse(window.location.search), 'refCode', '').trim().substr(0, PROJECT_REF_CODE_MAX_LENGTH)
  }

  /**
   * Removed incomplete project from the local storage and resets the state. Also, moves wizard to the first step.
   */
  removeIncompleteProject() {
    const { onStepChange } = this.props
    // remove incomplete project from local storage
    window.localStorage.removeItem(LS_INCOMPLETE_PROJECT)
    // following code assumes that componentDidMount has already updated state with correct project and product types
    const projectType = get(this.state.project, 'type')
    const product = get(this.state.project, 'details.products[0]')
    let wizardStep = WZ_STEP_SELECT_PROJ_TYPE
    let project = null
    if (product) {
      project = { type: projectType, details: { products: [product] } }
      wizardStep = WZ_STEP_FILL_PROJ_DETAILS
    } else if (projectType) {
      project = { type: projectType, details: { products: [] } }
      wizardStep = WZ_STEP_SELECT_PROD_TYPE
    }
    const refCode = this.getRefCodeFromURL()
    if (refCode) {
      project.details.utm = { code : refCode}
    }
    this.setState({
      project: merge({}, project),
      dirtyProject: merge({}, project),
      wizardStep
    }, () => {
      typeof onStepChange === 'function' && onStepChange(this.state.wizardStep, this.state.project)
    })
  }

  updateProjectRef(projectRef) {
    const details = get(this.state.project, 'details.utm.code')
    let updateQuery = { details: { utm : { code : {$set : projectRef }}}}
    if (!details) {
      updateQuery = { details: { $set : { utm : { code : projectRef }}}}
    }
    this.setState({
      project: update(this.state.project, updateQuery),
      dirtyProject: update(this.state.project, updateQuery)
    })
  }

  updateProjectType(projectType) {
    window.scrollTo(0, 0)
    const { onStepChange, onProjectUpdate } = this.props
    const products = findProductsOfCategory(projectType, false)
    const updateQuery = { }
    // restore common fields from dirty project
    // this.restoreCommonDetails(products, updateQuery, detailsQuery)
    if (projectType) {
      updateQuery.type = {$set : projectType }
      if (products.length === 1) {
        updateQuery.details = { $set : { products : [products[0].id]} }
      }
    }
    this.setState({
      project: update(this.state.project, updateQuery),
      dirtyProject: update(this.state.project, updateQuery),
      wizardStep: products.length === 1 ? WZ_STEP_FILL_PROJ_DETAILS : WZ_STEP_SELECT_PROD_TYPE
    }, () => {
      typeof onProjectUpdate === 'function' && onProjectUpdate(this.state.dirtyProject, false)
      typeof onStepChange === 'function' && onStepChange(this.state.wizardStep, this.state.dirtyProject)
    })
  }

  updateProducts(projectType, product) {
    window.scrollTo(0, 0)
    const { onStepChange, onProjectUpdate } = this.props
    // const products = get(this.state.project, 'details.products')
    const updateQuery = { }
    const detailsQuery = { products : [product] }
    // restore common fields from dirty project
    this.restoreCommonDetails(product, updateQuery, detailsQuery)
    updateQuery.details = { $set : detailsQuery}
    if (projectType) {
      updateQuery.type = {$set : projectType }
    }
    this.setState({
      project: update(this.state.project, updateQuery),
      dirtyProject: update(this.state.project, updateQuery),
      wizardStep: WZ_STEP_FILL_PROJ_DETAILS
    }, () => {
      typeof onProjectUpdate === 'function' && onProjectUpdate(this.state.dirtyProject, false)
      typeof onStepChange === 'function' && onStepChange(this.state.wizardStep, this.state.dirtyProject)
    })
  }

  /**
   * Restores common details of the project while changing product type.
   *
   * Added for Github issue#1037
   */
  restoreCommonDetails(updatedProduct, updateQuery, detailsQuery) {
    const name = get(this.state.dirtyProject, 'name')
    // if name was already entered, restore it
    if (name) {
      updateQuery.name = { $set: name }
    }
    const description = get(this.state.dirtyProject, 'description')
    // if description was already entered, restore it
    if (description) {
      updateQuery.description = { $set: description }
    }
    const utm = get(this.state.dirtyProject, 'details.utm')
    // if UTM code was already entered, restore it
    if (utm) {
      detailsQuery.utm = { code : utm.code }
    }
    const appDefinitionQuery = {}
    const goal = get(this.state.dirtyProject, 'details.appDefinition.goal')
    // finds the goal field from the updated product template
    const goalField = getProjectCreationTemplateField(
      updatedProduct,
      'appDefinition',
      'questions',
      'details.appDefinition.goal.value'
    )
    // if goal was already entered and updated product template has the field, restore it
    if (goalField && goal) {
      appDefinitionQuery.goal = goal
    }
    const users = get(this.state.dirtyProject, 'details.appDefinition.users')
    // finds the users field from the target product template
    const usersField = getProjectCreationTemplateField(
      updatedProduct,
      'appDefinition',
      'questions',
      'details.appDefinition.users.value'
    )
    // if users was already entered and updated product template has the field, restore it
    if (usersField && users) {
      appDefinitionQuery.users = users
    }
    const notes = get(this.state.dirtyProject, 'details.appDefinition.notes')
    // finds the notes field from the target product template
    const notesField = getProjectCreationTemplateField(
      updatedProduct,
      'appDefinition',
      'notes',
      'details.appDefinition.notes'
    )
    // if notes was already entered and updated product template has the field, restore it
    if (notesField && notes) {
      appDefinitionQuery.notes = notes
    }
    detailsQuery.appDefinition = appDefinitionQuery
  }

  handleProjectChange(change) {
    const { onProjectUpdate } = this.props
    this.setState({
      // update only dirtyProject when Form changes the model
      dirtyProject: mergeWith({}, this.state.dirtyProject, unflatten(change),
        // customizer to override array value with changed values
        (objValue, srcValue, key) => {// eslint-disable-line no-unused-vars
          if (isArray(srcValue)) {
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
    const products = findProductsOfCategory(this.state.project.type, false)
    // if project type has only one product, move one step back to select project type step
    if (wizardStep === WZ_STEP_SELECT_PROD_TYPE && products && products.length === 1) {
      wizardStep = WZ_STEP_SELECT_PROJ_TYPE
    }
    // project type
    // if wizard has moved to select product step , it should persist project type, else it should be reset
    const type = wizardStep === WZ_STEP_SELECT_PROD_TYPE ? this.state.project.type : null
    this.setState({
      // resets project sub type or product
      project: update(this.state.project, { type: { $set : type }, details: { products: {$set : [] }}}),
      dirtyProject: update(this.state.project, { type: { $set : type }, details: { products: {$set : [] }}}),
      wizardStep
    }, () => {
      typeof onStepChange === 'function' && onStepChange(wizardStep, this.state.dirtyProject)
    })
  }

  handleWizardCancel() {
    this.props.closeModal()
  }

  render() {
    const { processing, showModal, userRoles } = this.props
    const { project, dirtyProject } = this.state
    return (
      <Wizard
        showModal={showModal}
        className="ProjectWizard"
        onCancel={this.handleWizardCancel}
        onStepChange={ this.handleStepChange }
        step={this.state.wizardStep}
        shouldRenderBackButton={ (step) => step > 1 }
      >
        <IncompleteProjectConfirmation
          loadIncompleteProject={ this.loadIncompleteProject }
          removeIncompleteProject={ this.removeIncompleteProject }
          userRoles={ userRoles }
        />
        <SelectProjectType
          onProjectTypeChange={ this.updateProjectType }
          userRoles={ userRoles }
        />
        <SelectProduct
          onProductChange={ this.updateProducts }
          projectType={ project.type }
          userRoles={ userRoles }
          onChangeProjectType={() => this.handleStepChange(WZ_STEP_SELECT_PROJ_TYPE) }
        />
        <FillProjectDetails
          project={ project }
          dirtyProject={ dirtyProject }
          processing={ processing}
          onCreateProject={ this.handleOnCreateProject }
          onChangeProjectType={() => this.handleStepChange(WZ_STEP_SELECT_PROJ_TYPE) }
          onProjectChange={ this.handleProjectChange }
          submitBtnText="Continue"
          userRoles={ userRoles }
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
  userRoles: PropTypes.arrayOf(PropTypes.string)
}

ProjectWizard.defaultProps = {
  closeModal: () => {},
  showModal: false
}

ProjectWizard.Steps = {
  WZ_STEP_INCOMP_PROJ_CONF,
  WZ_STEP_SELECT_PROJ_TYPE,
  WZ_STEP_SELECT_PROD_TYPE,
  WZ_STEP_FILL_PROJ_DETAILS,
  WZ_STEP_ERROR_CREATING_PROJ
}

export default withRouter(ProjectWizard)
