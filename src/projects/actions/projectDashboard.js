import _ from 'lodash'
import { loadMembers } from '../../actions/members'
import { loadProject } from './project'
import { LOAD_PROJECT_DASHBOARD } from '../../config/constants'

/**
 * Load all project data to paint the dashboard
 * @param  {integer} projectId project identifier
 */

 /*eslint-disable no-unused-vars */
const getDashboardData = (dispatch, projectId) => {
  return new Promise((resolve, reject) => {
    return dispatch(loadProject(projectId))
      .then(({value, action}) => {
        // action.type should be LOAD_PROJECT_SUCCESS
        const userIds = _.map(value.members, 'userId')
        // this is to remove any nulls from the list (dev had some bad data)
        _.remove(userIds, i => !i)
        // consider usign redux-combine-actions to load
        // additional data in parallel
        return dispatch(loadMembers(userIds))
          .then(() => resolve(true))
          .catch(err => reject(err))
      })
      .catch(err => reject(err))
  })
}
/*eslint-enable*/


export function loadProjectDashboard(projectId) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT_DASHBOARD,
      payload: getDashboardData(dispatch, projectId)
    })
  }
}
