import { SET_SEARCH_TERM } from '../config/constants'

export function setSearchTerm(searchTerm) {
  return {
    type: SET_SEARCH_TERM,
    previousSearchTerm: searchTerm
  }
}
