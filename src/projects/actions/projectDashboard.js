import _ from 'lodash'
import { loadMembers } from '../../actions/members'
import { loadProject, loadDirectProjectData, loadProjectPhasesWithProducts, loadProjectTemplateByKey } from './project'
import { LOAD_PROJECT_DASHBOARD, LOAD_ADDITIONAL_PROJECT_DATA } from '../../config/constants'

/**
 * Load all project data to paint the dashboard
 * @param  {integer} projectId project identifier
 */

/*eslint-disable no-unused-vars */
const getDashboardData = (dispatch, getState, projectId) => {
  return new Promise((resolve, reject) => {
    return dispatch(loadProject(projectId))
      // we will need project template for loading phases, so load template first
      .then(({ value: project }) => {
        const projectTemplateKey = _.get(project, 'details.products[0]')
        const projectTemplate = getState().projectState.projectTemplate
        // if projectTemplate is not loaded, or loaded another one, then load
        if (!projectTemplate || projectTemplate.key !== projectTemplate) {
          return dispatch(loadProjectTemplateByKey(projectTemplateKey))
            .then(({ value: projectTemplate }) => ({
              project,
              projectTemplate,
            }))
        }

        return ({
          project,
          projectTemplate,
        })
      })
      .then(({ project, projectTemplate }) => {
        const userIds = _.map(project.members, 'userId')
        // this is to remove any nulls from the list (dev had some bad data)
        _.remove(userIds, i => !i)
        // load additional data in parallel
        const promises = [
          dispatch(loadMembers(userIds))
        ]
        if (project.directProjectId) {
          promises.push(
            dispatch(loadDirectProjectData(project.directProjectId))
              .then(({ value: directProject }) =>
                dispatch(loadProjectPhasesWithProducts(projectId, project, directProject, projectTemplate))
              )
          )
        } else {
          promises.push(dispatch(loadProjectPhasesWithProducts(projectId, project, null, projectTemplate)))
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
