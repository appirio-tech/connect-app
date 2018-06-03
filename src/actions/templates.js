/**
 * Project and product templates actions
 */
import { LOAD_PROJECT_TEMPLATES, LOAD_PROJECT_CATEGORIES } from '../config/constants'
import { getProjectTemplates, getProjectCategories } from '../api/templates'

export function loadProjectTemplates() {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT_TEMPLATES,
      payload: getProjectTemplates()
    })
  }
}

export function loadProjectCategories() {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT_CATEGORIES,
      payload: getProjectCategories()
    })
  }
}
