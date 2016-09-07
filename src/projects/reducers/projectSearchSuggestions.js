import {
  CLEAR_PROJECT_SUGGESTIONS_SEARCH, PROJECT_SUGGESTIONS_SEARCH_SUCCESS,
  PROJECT_SUGGESTIONS_SEARCH_FAILURE
} from '../../config/constants'

export const initialState = {
  loaded: false,
  projects: [],
  moreMatchesAvailable: false,
  error: false,
  totalCount: 0
}

export default function(state = initialState, action) {
  switch (action.type) {

  case CLEAR_PROJECT_SUGGESTIONS_SEARCH:
    return Object.assign({}, state, {
      error: false,
      totalCount: 0
    })

  case PROJECT_SUGGESTIONS_SEARCH_SUCCESS:
    console.log('project search success')
    return Object.assign({}, state, {
      loaded: true,
      projects: action.projects
    })

  case PROJECT_SUGGESTIONS_SEARCH_FAILURE:
    return Object.assign({}, state, {
      loaded: true,
      error: true,
      totalCount: 0
    })

  default:
    return state
  }
}
