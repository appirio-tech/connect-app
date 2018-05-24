import _ from 'lodash'
import { loadMembers } from '../../actions/members'
import { loadProject, loadDirectProjectData, loadProjectPhases, loadProjectTemplateByKey } from './project'
import { LOAD_PROJECT_DASHBOARD, LOAD_ADDITIONAL_PROJECT_DATA } from '../../config/constants'

/**
 * Load all project data to paint the dashboard
 * @param  {integer} projectId project identifier
 */

/*eslint-disable no-unused-vars */
const getDashboardData = (dispatch, getState, projectId) => {
  return new Promise((resolve, reject) => {
    return dispatch(loadProject(projectId))
      .then(({value: project, action}) => {
        // action.type should be LOAD_PROJECT_SUCCESS
        const userIds = _.map(project.members, 'userId')
        // this is to remove any nulls from the list (dev had some bad data)
        _.remove(userIds, i => !i)
        // load additional data in parallel
        const promises = [
          dispatch(loadMembers(userIds))
        ]
        if (project.directProjectId)
          promises.push(dispatch(loadDirectProjectData(project.directProjectId)))
        promises.push(dispatch(loadProjectPhases(projectId)))

        const projectTemplateKey = _.get(project, 'details.products[0]')
        const projectTemplate =  getState().projectState.projectTemplate
        // if projectTemplate is not loaded, or loaded another one, then load
        if (!projectTemplate || projectTemplate.key !== projectTemplate) {
          dispatch(loadProjectTemplateByKey(projectTemplateKey))
        }
        return resolve(dispatch({
          type: LOAD_ADDITIONAL_PROJECT_DATA,
          payload: Promise.all(promises)
        }))

      })
      .catch(err => reject(err))
  })
}
/*eslint-enable*/


export function loadProjectDashboard(projectId) {
  return (dispatch, getState) => {
    return dispatch({
      type: LOAD_PROJECT_DASHBOARD,
      payload: getDashboardData(dispatch, getState, projectId)
    })
  }
}
