import _ from 'lodash'
import moment from 'moment'
import { flatten, unflatten } from 'flat'
import { getProjectById,
  createProject as createProjectAPI,
  createProjectWithStatus as createProjectWithStatusAPI,
  updateProject as updateProjectAPI,
  deleteProject as deleteProjectAPI,
  deleteProjectPhase as deleteProjectPhaseAPI,
  getProjectPhases,
  updateProduct as updateProductAPI,
  updatePhase as updatePhaseAPI,
  createProjectPhase,
  createScopeChangeRequest as createScopeChangeRequestAPI,
  updateScopeChangeRequest as updateScopeChangeRequestAPI,
} from '../../api/projects'
import {
  getProjectInviteById,
  getProjectMemberInvites,
} from '../../api/projectMemberInvites'
import {
  updateMilestones,
  createTimeline,
} from '../../api/timelines'
import {
  getProjectMembers, getProjectMember
} from '../../api/projectMembers'
// import { loadProductTimelineWithMilestones } from './productsTimelines'
import {
  LOAD_PROJECT,
  LOAD_PROJECT_MEMBER_INVITE,
  CREATE_PROJECT,
  CLEAR_LOADED_PROJECT,
  UPDATE_PROJECT,
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
  PHASE_STATUS_DRAFT,
  LOAD_PROJECT_MEMBERS,
  LOAD_PROJECT_MEMBER_INVITES,
  CREATE_PROJECT_PHASE_TIMELINE_MILESTONES,
  LOAD_PROJECT_MEMBER,
  ES_REINDEX_DELAY
} from '../../config/constants'
import {
  updateProductMilestone,
  updateProductTimeline
} from './productsTimelines'
import { delay } from '../../helpers/utils'
import { hasPermission } from '../../helpers/permissions'
import { PERMISSIONS } from '../../config/permissions'

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
  return (dispatch, getState) => {
    const loadUserState = getState().loadUser
    return dispatch({
      type: LOAD_PROJECT_MEMBER_INVITE,
      payload: getProjectInviteById(projectId)
        .then((invites) => {
          if (loadUserState.isLoggedIn && loadUserState.user) {
            const user = loadUserState.user
            return Promise.resolve({ invites, currentUserId: user.userId, currentUserEmail: user.email })
          } else {
            return Promise.resolve(invites)
          }
        })
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

/**
 * Create phase and product for the project
 *
 * @param {Object} project         project
 * @param {Object} projectTemplate project template
 * @param {String} status          (optional) project/phase status
 *
 * @return {Promise} project
 */
export function createProjectPhaseAndProduct(project, projectTemplate, status = PHASE_STATUS_DRAFT, startDate, endDate) {
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


/**
 * Create phase and product and milestones for the project
 *
 * @param {Object} project         project
 * @param {Object} projectTemplate project template
 * @param {String} status          (optional) project/phase status
 * @param {Object} startDate       phase startDate
 * @param {Object} endDate         phase endDate
 * @param {Array}  milestones      milestones
 *
 * @return {Promise} project
 */
function createPhaseAndMilestonesRequest(project, projectTemplate, status = PHASE_STATUS_DRAFT, startDate, endDate, milestones) {
  return createProjectPhaseAndProduct(project, projectTemplate, status, startDate, endDate).then(({timeline, phase, project, product}) => {
    // we have to add delay before creating milestones in newly created timeline
    // to make sure timeline is created in ES, otherwise it may happen that we would try to add milestones
    // into timeline before timeline existent in ES
    return delay(ES_REINDEX_DELAY).then(() => updateMilestones(timeline.id, milestones).then((data) => ({
      phase,
      project,
      product,
      timeline,
      milestones: data
    })))
  })
}


export function createPhaseAndMilestones(project, projectTemplate, status, startDate, endDate, milestones) {
  return (dispatch) => {
    return dispatch({
      type: CREATE_PROJECT_PHASE_TIMELINE_MILESTONES,
      payload: createPhaseAndMilestonesRequest(project, projectTemplate, status, startDate, endDate, milestones)
    })
  }
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

    updatedProps.startDate = moment(updatedProps.startDate).format('YYYY-MM-DD')
    updatedProps.endDate = moment(updatedProps.endDate).format('YYYY-MM-DD')

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
              startDate: updatedProps.startDate,
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

      // if one phase moved to ACTIVE status, make project ACTIVE too
      if (
        _.includes([PROJECT_STATUS_DRAFT, PROJECT_STATUS_IN_REVIEW, PROJECT_STATUS_REVIEWED], project.status) &&
        phase.status !== PHASE_STATUS_ACTIVE &&
        updatedProps.status === PHASE_STATUS_ACTIVE &&
        hasPermission(PERMISSIONS.EDIT_PROJECT_STATUS_TO_ACTIVE)
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

export function loadProjectMembers(projectId) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT_MEMBERS,
      payload: getProjectMembers(projectId)
    })
  }
}

export function loadProjectMemberInvites(projectId) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT_MEMBER_INVITES,
      payload: getProjectMemberInvites(projectId)
    })
  }
}

export function loadProjectMember(projectId, memberId) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT_MEMBER,
      payload: getProjectMember(projectId, memberId)
    })
  }
}
