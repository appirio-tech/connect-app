import {
  LOAD_PROJECT_SUMMARY
} from '../../config/constants'
import {
  getProjectSummary
} from '../../api/projectSummary'

export function loadProjectSummary(projectId) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT_SUMMARY,
      payload: getProjectSummary(projectId),
      meta: { projectId }
    })
  }
}
