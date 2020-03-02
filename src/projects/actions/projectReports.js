import {
  LOAD_PROJECT_SUMMARY,
  SET_LOOKER_SESSION_EXPIRED,
} from '../../config/constants'
import {
  getProjectSummary,
  getProjectReportUrl,
} from '../../api/projectReports'

export function loadProjectSummary(projectId) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT_SUMMARY,
      payload: getProjectSummary(projectId),
      meta: { projectId }
    })
  }
}

/**
 * Redux action to start fetching the signed URL for embeding the given report
 * @param {*} projectId id of the project
 * @param {*} reportName unique name of the report
 */
export function loadProjectReportsUrls(projectId, reportName) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT_SUMMARY,
      payload: getProjectReportUrl(projectId, reportName),
      meta: { projectId }
    })
  }
}

/**
 * Redux action set the flag `lookerSessionExpired`
 *
 * @param {Boolean} isExpired true to indicate that looker session is expired
 */
export function setLookerSessionExpired(isExpired) {
  return (dispatch) => {
    return dispatch({
      type: SET_LOOKER_SESSION_EXPIRED,
      payload: { lookerSessionExpired: isExpired }
    })
  }
}