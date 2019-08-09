
import {
  getTimelinesByReference,
  createMilestone as createMilestoneApi,
  updateMilestone as updateMilestoneApi,
  deleteMilestone as deleteMilestoneApi,
  getMilestone,
} from '../../api/timelines'
import {
  LOAD_WORK_TIMELINE,
  NEW_WORK_TIMELINE_MILESTONE,
  UPDATE_WORK_TIMELINE_MILESTONE,
  DELETE_WORK_TIMELINE_MILESTONE,
  LOAD_WORK_TIMELINE_MILESTONE
} from '../../config/constants'

/**
 * Load work timelines
 * @param {String} workId       work id
 *
 * @return {Function} dispatch function
 */
export function loadWorkTimelines(workId) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_WORK_TIMELINE,
      payload: getTimelinesByReference('work', workId).then(timelines => ({ timelines, workId }))
    })
  }
}

/**
 * New milestone
 *
 * @param {Number} timelineId   timeline id
 * @param {Object} milestone milestone
 *
 * @return {Function} dispatch function
 */
export function createMilestone(timelineId, milestone) {
  return (dispatch) => {
    return dispatch({
      type: NEW_WORK_TIMELINE_MILESTONE,
      payload: createMilestoneApi(timelineId, milestone).then(newMilestone => ({ timelineId, milestone: newMilestone }))
    })
  }
}

/**
 * Update milestone
 *
 * @param {Number} workId       work id
 * @param {Number} timelineId   timeline id
 * @param {Number} milestoneId   milestone id
 * @param {Object} updatedProps updated milestone property
 *
 * @return {Function} dispatch function
 */
export function updateMilestone(workId, timelineId, milestoneId, updatedProps) {
  let milestone
  return (dispatch) => {
    return dispatch({
      type: UPDATE_WORK_TIMELINE_MILESTONE,
      payload: updateMilestoneApi(timelineId, milestoneId, updatedProps).then(result => {
        milestone = result
        return getTimelinesByReference('work', workId)
      }).then(timelines => {
        return {
          milestone: _.extend(milestone, {timelineId, milestoneId}),
          timelines
        }
      })
    })
  }
}

/**
 * Load milestone
 *
 * @param {Number} timelineId   timeline id
 * @param {Number} milestoneId   milestone id
 *
 * @return {Function} dispatch function
 */
export function loadMilestone(timelineId, milestoneId) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_WORK_TIMELINE_MILESTONE,
      payload: getMilestone(timelineId, milestoneId).then(milestone => _.extend(milestone, {timelineId}))
    })
  }
}

/**
 * Delete milestone
 *
 * @param {Number} workId       work id
 * @param {Number} timelineId   timeline id
 * @param {Number} milestoneId   milestone id
 *
 * @return {Function} dispatch function
 */
export function deleteMilestone(workId, timelineId, milestoneId) {
  return (dispatch) => {
    return dispatch({
      type: DELETE_WORK_TIMELINE_MILESTONE,
      payload: deleteMilestoneApi(timelineId, milestoneId).then(() => getTimelinesByReference('work', workId)).then(timelines => {
        return {
          timelines
        }
      })
    })
  }
}
