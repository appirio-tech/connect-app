import {
  LOAD_PROJECT_SUMMARY_PENDING,
  LOAD_PROJECT_SUMMARY_SUCCESS,
  LOAD_PROJECT_SUMMARY_FAILURE,
} from '../../config/constants'

const initialState = {
  isLoading: false,
  error: false,
  projectId: null,
  projectSummary: null
}

export const projectSummary = function (state=initialState, action) {
  const payload = action.payload

  switch (action.type) {
  case LOAD_PROJECT_SUMMARY_PENDING:
    return Object.assign({}, state, {
      isLoading: true,
      error: false,
      projectId: action.meta.projectId
    })

  case LOAD_PROJECT_SUMMARY_SUCCESS:
    if(payload.projectId === state.projectId) {
      return Object.assign({}, state, {
        isLoading: false,
        error: false,
        projectSummary: payload
      })
    } else {
      return state
    }

  case LOAD_PROJECT_SUMMARY_FAILURE: {
    return Object.assign({}, state, {
      isLoading: false,
      error: payload
    })
  }


  default:
    return state
  }
}
