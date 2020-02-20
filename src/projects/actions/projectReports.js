import {
  LOAD_PROJECT_SUMMARY,
  REFRESH_LOOKER_SESSION,
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
 * Redux action to refresh the looker session. It is aimed to just indicate that there is need
 * of refreshing the token. It does not do any thing itself. It is upto the state listner to react.
 */
export function refreshLookerSession() {
  return (dispatch) => {
    return dispatch({
      type: REFRESH_LOOKER_SESSION,
      payload: { lookerSessionExpired: true }
    })
  }
}