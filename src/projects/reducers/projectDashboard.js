
import {
  LOAD_PROJECT_DASHBOARD_PENDING,
  LOAD_PROJECT_DASHBOARD_SUCCESS,
  LOAD_PROJECT_DASHBOARD_FAILURE,
  CLEAR_LOADED_PROJECT,
  GET_PROJECTS_SUCCESS,
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
      error: action.payload
    })

  // when we clear the project we have to put dashboard state to the initial state
  // because the code relies on the initial state
  // for example spinnerWhileLoading in ProjectDerail.jsx expects `isLoading` to be true
  // to prevent components which require dashboard data from rendering
  case CLEAR_LOADED_PROJECT:
  case GET_PROJECTS_SUCCESS:
    return Object.assign({}, state, initialState)

  default:
    return state
  }
}
