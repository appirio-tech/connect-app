/**
 * Project and product templates actions
 */

import _ from 'lodash'
import {
  LOAD_PROJECTS_METADATA, ADD_PROJECTS_METADATA, UPDATE_PROJECTS_METADATA, REMOVE_PROJECTS_METADATA,
  PROJECT_TEMPLATES_SORT, PRODUCT_TEMPLATES_SORT, PROJECT_TYPES_SORT, FORM_SORT, PLAN_CONFIG_SORT, PRICE_CONFIG_SORT, MILESTONE_TEMPLATES_SORT, CREATE_PROJECT_TEMPLATE, CREATE_PROJECT_TYPE,
  CREATE_PRODUCT_TEMPLATE,
  CREATE_MILESTONE_TEMPLATE,
  CREATE_FORM,
  CREATE_PLAN_CONFIG,
  CREATE_PRICE_CONFIG,
  LOAD_VERSION_OPTION_LIST,
  LOAD_PROJECT_METADATA_WITH_VERSION,
  LOAD_PROJECTS_METADATA_REVISION_LIST,
  PRODUCT_CATEGORIES_SORT,
  CREATE_PRODUCT_CATEGORY,
  REMOVE_PROJECT_TYPE,
  REMOVE_PRODUCT_CATEGORY,
  REMOVE_PROJECT_TEMPLATE,
  REMOVE_PRODUCT_TEMPLATE
} from '../config/constants'
import {
  getProjectsMetadata,
  getVersionOptionList as getVersionOptionListAPI,
  getRevisionList as getRevisionListAPI,
  getProjectMetadataWithVersion as getProjectMetadataWithVersionAPI,
  createProjectsMetadata as createProjectsMetadataAPI,
  updateProjectsMetadata as updateProjectsMetadataAPI,
  deleteProjectsMetadata as deleteProjectsMetadataAPI,
  deleteProjectsMetadataSpecial as deleteProjectsMetadataSpecialAPI } from '../api/templates'

export function loadProjectsMetadata() {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECTS_METADATA,
      payload: getProjectsMetadata()
    })
  }
}

export function getProductTemplate() {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECTS_METADATA,
      payload: getProjectsMetadata()
    })
  }
}

export function getProjectMetadataWithVersion(type, key, version) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT_METADATA_WITH_VERSION,
      payload: getProjectMetadataWithVersionAPI(type, key, version)
    })
  }
}

export function getVersionOptionList(type, key) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_VERSION_OPTION_LIST,
      payload: getVersionOptionListAPI(type, key)
    })
  }
}

export function getRevisionList(type, key, version) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECTS_METADATA_REVISION_LIST,
      payload: getRevisionListAPI(type, key, version)
    })
  }
}

export function saveProductTemplate() {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECTS_METADATA,
      payload: getProjectsMetadata()
    })
  }
}

export function createProjectsMetadata(type, data) {
  return (dispatch) => {
    return dispatch({
      type: ADD_PROJECTS_METADATA,
      payload: createProjectsMetadataAPI(type, data)
    })
  }
}

export function createProjectTemplate(data) {
  return (dispatch) => {
    return dispatch({
      type: CREATE_PROJECT_TEMPLATE,
      payload: createProjectsMetadataAPI('projectTemplates', data)
    })
  }
}

export function createProductTemplate(data) {
  return (dispatch) => {
    return dispatch({
      type: CREATE_PRODUCT_TEMPLATE,
      payload: createProjectsMetadataAPI('productTemplates', data)
    })
  }
}

export function createProjectType(data) {
  return (dispatch) => {
    return dispatch({
      type: CREATE_PROJECT_TYPE,
      payload: createProjectsMetadataAPI('projectTypes', data)
    })
  }
}

export function createForm(data) {
  return (dispatch) => {
    return dispatch({
      type: CREATE_FORM,
      payload: createProjectsMetadataAPI('form', data)
    })
  }
}

export function createPlanConfig(data) {
  return (dispatch) => {
    return dispatch({
      type: CREATE_PLAN_CONFIG,
      payload: createProjectsMetadataAPI('planConfig', data)
    })
  }
}

export function createPriceConfig(data) {
  return (dispatch) => {
    return dispatch({
      type: CREATE_PRICE_CONFIG,
      payload: createProjectsMetadataAPI('priceConfig', data)
    })
  }
}

export function createMilestoneTemplate(data) {
  return (dispatch) => {
    return dispatch({
      type: CREATE_MILESTONE_TEMPLATE,
      payload: createProjectsMetadataAPI('milestoneTemplates', data)
    })
  }
}

