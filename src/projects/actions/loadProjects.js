import _ from 'lodash'
import {
  PROJECT_SEARCH, GET_PROJECTS,
  SET_SEARCH_TERM, SET_PROJECTS_SEARCH_CRITERIA,
  CLEAR_PROJECT_SUGGESTIONS_SEARCH, PROJECT_SUGGESTIONS_SEARCH_SUCCESS,
  SET_PROJECTS_INFINITE_AUTOLOAD,
  SET_PROJECTS_LIST_VIEW,
  PROJECT_STATUS_ACTIVE,
  ROLE_TOPCODER_USER
} from '../../config/constants'
import { getProjects } from '../../api/projects'
import { loadMembers } from '../../actions/members'

// ignore action
/*eslint-disable no-unused-vars */
const getProjectsWithMembers = (dispatch, getState, criteria, pageNum) => {
  const state = getState()
  return new Promise((resolve, reject) => {
    dispatch({
      type: SET_PROJECTS_SEARCH_CRITERIA,
      criteria,
      pageNum
    })

    return dispatch({
      type: GET_PROJECTS,
      payload: getProjects(criteria, pageNum)
        .then((data) => {
          const retryForCustomer = criteria.status === PROJECT_STATUS_ACTIVE && state.loadUser.user.roles &&  state.loadUser.user.roles.length === 1
            && state.loadUser.user.roles[0] === ROLE_TOPCODER_USER
          if(data.totalCount === 0 && retryForCustomer) {
            //retrying for customer if active projects are 0 but there are some projects with other status
            //This is to bypass the walkthrough page which we ideally show for customer with zero projects
            const newCriteria = {
              sort: 'updatedAt desc'
            }
            return getProjects(newCriteria, pageNum)
              .then((data2) => {
                //if there no project in any status return original result
                if(data2.totalCount === 0) {
                  return data
                } else {
                  data2.projects.length = 0
                  return data2
                }
              })
          } else {
            return data
          }
        }),
      meta: {
        // keep previous to enable the loading without paginator (infinite scroll)
        keepPrevious : pageNum !== 1
      }
    })
      .then(({ value, action }) => {
        let userIds = []
        _.forEach(value.projects, project => {
          userIds = _.union(userIds, _.map(project.members, 'userId'))
          userIds = _.union(userIds, [project.createdBy])
          userIds = _.union(userIds, [project.updatedBy])

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
      payload: getProjectsWithMembers(dispatch, getState, criteria, pageNum),
      meta: {
        // keep previous to enable the loading without paginator (infinite scroll)
        keepPrevious : pageNum !== 1
      }
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

export function setInfiniteAutoload(infiniteAutload) {
  return (dispatch) => {
    dispatch({ type: SET_PROJECTS_INFINITE_AUTOLOAD, payload: infiniteAutload })
  }
}

export function setProjectsListView(projectsListView) {
  return (dispatch) => {
    dispatch({ type: SET_PROJECTS_LIST_VIEW, payload: projectsListView })
  }
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
