import _ from 'lodash'
import { loadMembers } from '../../actions/members'
import { loadProject, loadDirectProjectData, loadProjectPhasesWithProducts,
  loadProjectTemplate, loadProjectProductTemplates, loadAllProductTemplates, loadProjectProductTemplatesByKey } from './project'
import { LOAD_PROJECT_DASHBOARD, LOAD_ADDITIONAL_PROJECT_DATA } from '../../config/constants'

/**
 * Load all project data to paint the dashboard
 *
 * @param {Function} dispatch  dispatches redux actions
 * @param {Function} getState  returns redux state
 * @param {Number}   projectId project id
 *
 * @return {Promise} LOAD_ADDITIONAL_PROJECT_DATA action
 */
const getDashboardData = (dispatch, getState, projectId) => {
  return new Promise((resolve, reject) => {
    return dispatch(loadProject(projectId))
      .then(({ value: project }) => {
        const userIds = _.map(project.members, 'userId')
        // this is to remove any nulls from the list (dev had some bad data)
        _.remove(userIds, i => !i)
        // load additional data in parallel
        const promises = [
          dispatch(loadMembers(userIds))
        ]

        if (project.directProjectId) {
          promises.push(dispatch(loadDirectProjectData(project.directProjectId)))
        }

        // for new projects load phases, products, project template and product templates
        if (project.version === 'v3') {
          promises.push(dispatch(loadProjectPhasesWithProducts(projectId, project)))

          promises.push(
            dispatch(loadProjectTemplate(project.templateId))
              .then(({ value: projectTemplate }) =>
                dispatch(loadProjectProductTemplates(projectTemplate))
              )
          )

        // for old project load only one product template
        } else {
          promises.push(dispatch(loadProjectProductTemplatesByKey(_.get(project, 'details.products[0]'))))
        }
        promises.push(dispatch(loadAllProductTemplates()))

        return resolve(dispatch({
          type: LOAD_ADDITIONAL_PROJECT_DATA,
          payload: Promise.all(promises)
        }))

      })
      .catch(err => reject(err))
  })
}

export function loadProjectDashboard(projectId) {
  return (dispatch, getState) => {
    return dispatch({
      type: LOAD_PROJECT_DASHBOARD,
      payload: getDashboardData(dispatch, getState, projectId)
    })
  }
}
