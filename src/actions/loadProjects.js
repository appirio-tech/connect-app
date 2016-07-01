import _ from 'lodash'
import { fetchJSON } from '../helpers'
import {
  CLEAR_PROJECT_SEARCH, PROJECT_SEARCH_FAILURE, RESET_SEARCH_TERM,
  SET_SEARCH_TAG, SET_SEARCH_TERM, PROJECT_SEARCH_SUCCESS } from '../config/constants'

export function loadProjects(searchTerm) {
  return ((dispatch, getState) => {
    const state = getState()
    const numCurrentUsernameMatches = state.memberSearch.usernameMatches.length
    const previousSearchTerm = state.searchTerm.previousSearchTerm
    const isPreviousSearchTerm = _.isString(previousSearchTerm)
    const isNewSearchTerm = isPreviousSearchTerm && searchTerm.toLowerCase() !== previousSearchTerm.toLowerCase()

    if (isNewSearchTerm) {
      dispatch({ type: CLEAR_PROJECT_SEARCH })
    }

    dispatch({ type: SET_SEARCH_TERM, searchTerm })

  })
}

export function projectSearchFailure(dispatch) {
  dispatch({ type: PROJECT_SEARCH_FAILURE })
  dispatch({ type: RESET_SEARCH_TERM})
}
