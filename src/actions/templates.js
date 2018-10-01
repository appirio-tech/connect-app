/**
 * Project and product templates actions
 */
import { LOAD_PROJECTS_METADATA } from '../config/constants'
import { getProjectsMetadata } from '../api/templates'

export function loadProjectsMetadata() {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECTS_METADATA,
      payload: getProjectsMetadata()
    })
  }
}
