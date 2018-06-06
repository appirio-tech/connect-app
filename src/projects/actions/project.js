import _ from 'lodash'
import moment from 'moment'
import { getProjectById, createProject as createProjectAPI,
  createProjectWithStatus as createProjectWithStatusAPI,
  updateProject as updateProjectAPI,
  deleteProject as deleteProjectAPI,
  getDirectProjectData,
  getProjectPhases,
  getPhaseProducts,
  updateProduct as updateProductAPI,
  createProjectPhase,
  createPhaseProduct,
} from '../../api/projects'
import { getProductTemplate, getProjectTemplate, getProductTemplateByKey } from '../../api/templates'
import { LOAD_PROJECT, CREATE_PROJECT, CLEAR_LOADED_PROJECT, UPDATE_PROJECT,
  LOAD_DIRECT_PROJECT, DELETE_PROJECT, PROJECT_DIRTY, PROJECT_DIRTY_UNDO, LOAD_PROJECT_PHASES,
  LOAD_PROJECT_TEMPLATE, LOAD_PROJECT_PRODUCT_TEMPLATES, UPDATE_PRODUCT,
  PROJECT_STATUS_DRAFT, PRODUCT_DIRTY, PRODUCT_DIRTY_UNDO,
} from '../../config/constants'

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
 * @return {Promise} modified array of phases with `products` property
 */
function populatePhasesProducts(phases) {
  return Promise.all(phases.map((phase) => getPhaseProducts(phase.projectId, phase.id)))
    .then((phasesProducts) => {
      phases.forEach((phase, phaseIndex) => {
        phase.products = phasesProducts[phaseIndex]
      })

      return phases
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
      payload: getProjectPhases(projectId)
        .then(populatePhasesProducts)
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
    for(let phaseName in projectTemplate.phases) {
      let phase = projectTemplate.phases[phaseName];
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

export function createProject(newProject, projectTemplate) {
  return (dispatch) => {
    return dispatch({
      type: CREATE_PROJECT,
      payload: createProjectAPI(newProject)
        .then((project) => createProjectPhaseAndProduct(project, projectTemplate))
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
function createProjectPhaseAndProduct(project, projectTemplate, status = PROJECT_STATUS_DRAFT) {
  return createProjectPhase(project.id, {
    status,
    name: projectTemplate.name,
    startDate: new Date(),

    // TODO $PROJECT_PLAN$ remove the next dummy values when endDate is not mandatory by back-end
    endDate: moment().add(17, 'days').format(),
  }).then((phase) => {
    return createPhaseProduct(project.id, phase.id, {
      name: projectTemplate.name,
      templateId: projectTemplate.id,
      type: projectTemplate.key,
    })
      .then(() => project)
  })
}

export function updateProject(projectId, updatedProps, updateExisting = false) {
  return (dispatch) => {
    return dispatch({
      type: UPDATE_PROJECT,
      payload: updateProjectAPI(projectId, updatedProps, updateExisting)
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
        .then((project) => createProjectPhaseAndProduct(project, projectTemplate, status))
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

export function fireProductDirtyUndo() {
  return (dispatch) => {
    return dispatch({
      type: PRODUCT_DIRTY_UNDO
    })
  }
}
