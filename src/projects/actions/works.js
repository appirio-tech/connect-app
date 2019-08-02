import moment from 'moment'
import {
  getWorkstreamWorks,
  getWorkInfo,
  updateWorkInfo,
  newWorkInfo,
  deleteWorkInfo,
} from '../../api/works'
import {
  createTimeline,
} from '../../api/timelines'
import {
  LOAD_WORKSTREAM_WORKS,
  LOAD_WORKSTREAM_WORKS_START,
  LOAD_WORK_INFO,
  UPDATE_WORK_INFO,
  NEW_WORK_INFO,
  DELETE_WORK_INFO,
} from '../../config/constants'

/**
 * Get works for workstream
 * @param {Function} dispatch     dispatch
 * @param {String} projectId    project id
 * @param {Object} workstream   workstream object
 *
 * @return {Function} dispatch function
 */
function getWorksForWorkstream(dispatch, projectId, workstream) {
  return dispatch({
    type: LOAD_WORKSTREAM_WORKS,
    payload:  new Promise((resolve, reject) => {
      return getWorkstreamWorks(projectId, workstream.id)
        .then((resp) => {
          workstream.works = resp
          resolve(workstream)
        })
        .catch(err => reject(err))
    }),
  })
}

/**
 * Start get works for workstream
 * @param {Function} dispatch     dispatch
 * @param {String} projectId    project id
 * @param {Object} workstream   workstream object
 *
 * @return {Function} dispatch function
 */
function getWorksForWorkstreamStart(dispatch, projectId, workstream) {
  return dispatch({
    type: LOAD_WORKSTREAM_WORKS_START,
    payload:  new Promise((resolve) => {
      resolve(workstream)
      return getWorksForWorkstream(dispatch, projectId, workstream)
    }),
  })
}

/**
 * Get works for array of workstream
 * @param {String} projectId      project id
 * @param {Array} workstreams     array of workstream
 * @param {Function} dispatch     dispatch
 *
 * @return {Promise} Combine promise of get works for workstream
 */
export function loadWorkForWorkstreams(projectId, workstreams, dispatch) {
  return Promise.all(
    workstreams.map((workstream) => getWorksForWorkstreamStart(dispatch, projectId, workstream))
  )
}

/**
 * Load work info
 * @param {String} projectId    project id
 * @param {String} workstreamId workstream id
 * @param {String} workId       work id
 *
 * @return {Function} dispatch function
 */
export function loadWorkInfo(projectId, workstreamId, workId) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_WORK_INFO,
      payload: getWorkInfo(projectId, workstreamId, workId)
    })
  }
}

/**
 * Update work info
 * @param {String} projectId    project id
 * @param {String} workstreamId workstream id
 * @param {String} workId       work id
 * @param {Object} updatedProps param need to update
 *
 * @return {Function} dispatch function
 */
export function updateWork(projectId, workstreamId, workId, updatedProps) {
  return (dispatch) => {
    return dispatch({
      type: UPDATE_WORK_INFO,
      payload: updateWorkInfo(projectId, workstreamId, workId, updatedProps)
    })
  }
}

/**
 * Create new work info
 * @param {String} projectId    project id
 * @param {String} workstreamId workstream id
 * @param {Object} newProps param need to create
 *
 * @return {Function} dispatch function
 */
export function createWork(projectId, workstreamId, newProps) {
  return (dispatch) => {
    return dispatch({
      type: NEW_WORK_INFO,
      payload: newWorkInfo(projectId, workstreamId, newProps).then((work) => (
        // we also, create a timeline for work
        createTimelineForWork(work).then(() => work)
      ))
    })
  }
}

/**
 * Create timeline for work
 *
 * @param {Object} work work
 *
 * @return {Promise<Object>} timeline
 */
function createTimelineForWork(work) {
  return createTimeline({
    name: 'Work timeline',
    description: 'This timeline will represent the main milestones in this work.',
    startDate: moment(work.startDate).format('YYYY-MM-DD'),
    endDate: null,
    reference: 'work',
    referenceId: work.id,
  })
}

/**
 * Delete work info
 * @param {String} projectId    project id
 * @param {String} workstreamId workstream id
 * @param {String} workId       work id
 *
 * @return {Function} dispatch function
 */
export function deleteWork(projectId, workstreamId, workId) {
  return (dispatch) => {
    return dispatch({
      type: DELETE_WORK_INFO,
      payload: deleteWorkInfo(projectId, workstreamId, workId)
    })
  }
}
