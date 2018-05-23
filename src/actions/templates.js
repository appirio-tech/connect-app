/**
 * Project and product templates actions
 */
import { LOAD_PROJECT_TEMPLATES, LOAD_PROJECT_TYPES } from '../config/constants'
import { getProjectTemplates, getProjectTypes } from '../api/templates'

export function loadProjectTemplates() {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT_TEMPLATES,
      payload: getProjectTemplates()
    })
  }
}

export function loadProjectTypes() {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT_TYPES,
      payload: getProjectTypes()
    })
  }
}
