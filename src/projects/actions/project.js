import _ from 'lodash'
import moment from 'moment'
import { flatten, unflatten } from 'flat'
import { getProjectById,
  createProject as createProjectAPI,
  createProjectWithStatus as createProjectWithStatusAPI,
  updateProject as updateProjectAPI,
  deleteProject as deleteProjectAPI,
  deleteProjectPhase as deleteProjectPhaseAPI,
  getDirectProjectData,
  getProjectPhases,
  updateProduct as updateProductAPI,
  updatePhase as updatePhaseAPI,
  createProjectPhase,
  createScopeChangeRequest as createScopeChangeRequestAPI,
  updateScopeChangeRequest as updateScopeChangeRequestAPI,
} from '../../api/projects'
import {
  getProjectInviteById,
} from '../../api/projectMemberInvites'
import {
  createTimeline,
} from '../../api/timelines'
// import { loadProductTimelineWithMilestones } from './productsTimelines'
import {
  LOAD_PROJECT,
  LOAD_PROJECT_MEMBER_INVITES,
  CREATE_PROJECT,
  CREATE_PROJECT_STAGE,
  CLEAR_LOADED_PROJECT,
  UPDATE_PROJECT,
  LOAD_DIRECT_PROJECT,
  DELETE_PROJECT,
  PROJECT_DIRTY,
  PROJECT_DIRTY_UNDO,
  LOAD_PROJECT_PHASES,
  UPDATE_PRODUCT,
  PROJECT_STATUS_DRAFT,
  PRODUCT_DIRTY,
  PRODUCT_DIRTY_UNDO,
  UPDATE_PHASE,
  DELETE_PROJECT_PHASE,
  MILESTONE_STATUS,
  PHASE_STATUS_ACTIVE,
  PHASE_DIRTY,
  PHASE_DIRTY_UNDO,
  PROJECT_STATUS_IN_REVIEW,
  PHASE_STATUS_REVIEWED,
  PROJECT_STATUS_REVIEWED,
  PROJECT_STATUS_ACTIVE,
  EXPAND_PROJECT_PHASE,
  COLLAPSE_PROJECT_PHASE,
  COLLAPSE_ALL_PROJECT_PHASES,
  CREATE_SCOPE_CHANGE_REQUEST,
  APPROVE_SCOPE_CHANGE,
  REJECT_SCOPE_CHANGE,
  CANCEL_SCOPE_CHANGE,
  ACTIVATE_SCOPE_CHANGE,
  SCOPE_CHANGE_REQ_STATUS_ACTIVATED,
  SCOPE_CHANGE_REQ_STATUS_APPROVED,
  SCOPE_CHANGE_REQ_STATUS_REJECTED,
  SCOPE_CHANGE_REQ_STATUS_CANCELED,
} from '../../config/constants'
import {
  updateProductMilestone,
  updateProductTimeline
} from './productsTimelines'
import {
  getPhaseActualData,
} from '../../helpers/projectHelper'

/**
 * Expand phase and optionaly expand particular tab
 *
 * @param {Number} phaseId phase id
 * @param {String} tab     (optional) tab id
 */
export function expandProjectPhase(phaseId, tab) {
  return (dispatch) => {
    return dispatch({
      type: EXPAND_PROJECT_PHASE,
      payload: { phaseId, tab }
    })
  }
}

/**
 * Collapse phase
 *
 * @param {Number} phaseId phase id
 */
export function collapseProjectPhase(phaseId) {
  return (dispatch) => {
    return dispatch({
      type: COLLAPSE_PROJECT_PHASE,
      payload: { phaseId }
    })
  }
}

/**
 * Collapse all phases and reset tabs to default
 */
export function collapseAllProjectPhases() {
  return (dispatch) => {
    return dispatch({
      type: COLLAPSE_ALL_PROJECT_PHASES,
    })
  }
}

export function loadProject(projectId) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT,
      payload: getProjectById(projectId)
    })
  }

  /*return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT,
      payload: getProjectInviteById(projectId)
        .then((project) => getProjectById(projectId, dispatch))
    })
  }*/
}

export function loadProjectInvite(projectId) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT_MEMBER_INVITES,
      payload: getProjectInviteById(projectId)
    })
  }

  /*return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT,
      payload: getProjectInviteById(projectId)
        .then((project) => getProjectById(projectId, dispatch))
    })
  }*/
}

/**
 * Get project phases together with products
 *
 * @param {String} projectId project id
 *
 * @returns {Promise<[]>} resolves to the list of phases
 */
