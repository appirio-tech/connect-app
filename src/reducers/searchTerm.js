import { SET_SEARCH_TERM, SET_SEARCH_TAG, RESET_SEARCH_TERM } from '../config/constants'

export const initialState = {
  previousSearchTerm: null,
  searchTerm : null,
  searchTermTag: null
}

export default function(state = initialState, action) {
  switch (action.type) {
  case SET_SEARCH_TERM:
    return Object.assign({}, state, {
      previousSearchTerm: action.previousSearchTerm,
      searchTerm: action.searchTerm
    })

  case SET_SEARCH_TAG:
    return Object.assign({}, state, {
      searchTermTag: action.searchTermTag
    })

  case RESET_SEARCH_TERM:
    return Object.assign({}, state, {
      previousSearchTerm: null,
      searchTermTag: null
    })

  default: return state
  }
}
