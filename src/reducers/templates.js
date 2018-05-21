import {
  LOAD_PROJECT_TEMPLATES_PENDING,
  LOAD_PROJECT_TEMPLATES_SUCCESS,
} from '../config/constants'

export const initialState = {
  projectTemplates: null,
  isProjectTemplatesLoading: false,
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

  default: return state
  }
}
