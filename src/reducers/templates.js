import {
  LOAD_PROJECT_TEMPLATES_PENDING,
  LOAD_PROJECT_TEMPLATES_SUCCESS,
  LOAD_PROJECT_CATEGORIES_PENDING,
  LOAD_PROJECT_CATEGORIES_SUCCESS,
} from '../config/constants'

export const initialState = {
  projectTemplates: null,
  isProjectTemplatesLoading: false,
  projectCategories: null,
  isProjectCategoriesLoading: false,
}

export default function(state = initialState, action) {
  switch (action.type) {
  case LOAD_PROJECT_TEMPLATES_PENDING:
    return {...state,
      isProjectTemplatesLoading: true,
    }

  case LOAD_PROJECT_TEMPLATES_SUCCESS:
    return {...state,
      projectTemplates: action.payload,
      isProjectTemplatesLoading: false,
    }
  case LOAD_PROJECT_CATEGORIES_PENDING:
    return {...state,
      isProjectCategoriesLoading: true,
    }

  case LOAD_PROJECT_CATEGORIES_SUCCESS:
    return {...state,
      projectCategories: action.payload,
      isProjectCategoriesLoading: false,
    }

  default: return state
  }
}
