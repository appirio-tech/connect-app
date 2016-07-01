import _ from 'lodash'
import { fetchJSON } from '../helpers'
import { CLEAR_PROJECT_SEARCH, SET_SEARCH_TERM } from '../config/constants'

export function loadSearchSuggestions(searchTerm) {
  return ((dispatch, getState) => {
    const state = getState()
    const searchTerm = state.searchTerm

    if (searchTerm) {
      dispatch({ type: CLEAR_PROJECT_SEARCH })
    }

    dispatch({ type: SET_SEARCH_TERM, searchTerm })
    // TODO make tags api call
  })
}

export function search(searchTerm) {
  return ((dispatch, getState) => {
    const state = getState()
    const searchTerm = state.searchTerm

    if (searchTerm) {
      dispatch({ type: CLEAR_PROJECT_SEARCH })
    }

    dispatch({ type: SET_SEARCH_TERM, searchTerm })

  })
}