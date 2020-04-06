import {
  LOAD_USER_REPORTS,
  SET_LOOKER_SESSION_EXPIRED,
} from '../../../config/constants'
import {
  getUserReportUrl,
} from '../../../api/projectReports'

/**
 * Redux action to start fetching the signed URL for embeding the given report
 * @param {*} reportName unique name of the report
 */
export function loadUserReportsUrls(reportName) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_USER_REPORTS,
      payload: getUserReportUrl(reportName),
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