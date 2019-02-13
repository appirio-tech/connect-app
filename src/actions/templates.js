/**
 * Project and product templates actions
 */

import _ from 'lodash'
import {
  LOAD_PROJECTS_METADATA, ADD_PROJECTS_METADATA, UPDATE_PROJECTS_METADATA, REMOVE_PROJECTS_METADATA,
  PROJECT_TEMPLATES_SORT, PRODUCT_TEMPLATES_SORT, PROJECT_TYPES_SORT, CREATE_PROJECT_TEMPLATE, CREATE_PROJECT_TYPE,
  CREATE_PRODUCT_TEMPLATE,
  PRODUCT_CATEGORIES_SORT,
  CREATE_PRODUCT_CATEGORY,
  REMOVE_PROJECT_TYPE,
  REMOVE_PRODUCT_CATEGORY,
  REMOVE_PROJECT_TEMPLATE,
  REMOVE_PRODUCT_TEMPLATE
} from '../config/constants'
import {
  getProjectsMetadata,
  createProjectsMetadata as createProjectsMetadataAPI,
  updateProjectsMetadata as updateProjectsMetadataAPI,
  deleteProjectsMetadata as deleteProjectsMetadataAPI } from '../api/templates'

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