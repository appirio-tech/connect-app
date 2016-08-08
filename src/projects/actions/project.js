import { getProjectById, createProject as createProjectAPI } from '../../api/projects'
import { LOAD_PROJECT, CLEAR_LOADED_PROJECT } from '../../config/constants'


export function loadProject(projectId) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT,
      payload: getProjectById(projectId)
    })
  }
}

export function clearLoadedProject() {
  return dispatch => {
    return dispatch({
      type: CLEAR_LOADED_PROJECT
    })
  }
}

export function createProject(newProject) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT,
      payload: createProjectAPI(newProject)
    })
  }
}
