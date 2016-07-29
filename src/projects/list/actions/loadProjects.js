import _ from 'lodash'
// import { fetchJSON } from '../helpers'
import {
  CLEAR_PROJECT_SEARCH, PROJECT_SEARCH_SUCCESS, PROJECT_SEARCH_FAILURE,
  RESET_SEARCH_TERM, SET_SEARCH_TERM,
  CLEAR_PROJECT_SUGGESTIONS_SEARCH, PROJECT_SUGGESTIONS_SEARCH_SUCCESS
  } from '../../../config/constants'

import projectService from '../../../services/projectService'


export function loadProjects(searchTerm) {
  return {
    API_CALL: {
      api : projectService,
      method: 'getProjects',
      args: {searchTerm},
      success : (respose) => { console.log('dispatch success action') },
      failure : (error) => { console.log('dispatch failure action') }
    }
  }
}

export function projectSearchSuccess(dispatch) {
  dispatch({ type: PROJECT_SEARCH_FAILURE })
  dispatch({ type: RESET_SEARCH_TERM})
}

export function projectSearchFailure(dispatch) {
  dispatch({ type: PROJECT_SEARCH_FAILURE })
  dispatch({ type: RESET_SEARCH_TERM})
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
      projects: [
        'LUX challenge for HP',
        'LUX challenge for Delloite'
      ]
    })

  })
}