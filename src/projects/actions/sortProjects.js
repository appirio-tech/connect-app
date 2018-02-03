import _ from 'lodash'
import { PROJECT_SORT } from '../../config/constants'

export function sortProjects(criteria) {
  return (dispatch, getState) => {
    const fieldName = _.split(criteria, ' ')[0]
    const order = _.split(criteria, ' ')[1] || 'asc'
    const state = getState()
    const oldProjects = state.projectSearch.projects
    
    return dispatch({
      type: PROJECT_SORT,
      payload: { projects: _.orderBy(oldProjects, [fieldName], [order]), criteria: { sort: criteria, status: 'active' }}
    })
  }
}

