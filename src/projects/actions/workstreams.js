
import {
  getProjectWorkstreams,
  getWorkstreamWorks,
} from '../../api/workstreams'
import {
  loadWorkTimeline,
} from './workTimelines'
import {
  LOAD_WORKSTREAMS,
  LOAD_WORKSTREAM_WORKS,
} from '../../config/constants'

/**
 * Get works for workstream
 *
 * @param {String} projectId    project id
 * @param {Object} workstream   workstream object
 *
 * @return {Function} dispatch function
 */
function getWorksForWorkstream(projectId, workstream) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_WORKSTREAM_WORKS,
      payload: getWorkstreamWorks(projectId, workstream.id).then((works) => {
        // load timelines for all the works, so we can show special action buttons in the workstream list
        // TODO: theoretically we can optimize this and load timelines only for action works as most likely
        // we would only show special button for active works only
        return Promise.all(works.map((work) => dispatch(loadWorkTimeline(work.id)))).then(() => ({ works }))
      }),
      meta: {
        workstreamId: workstream.id,
      }
    })
  }
}

/**
 * Get works for array of workstream
 * @param {String} projectId      project id
 * @param {Array} workstreams     array of workstream
 * @param {Function} dispatch     dispatch
 *
 * @return {Promise} Combine promise of get works for workstream
 */
function loadWorkForWorkstreams(projectId, workstreams, dispatch) {
  return Promise.all(
    workstreams.map((workstream) => dispatch(getWorksForWorkstream(projectId, workstream)))
  )
}

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
