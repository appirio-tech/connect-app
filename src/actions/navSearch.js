// import _ from 'lodash'
import { CLEAR_PROJECT_SEARCH, SET_SEARCH_TERM } from '../config/constants'

export function loadSearchSuggestions(searchTerm) {
  return ((dispatch, getState) => {
    const state = getState()
    const prevSearchTerm = state.searchTerm

    if (searchTerm) {
      dispatch({ type: CLEAR_PROJECT_SEARCH })
    }

    dispatch({ type: SET_SEARCH_TERM, prevSearchTerm, searchTerm })
    // TODO make tags api call
  })
}

export function search(searchTerm) {
  return ((dispatch, getState) => {
    const state = getState()
    const prevSearchTerm = state.searchTerm

    if (searchTerm) {
      dispatch({ type: CLEAR_PROJECT_SEARCH })
    }

    dispatch({ type: SET_SEARCH_TERM, prevSearchTerm, searchTerm })

  })
}
