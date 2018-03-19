import {
  PROJECT_SEARCH_PENDING, PROJECT_SEARCH_SUCCESS, PROJECT_SEARCH_FAILURE,
  GET_PROJECTS_PENDING, GET_PROJECTS_SUCCESS, GET_PROJECTS_FAILURE,
  LOAD_MORE_PROJECTS, CLEAR_PROJECT_SEARCH, SET_PROJECTS_SEARCH_CRITERIA,
  SET_PROJECTS_INFINITE_AUTOLOAD,
  SET_PROJECTS_LIST_VIEW,
  PROJECTS_LIST_VIEW,
  PROJECT_LIST_DEFAULT_CRITERIA,
  PROJECT_SORT,
  DELETE_PROJECT_SUCCESS
} from '../../config/constants'
import update from 'react-addons-update'

export const initialState = {
  isLoading: true,
  projects: [],
  error: false,
  totalCount: 0,
  pageNum: 1,
  // make a copy of constant to avoid unintentional modifications
  criteria: {...PROJECT_LIST_DEFAULT_CRITERIA},
  projectsListView: PROJECTS_LIST_VIEW.GRID,
  refresh: false
}

export default function(state = initialState, action) {
  switch (action.type) {
  // project search state
  case GET_PROJECTS_PENDING:
  case PROJECT_SEARCH_PENDING:
    return Object.assign({}, state, {
      isLoading: true,
      error: false,
      totalCount: action.meta && action.meta.keepPrevious ? state.totalCount : 0,
      refresh: false
    })
  case SET_PROJECTS_SEARCH_CRITERIA:
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
  case GET_PROJECTS_SUCCESS: {
    const updatedProjects = action.meta.keepPrevious
      ? { projects : { $push : action.payload.projects }, totalCount: { $set : action.payload.totalCount} }
      : { projects : { $set : action.payload.projects }, totalCount: { $set : action.payload.totalCount} }
    return update(state, updatedProjects)
  }

  case PROJECT_SORT: {
    const updatedProjectsAndCriteria = { projects : { $set : action.payload.projects }, criteria: { $set : action.payload.criteria } }
    return update(state, updatedProjectsAndCriteria)
  }

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

  case SET_PROJECTS_INFINITE_AUTOLOAD:
    return Object.assign({}, state, {
      infiniteAutoload: action.payload
    })

  case SET_PROJECTS_LIST_VIEW:
    return Object.assign({}, state, {
      projectsListView: action.payload
    })

  case DELETE_PROJECT_SUCCESS: {
    return Object.assign({}, state, {
      refresh: true
    })
  }

  default:
    return state
  }
}
