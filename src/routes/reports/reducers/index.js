import {
  LOAD_USER_REPORTS_PENDING,
  LOAD_USER_REPORTS_SUCCESS,
  LOAD_USER_REPORTS_FAILURE,
  SET_LOOKER_SESSION_EXPIRED,
} from '../../../config/constants'
  
const initialState = {
  isLoading: false,
  error: false,
  userReports: null,
  userReportsEmbedUrl: null,
  lookerSessionExpired: false,
}
  
export const userReports = function (state=initialState, action) {
  const payload = action.payload

  switch (action.type) {
  case LOAD_USER_REPORTS_PENDING:
    return Object.assign({}, state, {
      isLoading: true,
      error: false,
    })

  case LOAD_USER_REPORTS_SUCCESS:
    return Object.assign({}, state, {
      isLoading: false,
      error: false,
      userReportsEmbedUrl: payload,
      lookerSessionExpired: false,
    })

  case LOAD_USER_REPORTS_FAILURE: {
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
  