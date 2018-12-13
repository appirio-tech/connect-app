import {
  LOAD_PROJECTS_METADATA_PENDING,
  LOAD_PROJECTS_METADATA_SUCCESS,
} from '../config/constants'

export const initialState = {
  projectTemplates: null,
  projectTypes: null,
  productTemplates: null,
  productCategories: null,
  isLoading: false,
}

export default function(state = initialState, action) {
  switch (action.type) {
  case LOAD_PROJECTS_METADATA_PENDING:
    return {
      ...state,
      isLoading: true,
    }
  case LOAD_PROJECTS_METADATA_SUCCESS: {
    const { projectTemplates, projectTypes, productTemplates, productCategories } = action.payload
    return {
      ...state,
      projectTemplates,
      projectTypes,
      productTemplates,
      productCategories,
      isLoading: false,
    }
  }
  default: return state
  }
}
