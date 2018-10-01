import {
  LOAD_PROJECTS_METADATA_PENDING,
  LOAD_PROJECTS_METADATA_SUCCESS,
} from '../config/constants'

export const initialState = {
  projectTemplates: null,
  projectCategories: null,
  productTemplates: null,
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
    const { projectTemplates, productTemplates, projectTypes } = action.payload
    return {
      ...state,
      projectTemplates,
      productTemplates,
      projectCategories: projectTypes,
      isLoading: false,
    }
  }
  default: return state
  }
}
