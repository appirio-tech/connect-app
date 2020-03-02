import {
  LOAD_PROJECT_SUMMARY_PENDING,
  LOAD_PROJECT_SUMMARY_SUCCESS,
  LOAD_PROJECT_SUMMARY_FAILURE,
  SET_LOOKER_SESSION_EXPIRED,
} from '../../config/constants'

const initialState = {
  isLoading: false,
  error: false,
  projectId: null,
  projectSummary: null,
  projectSummaryEmbedUrl: null,
  lookerSessionExpired: false,
}

/**
 * Adds a `random` query param to the URL so browser could treat such a URL as different.
 *
 * @param {String} url URL string to augment
 *
 * @returns {String} URL with `random` query param
 */
function addRandomParamToUrl(url) {
  const randomParam = `random=${Math.random().toString().slice(2)}`

  return url + (url.indexOf('?') > -1 ? '&' : '?') + randomParam
}

export const projectReports = function (state=initialState, action) {
  const payload = action.payload

  switch (action.type) {
  case LOAD_PROJECT_SUMMARY_PENDING:
    return Object.assign({}, state, {
      isLoading: true,
      error: false,
      projectId: action.meta.projectId,
    })

  case LOAD_PROJECT_SUMMARY_SUCCESS:
    if(action.meta.projectId === state.projectId) {
      return Object.assign({}, state, {
        isLoading: false,
        error: false,
        projectSummaryEmbedUrl: addRandomParamToUrl(payload),
        lookerSessionExpired: false,
        // projectSummary: payload
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

  case SET_LOOKER_SESSION_EXPIRED: {
    return Object.assign({}, state, {
      lookerSessionExpired: payload
    })
  }

  default:
    return state
  }
}
