
import {
  LOAD_PROJECT, PROJECT_LOAD_SUCCESS, PROJECT_LOAD_FAILURE,
  CREATE_PROJECT, CREATE_PROJECT_SUCCESS, CREATE_PROJECT_FAILURE,
  UPDATE_PROJECT, UPDATE_PROJECT_SUCCESS, UPDATE_PROJECT_FAILURE,
  CLEAR_LOADED_PROJECT
} from '../config/constants'
import { createProject as createProjectApi, updateProject as updateProjectApi, getProjectById } from '../api/projects'

export function createProject(newProject) {
  return ((dispatch) => {
    dispatch({
      type: CREATE_PROJECT,
      newProject
    })

    return createProjectApi(newProject)
      .then((_project) => {
        dispatch({
          type: CREATE_PROJECT_SUCCESS,
          newProject: _project
        })
      })
      .catch((err) => {
        dispatch({
          type: CREATE_PROJECT_FAILURE,
          error: err
        })
      })
  })
}

export function clearLoadedProject() {
  return ((dispatch) => {
    dispatch({
      type: CLEAR_LOADED_PROJECT
    })
  })
}

export function updateProject(projectId, updatedProps) {
  return ((dispatch) => {
    dispatch({
      type: UPDATE_PROJECT,
      projectId,
      updatedProps
    })

    return updateProjectApi(updatedProps)
      .then((_project) => {
        dispatch({
          type: UPDATE_PROJECT_SUCCESS,
          currentProject: _project
        })
      })
      .catch((err) => {
        dispatch({
          type: UPDATE_PROJECT_FAILURE,
          err
        })
      })
  })
}

export function fetchProject(projectId) {
  return ((dispatch, getState) => {
    const state = getState()
    const projectState = state.projectState
    // check if project is being loaded or was loaded recently
    const now = new Date().getTime()
    if (projectState.projectId === projectId &&
      (now - projectState.lastUpdated.getTime() < 3000
      || projectState.isLoading)
    ) {
      // project is already loaded or is loading so dont dispatch
      // TODO - not dispatching since state should already be up to date
      return
    }
    dispatch({
      type: LOAD_PROJECT,
      projectId
    })

    return getProjectById(projectId)
      .then((project) => {
        dispatch({
          type: PROJECT_LOAD_SUCCESS,
          project
        })
      })
      .catch((err) => {
        dispatch({
          type: PROJECT_LOAD_FAILURE,
          err
        })
      })
  })
}
