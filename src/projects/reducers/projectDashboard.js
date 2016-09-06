
import {
  LOAD_PROJECT_DASHBOARD_PENDING,
  LOAD_PROJECT_DASHBOARD_SUCCESS,
  LOAD_PROJECT_DASHBOARD_FAILURE
} from '../../config/constants'

const initialState = {
  isLoading: true,
  error: false
}

export const projectDashboard = function (state=initialState, action) {

  switch (action.type) {
  case LOAD_PROJECT_DASHBOARD_PENDING:
    return Object.assign({}, state, {
      isLoading: true,
      error: false
    })
  case LOAD_PROJECT_DASHBOARD_SUCCESS:
    return Object.assign({}, state, {
      isLoading: false,
      error: false
    })

  case LOAD_PROJECT_DASHBOARD_FAILURE:
    return Object.assign({}, state, {
      isLoading: false,
      error: true
    })

  default:
    return state
  }
}
