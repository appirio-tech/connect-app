/**
 * Project and product templates actions
 */
import { LOAD_PROJECT_TEMPLATES } from '../config/constants'
import { getProjectTemplates } from '../api/templates'

export function loadProjectTemplates() {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT_TEMPLATES,
      payload: getProjectTemplates()
    })
  }
}
