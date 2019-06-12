
import _ from 'lodash'
import update from 'react-addons-update'
import {
  LOAD_PROJECTS_METADATA_PENDING,
  LOAD_PROJECTS_METADATA_SUCCESS,
  ADD_PROJECTS_METADATA_PENDING,
  UPDATE_PROJECTS_METADATA_PENDING,
  REMOVE_PROJECTS_METADATA_PENDING,
  ADD_PROJECTS_METADATA_FAILURE,
  UPDATE_PROJECTS_METADATA_FAILURE,
  REMOVE_PROJECTS_METADATA_FAILURE,
  ADD_PROJECTS_METADATA_SUCCESS,
  UPDATE_PROJECTS_METADATA_SUCCESS,
  REMOVE_PROJECTS_METADATA_SUCCESS,
  PROJECT_TEMPLATES_SORT,
  PRODUCT_TEMPLATES_SORT,
  PROJECT_TYPES_SORT,
  MILESTONE_TEMPLATES_SORT,
  CREATE_PROJECT_TEMPLATE_PENDING,
  CREATE_PROJECT_TEMPLATE_FAILURE,
  CREATE_PROJECT_TEMPLATE_SUCCESS,
  CREATE_PRODUCT_TEMPLATE_PENDING,
  CREATE_PROJECT_TYPE_PENDING,
  CREATE_PRODUCT_TEMPLATE_FAILURE,
  CREATE_PROJECT_TYPE_FAILURE,
  CREATE_PRODUCT_TEMPLATE_SUCCESS,
  CREATE_PROJECT_TYPE_SUCCESS,
  CREATE_MILESTONE_TEMPLATE_SUCCESS,
  CREATE_MILESTONE_TEMPLATE_PENDING,
  CREATE_MILESTONE_TEMPLATE_FAILURE,
  REMOVE_PRODUCT_CATEGORY_PENDING,
  REMOVE_PROJECT_TYPE_PENDING,
  REMOVE_PRODUCT_CATEGORY_FAILURE,
  REMOVE_PROJECT_TYPE_FAILURE,
  REMOVE_PRODUCT_CATEGORY_SUCCESS,
  REMOVE_PROJECT_TYPE_SUCCESS,
  PRODUCT_CATEGORIES_SORT,
  REMOVE_PROJECT_TEMPLATE_SUCCESS,
  REMOVE_PRODUCT_TEMPLATE_SUCCESS,
  REMOVE_PROJECT_TEMPLATE_FAILURE,
  REMOVE_PRODUCT_TEMPLATE_FAILURE,
  REMOVE_PROJECT_TEMPLATE_PENDING,
  REMOVE_PRODUCT_TEMPLATE_PENDING
} from '../config/constants'
import Alert from 'react-s-alert'

export const initialState = {
  projectTemplates: null,
  projectTypes: null,
  productTemplates: null,
  productCategories: null,
  milestoneTemplates: null,
  isLoading: false,
  isRemoving: false,
  error: false,
}

