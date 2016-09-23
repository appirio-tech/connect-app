import { getProjectById, createProject as createProjectAPI,
  updateProject as updateProjectAPI,
  deleteProject as deleteProjectAPI,
  getDirectProjectData } from '../../api/projects'
import { LOAD_PROJECT, CREATE_PROJECT, CLEAR_LOADED_PROJECT, UPDATE_PROJECT,
  LOAD_DIRECT_PROJECT, DELETE_PROJECT } from '../../config/constants'


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
      type: CREATE_PROJECT,
      payload: createProjectAPI(newProject)
    })
  }
}

export function updateProject(projectId, updatedProps) {
  return (dispatch) => {
    return dispatch({
      type: UPDATE_PROJECT,
      payload: updateProjectAPI(projectId, updatedProps)
    })
  }
}

export function deleteProject(newProject) {
  return (dispatch) => {
    return dispatch({
      type: DELETE_PROJECT,
      payload: deleteProjectAPI(newProject)
    })
  }
}

export function loadDirectProjectData(directProjectId) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_DIRECT_PROJECT,
      payload: getDirectProjectData(directProjectId)
    })
  }
}
