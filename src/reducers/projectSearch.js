import {
  CLEAR_PROJECT_SEARCH, PROJECT_SEARCH_SUCCESS,
  PROJECT_SEARCH_FAILURE, LOAD_MORE_PROJECTS
} from '../config/constants'

export const initialState = {
  pageLoaded: false,
  loadingMore: false,
  moreMatchesAvailable: false,
  error: false,
  totalCount: 0
}

export default function(state = initialState, action) {
  switch (action.type) {

  case CLEAR_PROJECT_SEARCH:
    return Object.assign({}, state, {
      loadingMore: false,
      error: false,
      totalCount: 0
    })

  case PROJECT_SEARCH_SUCCESS:
    return Object.assign({}, state, {
      pageLoaded: true
    })

  case PROJECT_SEARCH_FAILURE:
    return Object.assign({}, state, {
      loadingMore: false,
      error: true,
      totalCount: 0
    })

  case LOAD_MORE_PROJECTS:
    return Object.assign({}, state, {
      loadingMore: true
    })

  default:
    return state
  }
}