export function createProductCategory(data) {
  return (dispatch) => {
    return dispatch({
      type: CREATE_PRODUCT_CATEGORY,
      payload: createProjectsMetadataAPI('productCategories', data)
    })
  }
}

export function updateProjectsMetadata(metadataId, type, data) {
  return (dispatch) => {
    return dispatch({
      type: UPDATE_PROJECTS_METADATA,
      payload: updateProjectsMetadataAPI(metadataId, type, data)
    })
  }
}

export function deleteProjectsMetadata(metadataId, type) {
  return (dispatch) => {
    return dispatch({
      type: REMOVE_PROJECTS_METADATA,
      payload: deleteProjectsMetadataAPI(metadataId, type)
    })
  }
}

export function deleteProjectsMetadataSpecial(metadataId, type, data) {
  return (dispatch) => {
    return dispatch({
      type: REMOVE_PROJECTS_METADATA,
      payload: deleteProjectsMetadataSpecialAPI(metadataId, type, data)
    })
  }
}

export function deleteProjectTemplate(metadataId) {
  return (dispatch) => {
    return dispatch({
      type: REMOVE_PROJECT_TEMPLATE,
      payload: deleteProjectsMetadataAPI(metadataId, 'projectTemplates')
    })
  }
}

export function deleteProjectType(metadataId) {
  return (dispatch) => {
    return dispatch({
      type: REMOVE_PROJECT_TYPE,
      payload: deleteProjectsMetadataAPI(metadataId, 'projectTypes')
    })
  }
}

export function deleteProductTemplate(metadataId) {
  return (dispatch) => {
    return dispatch({
      type: REMOVE_PRODUCT_TEMPLATE,
      payload: deleteProjectsMetadataAPI(metadataId, 'productTemplates')
    })
  }
}

export function deleteProductCategory(metadataId) {
  return (dispatch) => {
    return dispatch({
      type: REMOVE_PRODUCT_CATEGORY,
      payload: deleteProjectsMetadataAPI(metadataId, 'productCategories')
    })
  }
}

export function sortProjectTemplates(criteria) {
  return (dispatch) => {
    const fieldName = _.split(criteria, ' ')[0]
    const order = _.split(criteria, ' ')[1] || 'asc'

    return dispatch({
      type: PROJECT_TEMPLATES_SORT,
      payload: { fieldName, order }
    })
  }
}

export function sortProductTemplates(criteria) {
  return (dispatch) => {
    const fieldName = _.split(criteria, ' ')[0]
    const order = _.split(criteria, ' ')[1] || 'asc'

    return dispatch({
      type: PRODUCT_TEMPLATES_SORT,
      payload: { fieldName, order }
    })
  }
}

export function sortProjectTypes(criteria) {
  return (dispatch) => {
    const fieldName = _.split(criteria, ' ')[0]
    const order = _.split(criteria, ' ')[1] || 'asc'

    return dispatch({
      type: PROJECT_TYPES_SORT,
      payload: { fieldName, order }
    })
  }
}

export function sortForms(criteria) {
  return (dispatch) => {
    const fieldName = _.split(criteria, ' ')[0]
    const order = _.split(criteria, ' ')[1] || 'asc'

    return dispatch({
      type: FORM_SORT,
      payload: { fieldName, order }
    })
  }
}

export function sortPlanConfigs(criteria) {
  return (dispatch) => {
    const fieldName = _.split(criteria, ' ')[0]
    const order = _.split(criteria, ' ')[1] || 'asc'

    return dispatch({
      type: PLAN_CONFIG_SORT,
      payload: { fieldName, order }
    })
  }
}

export function sortPriceConfigs(criteria) {
  return (dispatch) => {
    const fieldName = _.split(criteria, ' ')[0]
    const order = _.split(criteria, ' ')[1] || 'asc'

    return dispatch({
      type: PRICE_CONFIG_SORT,
      payload: { fieldName, order }
    })
  }
}

export function sortMilestoneTemplates(criteria) {
  return (dispatch) => {
    const fieldName = _.split(criteria, ' ')[0]
    const order = _.split(criteria, ' ')[1] || 'asc'

    return dispatch({
      type: MILESTONE_TEMPLATES_SORT,
      payload: { fieldName, order }
    })
  }
}

export function sortProductCategories(criteria) {
  return (dispatch) => {
    const fieldName = _.split(criteria, ' ')[0]
    const order = _.split(criteria, ' ')[1] || 'asc'

    return dispatch({
      type: PRODUCT_CATEGORIES_SORT,
      payload: { fieldName, order }
    })
  }
}
