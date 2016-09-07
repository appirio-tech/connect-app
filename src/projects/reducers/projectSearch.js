import {
  PROJECT_SEARCH_PENDING, PROJECT_SEARCH_SUCCESS, PROJECT_SEARCH_FAILURE,
  GET_PROJECTS_PENDING, GET_PROJECTS_SUCCESS, GET_PROJECTS_FAILURE,
  LOAD_MORE_PROJECTS, CLEAR_PROJECT_SEARCH, GET_PROJECTS_SEARCH_CRITERIA
} from '../../config/constants'

export const initialState = {
  isLoading: true,
  projects: [],
  error: false,
  totalCount: 0,
  pageNum: 1,
  criteria: {
    sort: 'createdAt desc'
  }
}

export default function(state = initialState, action) {
  switch (action.type) {

  // project search state
  case GET_PROJECTS_PENDING:
  case PROJECT_SEARCH_PENDING:
    return Object.assign({}, state, {
      isLoading: true,
      error: false,
      totalCount: 0
    })
  case GET_PROJECTS_SEARCH_CRITERIA:
    return Object.assign({}, state, {
      criteria: action.criteria,
      pageNum: action.pageNum
    })
  case CLEAR_PROJECT_SEARCH:
    return Object.assign({}, state, {
      error: false,
      totalCount: 0
    })

  // called after members are loaded
  case PROJECT_SEARCH_SUCCESS:
    return Object.assign({}, state, {
      error: false,
      isLoading: false
    })
  case GET_PROJECTS_SUCCESS:
    return Object.assign({}, state, {
      projects: action.payload.projects,
      totalCount: action.payload.totalCount
    })

  case PROJECT_SEARCH_FAILURE:
  case GET_PROJECTS_FAILURE:
    return Object.assign({}, state, {
      isLoading: false,
      projects: [],
      totalCount: 0,
      error: true
    })

  case LOAD_MORE_PROJECTS:
    return Object.assign({}, state, {
      loadingMore: true
    })

  default:
    return state
  }
}
