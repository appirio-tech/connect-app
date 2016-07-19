// import _ from 'lodash'
// import { fetchJSON } from '../helpers'
import {
  LOAD_PROJECT, CLEAR_LOADED_PROJECT, PROJECT_LOAD_SUCCESS, PROJECT_LOAD_FAILURE
} from '../config/constants'

export function loadProject(projectId) {
  return ((dispatch, getState) => {
    const state = getState()
    const loadedProject = state.loadProject.project
    dispatch({ type: CLEAR_LOADED_PROJECT, projectId, loadedProject })
    dispatch({ type: LOAD_PROJECT, projectId })

    // TODO get more project details
    dispatch({ type: PROJECT_LOAD_SUCCESS,
      project: {
        id : 30043672,
        name: 'LUX challenge for HP',
        challenges: 10,
        submissions: 3,
        messages: 101,
        newMessages: 2
      }
    })

  })
}

export function projectLoadSuccess(dispatch) {
  dispatch({ type: PROJECT_LOAD_SUCCESS })
  // dispatch({ type: RESET_SEARCH_TERM})
}

export function projectLoadFailure(dispatch) {
  dispatch({ type: PROJECT_LOAD_FAILURE })
  // dispatch({ type: RESET_SEARCH_TERM})
}
