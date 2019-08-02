
import {
  getProjectWorkstreams,
} from '../../api/workstreams'
import { loadWorkForWorkstreams } from './works'
import { LOAD_WORKSTREAMS } from '../../config/constants'

/**
 * Load project workstreams
 * @param {Object} project project object
 *
 * @return {Function} dispatch function
 */
export function loadProjectWorkstreams(project) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_WORKSTREAMS,
      payload: getProjectWorkstreams(project.id)
    }).then(({ value: workstreams }) => loadWorkForWorkstreams(project.id, workstreams, dispatch))
  }
}