export default function(state = initialState, action) {
  switch (action.type) {
  case LOAD_PROJECTS_METADATA_PENDING:
    return {
      ...state,
      isLoading: true
    }
  case LOAD_PROJECTS_METADATA_SUCCESS: {
    const { projectTemplates, projectTypes, productTemplates, productCategories, milestoneTemplates } = action.payload
    return {
      ...state,
      projectTemplates: _.orderBy(projectTemplates, ['updatedAt'], ['desc']),
      projectTypes: _.orderBy(projectTypes, ['updatedAt'], ['desc']),
      productTemplates: _.orderBy(productTemplates, ['updatedAt'], ['desc']),
      productCategories: _.orderBy(productCategories, ['updatedAt'], ['desc']),
      milestoneTemplates: _.orderBy(milestoneTemplates, ['updatedAt'], ['desc']),
      isLoading: false,
    }
  }
  case ADD_PROJECTS_METADATA_PENDING:
  case CREATE_PROJECT_TEMPLATE_PENDING:
  case CREATE_PRODUCT_TEMPLATE_PENDING:
  case CREATE_PROJECT_TYPE_PENDING:
  case CREATE_MILESTONE_TEMPLATE_PENDING:
  case UPDATE_PROJECTS_METADATA_PENDING:
    return {
      ...state,
      isLoading: true
    }
  case REMOVE_PROJECTS_METADATA_PENDING:
  case REMOVE_PRODUCT_CATEGORY_PENDING:
  case REMOVE_PROJECT_TYPE_PENDING:
  case REMOVE_PROJECT_TEMPLATE_PENDING:
  case REMOVE_PRODUCT_TEMPLATE_PENDING:
    return {
      ...state,
      isRemoving: true
    }
  case ADD_PROJECTS_METADATA_FAILURE:
  case CREATE_PROJECT_TEMPLATE_FAILURE:
  case CREATE_PRODUCT_TEMPLATE_FAILURE:
  case CREATE_PROJECT_TYPE_FAILURE:
  case CREATE_MILESTONE_TEMPLATE_FAILURE:
    Alert.error(`PROJECT METADATA CREATE FAILED: ${action.payload.response.data.result.content.message}`)
    return {
      ...state,
      isLoading: false,
      error: action.payload.response.data.result.content.message
    }
  case UPDATE_PROJECTS_METADATA_FAILURE:
    Alert.error(`PROJECT METADATA UPDATE FAILED: ${action.payload.response.data.result.content.message}`)
    return {
      ...state,
      isLoading: false,
      error: action.payload.response.data.result.content.message
    }
  case REMOVE_PROJECTS_METADATA_FAILURE:
  case REMOVE_PRODUCT_CATEGORY_FAILURE:
  case REMOVE_PROJECT_TYPE_FAILURE:
  case REMOVE_PROJECT_TEMPLATE_FAILURE:
  case REMOVE_PRODUCT_TEMPLATE_FAILURE:
    Alert.error(`PROJECT METADATA DELETE FAILED: ${action.payload.response.data.result.content.message}`)
    return {
      ...state,
      isRemoving: false,
      error: action.payload.response.data.result.content.message
    }
  case ADD_PROJECTS_METADATA_SUCCESS:
  case CREATE_PROJECT_TEMPLATE_SUCCESS:
  case CREATE_PRODUCT_TEMPLATE_SUCCESS:
  case CREATE_PROJECT_TYPE_SUCCESS:
  case CREATE_MILESTONE_TEMPLATE_SUCCESS:
    Alert.success('PROJECT METADATA CREATE SUCCESS')
    return {
      ...state,
      isLoading: false,
      metadata: action.payload,
      error: false,
    }
  case UPDATE_PROJECTS_METADATA_SUCCESS:
    Alert.success('PROJECT METADATA UPDATE SUCCESS')
    return {
      ...state,
      isLoading: false,
      metadata: action.payload,
      error: false,
    }
  case REMOVE_PROJECTS_METADATA_SUCCESS:
  case REMOVE_PRODUCT_CATEGORY_SUCCESS:
  case REMOVE_PROJECT_TYPE_SUCCESS:
  case REMOVE_PROJECT_TEMPLATE_SUCCESS: {
    Alert.success('PROJECT METADATA DELETE SUCCESS')
    // TODO remove metadata from the state
    let projectTemplates = state.projectTemplates
    const metadataId = action.payload.metadataId
    if (action.payload.type === 'projectTemplates') {
      if (metadataId) {
        projectTemplates = _.filter(projectTemplates, m => m.id !== metadataId)
      }
    }
    return update (state, {
      isRemoving: { $set : false },
      error: { $set : false },
      projectTemplates: { $set : projectTemplates }
    })
  }
  case REMOVE_PRODUCT_TEMPLATE_SUCCESS: {
    Alert.success('PRODUCT DELETE SUCCESS')
    let productTemplates = state.productTemplates
    const metadataId = action.payload.metadataId
    if (metadataId) {
      productTemplates = _.filter(productTemplates, m => m.id !== metadataId)
    }
    return update (state, {
      isRemoving: { $set : false },
      error: { $set : false },
      productTemplates: { $set : productTemplates }
    })
  }
  case PROJECT_TEMPLATES_SORT: {
    const fieldName = action.payload.fieldName
    const order = action.payload.order
    return {
      ...state,
      projectTemplates: _.orderBy(state.projectTemplates, [`${fieldName}`], [`${order}`]),
    }
  }
  case PRODUCT_TEMPLATES_SORT: {
    const fieldName = action.payload.fieldName
    const order = action.payload.order
    return {
      ...state,
      productTemplates: _.orderBy(state.productTemplates, [`${fieldName}`], [`${order}`]),
    }
  }
  case PROJECT_TYPES_SORT: {
    const fieldName = action.payload.fieldName
    const order = action.payload.order
    return {
      ...state,
      projectTypes: _.orderBy(state.projectTypes, [`${fieldName}`], [`${order}`]),
    }
  }
  case MILESTONE_TEMPLATES_SORT: {
    const fieldName = action.payload.fieldName
    const order = action.payload.order
    return {
      ...state,
      milestoneTemplates: _.orderBy(state.milestoneTemplates, [`${fieldName}`], [`${order}`]),
    }
  }
  case PRODUCT_CATEGORIES_SORT: {
    const fieldName = action.payload.fieldName
    const order = action.payload.order
    return {
      ...state,
      productCategories: _.orderBy(state.productCategories, [`${fieldName}`], [`${order}`]),
    }
  }
  default: return state
  }
}
