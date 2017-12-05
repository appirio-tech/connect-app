import _ from 'lodash'
import {
  PROJECT_SEARCH, GET_PROJECTS, PROJECT_STATUS, PROJECT_STATUS_CANCELLED,
  SET_SEARCH_TERM, GET_PROJECTS_SEARCH_CRITERIA,
  CLEAR_PROJECT_SUGGESTIONS_SEARCH, PROJECT_SUGGESTIONS_SEARCH_SUCCESS,
  ROLE_CONNECT_COPILOT, ROLE_CONNECT_MANAGER, ROLE_ADMINISTRATOR
} from '../../config/constants'
import { getProjects } from '../../api/projects'
import { loadMembers } from '../../actions/members'

// ignore action
/*eslint-disable no-unused-vars */
const getProjectsWithMembers = (dispatch, getState, criteria, pageNum) => {
  return new Promise((resolve, reject) => {
    dispatch({
      type: GET_PROJECTS_SEARCH_CRITERIA,
      criteria,
      pageNum
    })
    // for non power users, we hard coding the project status to not show Cancelled projects
    // we don't want the URL to clutter with this, hence criteria has to modified just before passing to the API
    // NOTE: we need to remove this if we provide status filter for such users
    let isPowerUser = false
    const loadUser = getState().loadUser
    // power user roles
    const roles = [ROLE_CONNECT_COPILOT, ROLE_CONNECT_MANAGER, ROLE_ADMINISTRATOR]
    if (loadUser.user) {
      // determine if user is a power user
      isPowerUser = loadUser.user.roles.some((role) => roles.indexOf(role) !== -1)
    }
    return dispatch({
      type: GET_PROJECTS,
      payload: getProjects(criteria, pageNum),
      meta: {
        // for non power users (i.e. customers) keep previous to enable the loading without paginator
        keepPrevious : !isPowerUser
      }
    })
    .then(({ value, action }) => {
      let userIds = []
      _.forEach(value.projects, project => {
        userIds = _.union(userIds, _.map(project.members, 'userId'))
      })
      // this is to remove any nulls from the list (dev had some bad data)
      _.remove(userIds, i => !i)
      // return if there are no userIds to retrieve, empty result set
      if (!userIds.length)
        resolve(true)
      return dispatch(loadMembers(userIds))
        .then(() => resolve(true))
        .catch(err => reject(err))
    })
    .catch(err => reject(err))
  })
}
/*eslint-enable*/

export function loadProjects(criteria, pageNum=1) {
  return (dispatch, getState) => {
    return dispatch({
      type: PROJECT_SEARCH,
      payload: getProjectsWithMembers(dispatch, getState, criteria, pageNum)
    })
  }
}

export function projectSuggestions(searchTerm) {
  return ((dispatch, getState) => {
    const state = getState()
    // const numCurrentUsernameMatches = state.memberSearch.usernameMatches.length
    const previousSearchTerm = state.searchTerm.previousSearchTerm
    const isPreviousSearchTerm = _.isString(previousSearchTerm)
    const isNewSearchTerm = isPreviousSearchTerm && searchTerm.toLowerCase() !== previousSearchTerm.toLowerCase()

    if (isNewSearchTerm) {
      dispatch({ type: CLEAR_PROJECT_SUGGESTIONS_SEARCH })
    }

    dispatch({ type: SET_SEARCH_TERM, searchTerm })

    dispatch({ type: PROJECT_SUGGESTIONS_SEARCH_SUCCESS,
      // TODO: wire API to projects results
      projects: []
    })

  })
}

/**
export function loadProjects(searchTerm) {
  return {
    API_CALL: {
      api : projectService,
      method: 'getProjects',
      args: {searchTerm},
      success : (resp, dispatch) => {
        console.log('dispatch success action')
        console.log(resp)
        projectSearchSuccess(dispatch, resp)
      },
      failure : () => { console.log('dispatch failure action') }
    }
  }
}

export function projectSearchSuccess(dispatch, response) {
  dispatch({ type: PROJECT_SEARCH_SUCCESS, projects : response.result.content })
  dispatch({ type: RESET_SEARCH_TERM})
}

export function projectSearchFailure(dispatch) {
  dispatch({ type: PROJECT_SEARCH_FAILURE })
  dispatch({ type: RESET_SEARCH_TERM})
}
*/
