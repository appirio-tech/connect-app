import { SET_PROJECTS_SEARCH_CRITERIA } from '../../config/constants'

export function setCriteria(criteria) {
  return (dispatch) => {
    return dispatch({
      type: SET_PROJECTS_SEARCH_CRITERIA,
      criteria,
      pageNum: 1
    })
  }
}