import _ from 'lodash'
import moment from 'moment'
import { getProjectById, createProject as createProjectAPI,
  createProjectWithStatus as createProjectWithStatusAPI,
  updateProject as updateProjectAPI,
  deleteProject as deleteProjectAPI,
  deleteProjectPhase as deleteProjectPhaseAPI,
  getDirectProjectData,
  getProjectPhases,
  updateProduct as updateProductAPI,
  updatePhase as updatePhaseAPI,
  createProjectPhase,
  createPhaseProduct,
} from '../../api/projects'
import {
  getProductTemplate,
  getProjectTemplate,
  getProductTemplateByKey,
} from '../../api/templates'
import {
  createTimeline,
} from '../../api/timelines'
// import { loadProductTimelineWithMilestones } from './productsTimelines'
import {
  LOAD_PROJECT,
  CREATE_PROJECT,
  CREATE_PROJECT_STAGE,
  CLEAR_LOADED_PROJECT,
  UPDATE_PROJECT,
  LOAD_DIRECT_PROJECT,
  DELETE_PROJECT,
  PROJECT_DIRTY,
  PROJECT_DIRTY_UNDO,
  LOAD_PROJECT_PHASES,
  LOAD_PROJECT_TEMPLATE,
  LOAD_PROJECT_PRODUCT_TEMPLATES,
  LOAD_ALL_PRODUCT_TEMPLATES,
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
  PROJECT_STATUS_ACTIVE
} from '../../config/constants'
import {
  updateProductMilestone,
  updateProductTimeline
} from './productsTimelines'

export function loadProject(projectId) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT,
      payload: getProjectById(projectId)
    })
  }
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

/**
 * Load project template
 *
 * @param {String} id  template id
 *
 * @return {Promise} LOAD_PROJECT_TEMPLATE action with payload as project template object
 */
export function loadProjectTemplate(id) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT_TEMPLATE,
      payload: getProjectTemplate(id)
    })
  }
}

/**
 * Load product templates for a project
 *
 * NOTE
 *   This function checks which product templates are already loaded and only loads which are not in the store yet
 *   Loaded but unnecessary product templates will be removed
 *
 * @param {Object} projectTemplate project template of the project
 *
 * @return {Promise} LOAD_PROJECT_PRODUCT_TEMPLATES action with payload as array of product templates
 */
export function loadProjectProductTemplates(projectTemplate) {
  return (dispatch, getState) => {
    const productTemplates = getState().projectState.productTemplates

    const alreadyLoadedProductTemplates = []
    const notLoadedProductTemplatesIds = []

    // check which product templates we have already loaded, and which we have to load
    for(const phaseName in projectTemplate.phases) {
      const phase = projectTemplate.phases[phaseName]
      phase.products.forEach((product) => {
        const alreadyLoadedProductTemplate = _.find(productTemplates, { id: product.id })

        if (alreadyLoadedProductTemplate) {
          alreadyLoadedProductTemplates.push(alreadyLoadedProductTemplate)
        } else {
          notLoadedProductTemplatesIds.push(product.id)
        }
      })
    }

    return dispatch({
      type: LOAD_PROJECT_PRODUCT_TEMPLATES,
      payload: Promise.all(notLoadedProductTemplatesIds.map((id) => getProductTemplate(id)))
        .then((loadedProductTemplates) => [
          ...alreadyLoadedProductTemplates,
          ...loadedProductTemplates,
        ])
    })
  }
}

/**
 * Load all product templates
 *
 * NOTE
 *   This function loads all product templates which are not in the store yet
 *
 * @param {Object} projectTemplate project template of the project
 *
 * @return {Promise} LOAD_ALL_PRODUCT_TEMPLATES action with payload as array of product templates
 */
export function loadAllProductTemplates() {
  return (dispatch) => {
    return dispatch({
      type: LOAD_ALL_PRODUCT_TEMPLATES,
      payload: Promise.resolve(getProductTemplateByKey())
    })
  }
}

/**
 * Load product template by product key
 *
 * NOTE
 *   This is only need for old projects and it always has only one product template
 *
 * @param {String} productKey product key
 *
 * @return {Promise} LOAD_PROJECT_PRODUCT_TEMPLATES action with payload as array with one product template
 */
export function loadProjectProductTemplatesByKey(productKey) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT_PRODUCT_TEMPLATES,
      payload: Promise.all([getProductTemplateByKey(productKey)])
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
function getAllProjectProducts(project) {
  return getProjectPhasesWithProducts(project.id)
    .then((phases) => _.flatten(_.map(phases, 'products')))
}

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
  return getAllProjectProducts(project)
    .then((products) =>
      Promise.all(products.map(createTimelineAndMilestoneForProduct))
    )
    .then(() => project)
}

export function createProduct(project, productTemplate, phases, timelines) {
  let startDate = moment().hours(0).minutes(0).seconds(0)
    .milliseconds(0)
  if(phases && phases.length > 0) {
    const phase = _.maxBy(phases, 'startDate')
    const productId = _.get(phase, 'products[0].id', -1)
    const timelineState = timelines && timelines[productId] ? timelines[productId] : null
    if (timelineState && timelineState.timeline) {
      // finds the last milestone of the timeline in the phase
      const lastMilestone = _.maxBy(timelineState.timeline.milestones, 'order')
      // calculates the start date for the new phase by adding 1 day to the end date of the milestone
      // we don't use end date field of milestone because it might not reflect the correct end date
      if (lastMilestone && lastMilestone.startDate) {
        startDate = moment(lastMilestone.startDate).hours(0).minutes(0).seconds(0)
          .milliseconds(0).add(lastMilestone.duration - 1, 'days').add(1, 'days')
      }
    } else if (phase && phase.startDate) {
      // if there is no timeline for the phase, calculates the next phase's start date by adding 1 day to the
      // end date of last phase, we don't use end date field of milestone because it might not reflect the
      // correct end date
      startDate = moment(phase.startDate).hours(0).minutes(0).seconds(0)
        .milliseconds(0).add(phase.duration - 1, 'days').add(1, 'days')
    } else {
      // do nothing, use today as start date
    }
  }
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
    name: projectTemplate.name
  }
  if (startDate) {
    param['startDate'] = startDate.format('YYYY-MM-DD')
  }
  if (endDate) {
    param['endDate'] = endDate.format('YYYY-MM-DD')
  }

  return createProjectPhase(project.id, param).then((phase) => {
    return createPhaseProduct(project.id, phase.id, {
      name: projectTemplate.name,
      templateId: projectTemplate.id,
      type: projectTemplate.key || projectTemplate.productKey,
    }).then((product) => {
      // we also wait until timeline is created as we will load it for the phase after creation
      return createTimelineAndMilestoneForProduct(product, phase).then((timeline) => ({
        project,
        phase,
        product,
        timeline,
      }))
    })
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
    const phase = state.projectState.phases[phaseIndex]
    const phaseStatusChanged = phase.status !== updatedProps.status
    const productId = phase.products[0].id
    const timeline = state.productsTimelines[productId] && state.productsTimelines[productId].timeline
    const startDateChanged =updatedProps.startDate && updatedProps.startDate.diff(timeline.startDate)
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
            status: PROJECT_STATUS_IN_REVIEW
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
        phaseId }

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
