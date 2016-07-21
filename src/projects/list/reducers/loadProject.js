import {
  CLEAR_LOADED_PROJECT, PROJECT_LOAD_SUCCESS,
  PROJECT_LOAD_FAILURE
} from '../../../config/constants'

export const initialState = {
  pageLoaded: false,
  project: {},
  error: false
}

export default function(state = initialState, action) {
  switch (action.type) {

  case CLEAR_LOADED_PROJECT:
    return Object.assign({}, state, {
      error: false
    })

  case PROJECT_LOAD_SUCCESS:
    console.log('project load success')
    return Object.assign({}, state, {
      pageLoaded: true,
      project: action.project
    })

  case PROJECT_LOAD_FAILURE:
    return Object.assign({}, state, {
      pageLoaded: true,
      error: true
    })

  default:
    return state
  }
}