function getProjectPhasesWithProducts(projectId) {
  return getProjectPhases(projectId, {
    // explicitly define the list of fields, to get products included in response
    fields: [
      'products',
      'budget',
      'createdAt',
      'createdBy',
      'details',
      'duration',
      'endDate',
      'id',
      'name',
      'progress',
      'projectId',
      'spentBudget',
      'startDate',
      'status',
      'updatedAt',
      'updatedBy',
    ].join(',')
  })
}

/**
 * Load project phases with populated products
 *
 * @param {String} projectId        project id
 *
 * @return {Promise} LOAD_PROJECT_PHASES action with payload as array of phases
 */
export function loadProjectPhasesWithProducts(projectId) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT_PHASES,
      payload: getProjectPhasesWithProducts(projectId)
    })
  }
}

export function clearLoadedProject() {
  return dispatch => {
    return dispatch({
      type: CLEAR_LOADED_PROJECT
    })
  }
}

export function createProject(newProject) {
  return (dispatch) => {
    return dispatch({
      type: CREATE_PROJECT,
      payload: createProjectAPI(newProject)
        .then((project) => createProductsTimelineAndMilestone(project, dispatch))
    })
  }
}

/**
 * Helper method to get the list of all products of the project
 *
 * @param {Object} project project
 *
 * @returns {Promise<[]>} list of products
 */
// function getAllProjectProducts(project, fromDB = false) {
//   return getProjectPhasesWithProducts(project.id, fromDB)
//     .then((phases) => _.flatten(_.map(phases, 'products')))
// }

/**
 * Create timeline and milestones for a product
 *
 * @param {Object} product product
 *
 * @return {Promise} product
 */
