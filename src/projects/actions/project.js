import { getProjectById, createProject as createProjectAPI,
  createProjectWithStatus as createProjectWithStatusAPI,
  updateProject as updateProjectAPI,
  deleteProject as deleteProjectAPI,
  getDirectProjectData,
  getProjectPhases,
  getProjectPhaseProducts } from '../../api/projects'
import { getProjectTemplateByKey, getProductTemplate } from '../../api/templates'
import { LOAD_PROJECT, CREATE_PROJECT, CLEAR_LOADED_PROJECT, UPDATE_PROJECT,
  LOAD_DIRECT_PROJECT, DELETE_PROJECT, PROJECT_DIRTY, PROJECT_DIRTY_UNDO, LOAD_PROJECT_PHASES,
  LOAD_PROJECT_TEMPLATE } from '../../config/constants'
import { getPhasesWithProductsFromProjectV2 } from '../helpers/converter'

export function loadProject(projectId) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT,
      payload: getProjectById(projectId)
    })
  }
}

/**
 * Populate each phase with `products` property containing all phase products
 *
 * @param {Array} phases list of phases
 *
 * @return {Array} modified array of phases with `products` property
 */
function populatePhasesProducts(phases) {
  return Promise.all(phases.map((phase) => getProjectPhaseProducts(phase.id)))
    .then((phasesProducts) => {
      phases.forEach((phase, phaseIndex) => {
        phase.products = phasesProducts[phaseIndex]
      })

      return phases
    })
}

/**
 * Populate each product of the phase with `template` property contains product template
 *
 * @param {Object} phase phase
 *
 * @return {Object} modified phase with products having `template` property
 */
function populatePhaseProductsTemplates(phase) {
  return Promise.all(phase.products.map((product) => getProductTemplate(product.templateId)))
    .then((productsTemplates) => {
      phase.products.forEach((product, productIndex) => {
        product.template = productsTemplates[productIndex]
      })

      return phase
    })
}

/**
 * Populate each product of the each phase with `template` property contains product template
 *
 * @param {Array} phases list of phases
 *
 * @return {Array} modified array of phases with products having `template` property
 */
function populatePhasesProductsTemplates(phases) {
  return Promise.all(phases.map(populatePhaseProductsTemplates))
}

/**
 * Load project phases with populated products
 * And all the products have populated products templates
 *
 * NOTE
 *   Params project, directProject and projectTemplate are only needed to
 *   convert old projects to the new project format with phases
 *
 * @param {String} projectId       project id
 * @param {Object} project         project
 * @param {Object} directProject   direct project
 * @param {Object} projectTemplate project template
 */
export function loadProjectPhasesWithProducts(projectId, project, directProject, projectTemplate) {
  return (dispatch) => {
    // for the new project version use API
    if (project.version === 'v3') {
      return dispatch({
        type: LOAD_PROJECT_PHASES,
        payload: getProjectPhases(projectId)
          .then(populatePhasesProducts)
          .then(populatePhasesProductsTemplates)
      })
    }

    // for the old version get phases from project
    return dispatch({
      type: LOAD_PROJECT_PHASES,
      payload: getPhasesWithProductsFromProjectV2(project, directProject, projectTemplate)
        .then(populatePhasesProductsTemplates)
    })
  }
}

export function loadProjectTemplateByKey(templateKey) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT_TEMPLATE,
      payload: getProjectTemplateByKey(templateKey)
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

export function createProjectWithStatus(newProject, status) {
  return (dispatch) => {
    return dispatch({
      type: CREATE_PROJECT,
      payload: createProjectWithStatusAPI(newProject, status)
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

export function fireProjectDirtyUndo() {
  return (dispatch) => {
    return dispatch({
      type: PROJECT_DIRTY_UNDO
    })
  }
}
