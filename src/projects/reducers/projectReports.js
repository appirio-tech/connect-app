import {
  LOAD_PROJECT_SUMMARY_PENDING,
  LOAD_PROJECT_SUMMARY_SUCCESS,
  LOAD_PROJECT_SUMMARY_FAILURE,
  REFRESH_LOOKER_SESSION,
} from '../../config/constants'

const initialState = {
  isLoading: false,
  error: false,
  projectId: null,
  projectSummary: null,
  projectSummaryEmbedUrl: null,
  lookerSessionExpired: false,
}

export const projectReports = function (state=initialState, action) {
  const payload = action.payload

  switch (action.type) {
  case LOAD_PROJECT_SUMMARY_PENDING:
    return Object.assign({}, state, {
      isLoading: true,
      error: false,
      projectId: action.meta.projectId
    })

  case LOAD_PROJECT_SUMMARY_SUCCESS:
    if(action.meta.projectId === state.projectId) {
      return Object.assign({}, state, {
        isLoading: false,
        error: false,
        projectSummaryEmbedUrl: payload,
        lookerSessionExpired: false,
        // projectSummary: payload
      })
    } else {
      return state
    }

  case LOAD_PROJECT_SUMMARY_FAILURE: {
    return Object.assign({}, state, {
      isLoading: false,
      lookerSessionExpired: false,
      error: payload
    })
  }

  case REFRESH_LOOKER_SESSION: {
    return Object.assign({}, state, {
      lookerSessionExpired: true
    })
  }

  default:
    return state
  }
}