function createTimelineAndMilestoneForProduct(product, phase) {
  return createTimeline({
    name: `Welcome to the ${product.name} phase`,
    description: 'This is the first stage in our project. We’re going to show you the detailed plan in your timeline, with all the milestones.',
    startDate: phase ? moment(phase.startDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
    endDate: null,
    reference: 'product',
    referenceId: product.id,
    templateId: product.templateId,
  })
}

/**
 * Create timeline and milestones for all products of a project
 *
 * @param {Object} project project
 *
 * @returns {Promise} project
 */
function createProductsTimelineAndMilestone(project) {
  if (project.phases) {
    const products = _.flatten(_.map(project.phases, 'products'))
    return Promise.all(products.map(createTimelineAndMilestoneForProduct)).then(() => project)
  } else {
    console.log('We did not receive the phases for the project. Hence timeline and milestones are not created')
  }
}

export function createProduct(project, productTemplate, phases, timelines) {
  // get endDates + 1 day for all the phases if there are any phases
  const phaseEndDatesPlusOne = (phases || []).map((phase) => {
    const productId = _.get(phase, 'products[0].id', -1)
    const timeline = _.get(timelines, `${productId}.timeline`, null)

    const phaseActualData = getPhaseActualData(phase, timeline)

    return phaseActualData.endDate.add(1, 'day')
  })

  const today = moment().hours(0).minutes(0).seconds(0).milliseconds(0)
  const startDate = _.max([...phaseEndDatesPlusOne, today])

  // assumes 10 days as default duration, ideally we could store it at template level
  const endDate = moment(startDate).add((10 - 1), 'days')

  return (dispatch) => {
    return dispatch({
      type: CREATE_PROJECT_STAGE,
      payload: createProjectPhaseAndProduct(project, productTemplate, PROJECT_STATUS_DRAFT, startDate, endDate)
    })
  }
}

/**
 * Create phase and product for the project
 *
 * @param {Object} project         project
 * @param {Object} projectTemplate project template
 * @param {String} status          (optional) project/phase status
 *
 * @return {Promise} project
 */
export function createProjectPhaseAndProduct(project, projectTemplate, status = PROJECT_STATUS_DRAFT, startDate, endDate) {
  const param = {
    status,
    name: projectTemplate.name,
    productTemplateId: projectTemplate.id
  }
  if (startDate) {
    param['startDate'] = startDate.format('YYYY-MM-DD')
  }
  if (endDate) {
    param['endDate'] = endDate.format('YYYY-MM-DD')
  }

  return createProjectPhase(project.id, param).then((phase) => {
    // we also wait until timeline is created as we will load it for the phase after creation
    return createTimelineAndMilestoneForProduct(phase.products[0], phase).then((timeline) => ({
      project,
      phase,
      product:phase.products[0],
      timeline,
    }))
  })
}

export function deleteProjectPhase(projectId, phaseId) {
  return (dispatch) => {
    return dispatch({
      type: DELETE_PROJECT_PHASE,
      payload: deleteProjectPhaseAPI(projectId, phaseId)
    })
  }
}

export function updateProject(projectId, updatedProps, updateExisting = false) {
  return (dispatch) => {
    return dispatch({
      type: UPDATE_PROJECT,
      payload: updateProjectAPI(projectId, updatedProps, updateExisting)
    })
  }
}

export function createScopeChangeRequest(projectId, request) {
  const flatNewScope = flatten(request.newScope, { safe: true })
  const emptyKeys = _.keys(flatNewScope).filter(key => {
    const newValue = _.get(request.newScope, key)
    const oldValue = _.get(request.oldScope, key)

    const isUnChangedEmptyObject = _.isObject(newValue) && _.isEmpty(newValue) && (_.isObject(oldValue) && _.isEmpty(oldValue) || _.isNil(oldValue))
    const isUnChangedEmptyString = newValue === '' && (oldValue === '' || _.isNil(oldValue))

    return isUnChangedEmptyObject || isUnChangedEmptyString
  })

  const cleanedRequest = {
    ...request,
    newScope: unflatten(_.omit(flatNewScope, emptyKeys))
  }

  return (dispatch) => {
    return dispatch({
      type: CREATE_SCOPE_CHANGE_REQUEST,
      payload: createScopeChangeRequestAPI(projectId, cleanedRequest)
    })
  }
}

export function approveScopeChange(projectId, scopeChangeRequestId) {
  const request = { status : SCOPE_CHANGE_REQ_STATUS_APPROVED }
  return (dispatch) => {
    return dispatch({
      type: APPROVE_SCOPE_CHANGE,
      payload: updateScopeChangeRequestAPI(projectId, scopeChangeRequestId, request)
    })
  }
}

export function rejectScopeChange(projectId, scopeChangeRequestId) {
  const request = { status : SCOPE_CHANGE_REQ_STATUS_REJECTED }
  return (dispatch) => {
    return dispatch({
      type: REJECT_SCOPE_CHANGE,
      payload: updateScopeChangeRequestAPI(projectId, scopeChangeRequestId, request)
    })
  }
}

export function cancelScopeChange(projectId, scopeChangeRequestId) {
  const request = { status: SCOPE_CHANGE_REQ_STATUS_CANCELED }
  return (dispatch) => {
    return dispatch({
      type: CANCEL_SCOPE_CHANGE,
      payload: updateScopeChangeRequestAPI(projectId, scopeChangeRequestId, request)
    })
  }
}

export function activateScopeChange(projectId, scopeChangeRequestId) {
  const request = { status: SCOPE_CHANGE_REQ_STATUS_ACTIVATED }
  return (dispatch) => {
    return dispatch({
      type: ACTIVATE_SCOPE_CHANGE,
      payload: updateScopeChangeRequestAPI(projectId, scopeChangeRequestId, request)
    })
  }
}


/**
 * Update phase info
 *
 * @param {Number} projectId           project id
 * @param {Number} phaseId             phase id
 * @param {Object} updatedProps        param need to update
 * @param {Number} phaseIndex          index of phase need to update in phase list redux
 *
 * @return {Promise} phase
 */
export function updatePhase(projectId, phaseId, updatedProps, phaseIndex) {
  return (dispatch, getState) => {
    const state = getState()
    phaseIndex = phaseIndex ? phaseIndex : _.findIndex(state.projectState.phases, { id: phaseId })
    const phase = state.projectState.phases[phaseIndex]
    const phaseStatusChanged = phase.status !== updatedProps.status
    const productId = phase.products[0].id
    const timeline = state.productsTimelines[productId] && state.productsTimelines[productId].timeline
    const phaseStartDate = timeline ? timeline.startDate : phase.startDate
    const startDateChanged = updatedProps.startDate ? updatedProps.startDate.diff(phaseStartDate) : null
    const phaseActivated = phaseStatusChanged && updatedProps.status === PHASE_STATUS_ACTIVE
    if (phaseActivated) {
      updatedProps.startDate = moment().hours(0).minutes(0).seconds(0).milliseconds(0)
    }

    return dispatch({
      type: UPDATE_PHASE,
      payload: updatePhaseAPI(projectId, phaseId, updatedProps, phaseIndex).then()
    }).then(() => {
      // finds active milestone, if exists in timeline
      const activeMilestone = timeline ? _.find(timeline.milestones, m => m.status === PHASE_STATUS_ACTIVE) : null
      // this will be done after updating timeline (if timeline update is required)
      // or immediately if timeline update is not required
      // update product milestone strictly after updating timeline
      // otherwise it could happened like this:
      // - send request to update timeline
      // - send request to update milestone
      // - get updated milestone
      // - get updated timeline (without updated milestone)
      // so otherwise we can end up with the timeline without updated milestone
      const optionallyUpdateFirstMilestone = () => {
        // update first product milestone only if
        // - there is a milestone, obviously
        // - phase's status is changed
        // - phase's status is changed to active
        // - there is not active milestone alreay (this can happen when phase is made active more than once
        // e.g. Active => Paused => Active)
        if (timeline && !activeMilestone && phaseActivated ) {
          dispatch(
            updateProductMilestone(
              productId,
              timeline.id,
              timeline.milestones[0].id,
              {status:MILESTONE_STATUS.ACTIVE}
            )
          )
        }
      }

      if (timeline && (startDateChanged || phaseActivated)) {
        dispatch(
          updateProductTimeline(
            productId,
            timeline.id,
            {
              name: timeline.name,
              startDate: updatedProps.startDate.format('YYYY-MM-DD'),
              reference: timeline.reference,
              referenceId: timeline.referenceId,
            }
          )
        ).then(optionallyUpdateFirstMilestone)
      } else {
        optionallyUpdateFirstMilestone()
      }

    // update project caused by phase updates
    }).then(() => {
      const project = state.projectState.project

      // if one phase moved to REVIEWED status, make project IN_REVIEW too
      if (
        _.includes([PROJECT_STATUS_DRAFT], project.status) &&
        phase.status !== PHASE_STATUS_REVIEWED &&
        updatedProps.status === PHASE_STATUS_REVIEWED
      ) {
        dispatch(
          updateProject(projectId, {
            status: PHASE_STATUS_REVIEWED
          }, true)
        )
      }

      // if one phase moved to ACTIVE status, make project ACTIVE too
      if (
        _.includes([PROJECT_STATUS_DRAFT, PROJECT_STATUS_IN_REVIEW, PROJECT_STATUS_REVIEWED], project.status) &&
        phase.status !== PHASE_STATUS_ACTIVE &&
        updatedProps.status === PHASE_STATUS_ACTIVE
      ) {
        dispatch(
          updateProject(projectId, {
            status: PROJECT_STATUS_ACTIVE
          }, true)
        )
      }
    })
  }
}

export function updateProduct(projectId, phaseId, productId, updatedProps) {
  return (dispatch) => {
    return dispatch({
      type: UPDATE_PRODUCT,
      payload: updateProductAPI(projectId, phaseId, productId, updatedProps)
    })
  }
}

export function createProjectWithStatus(newProject, status, projectTemplate) {
  return (dispatch) => {
    return dispatch({
      type: CREATE_PROJECT,
      payload: createProjectWithStatusAPI(newProject, status)
        .then((project) => {
          return createProjectPhaseAndProduct(project, projectTemplate, status)
            .then(() => project)
        })
    })
  }
}

export function deleteProject(newProject) {
  return (dispatch) => {
    return dispatch({
      type: DELETE_PROJECT,
      payload: deleteProjectAPI(newProject)
    })
  }
}

export function loadDirectProjectData(directProjectId) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_DIRECT_PROJECT,
      payload: getDirectProjectData(directProjectId)
    })
  }
}

export function fireProjectDirty(dirtyProject) {
  return (dispatch) => {
    return dispatch({
      type: PROJECT_DIRTY,
      payload: dirtyProject

    })
  }
}

export function firePhaseDirty(dirtyPhase, phaseId) {
  return (dispatch) => {
    return dispatch({
      type: PHASE_DIRTY,
      payload: {
        dirtyPhase,
        phaseId
      }
    })
  }
}

export function fireProductDirty(phaseId, productId, values) {
  return (dispatch) => {
    return dispatch({
      type: PRODUCT_DIRTY,
      payload: {
        phaseId,
        productId,
        values,
      }
    })
  }
}

export function fireProjectDirtyUndo() {
  return (dispatch) => {
    return dispatch({
      type: PROJECT_DIRTY_UNDO
    })
  }
}

export function firePhaseDirtyUndo() {
  return (dispatch) => {
    return dispatch({
      type: PHASE_DIRTY_UNDO
    })
  }
}

export function fireProductDirtyUndo() {
  return (dispatch) => {
    return dispatch({
      type: PRODUCT_DIRTY_UNDO
    })
  }
}
