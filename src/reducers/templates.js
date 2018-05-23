import {
  LOAD_PROJECT_TEMPLATES_PENDING,
  LOAD_PROJECT_TEMPLATES_SUCCESS,
  LOAD_PROJECT_TYPES_PENDING,
  LOAD_PROJECT_TYPES_SUCCESS,
} from '../config/constants'

export const initialState = {
  projectTemplates: null,
  isProjectTemplatesLoading: false,
  projectTypes: null,
  isProjectTypesLoading: false,
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
  case LOAD_PROJECT_TYPES_PENDING:
    return {...state,
      isProjectTypesLoading: true,
    }

  case LOAD_PROJECT_TYPES_SUCCESS:
    return {...state,
      projectTypes: action.payload,
      isProjectTypesLoading: false,
    }

  default: return state
  }
}
