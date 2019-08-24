import moment from 'moment'
import _ from 'lodash'
import {
  getWorkInfo,
  updateWorkInfo,
  newWorkInfo,
  deleteWorkInfo,
  getWorkitems,
  newWorkitem,
  deleteWorkitem as deleteWorkitemApi
} from '../../api/works'
import {
  createTimeline,
  createMilestone,
} from '../../api/timelines'
import {
  loadWorkTimeline,
} from './workTimelines'
import {
  getChallengesByFilter,
} from '../../api/challenges'
import {
  LOAD_WORK_INFO,
  UPDATE_WORK_INFO,
  NEW_WORK_INFO,
  DELETE_WORK_INFO,
  LOAD_CHALLENGES,
  LOAD_CHALLENGES_START,
  LOAD_WORK_ITEM,
  NEW_WORK_ITEM,
  DELETE_WORK_ITEM,
  DELETE_WORK_ITEM_START,
  LOAD_CHALLENGES_WORK_ITEM,
  PHASE_STATUS_ACTIVE,
  PHASE_STATUS_DRAFT,
  MILESTONE_TYPE,
} from '../../config/constants'

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
 * Create default milestones for work
 *
 * Creates 2 milestones:
 * - Start, with status `active`
 * - Complete, with status `draft`
 *
 * @param {Object} work     work
 * @param {Object} timeline timeline
 *
 * @returns {Promise<Object>} complete milestone
 */
function createDefaultMilestones(work, timeline) {
  const startMilestoneDuration = work.duration > 1 ? work.duration - 1 : 1
  const completeMilestoneDuration = 1
  // as we creating the first milestone as active, we set the start day as today
  const startDate = moment()

  return createMilestone(timeline.id, {
    name: 'Start',
    type: MILESTONE_TYPE.COMMUNITY_WORK,
    duration: startMilestoneDuration,
    startDate,
    actualStartDate: startDate,
    endDate: startDate.clone().add(startMilestoneDuration - 1, 'days'),
    status: PHASE_STATUS_ACTIVE,
    order: 1,
    plannedText: 'empty',
    activeText: 'empty',
    completedText: 'empty',
    blockedText: 'empty',
  }).then(() => createMilestone(timeline.id, {
    name: 'Complete',
    type: MILESTONE_TYPE.COMMUNITY_WORK,
    duration: completeMilestoneDuration,
    startDate: startDate.clone().add(startMilestoneDuration, 'days'),
    endDate: startDate.clone().add(startMilestoneDuration + 1, 'days'),
    status: PHASE_STATUS_DRAFT,
    order: 2,
    plannedText: 'empty',
    activeText: 'empty',
    completedText: 'empty',
    blockedText: 'empty',
  }))
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
  return (dispatch, getState) => {
    const state = getState()
    const work = state.works.work
    const workTimeline = _.get(state.workTimelines.timelines[workId], 'timeline')

    const isWorkActivated = work.status !== PHASE_STATUS_ACTIVE &&
      updatedProps.status === PHASE_STATUS_ACTIVE

    const isWorkHaveMilestones = workTimeline && workTimeline.milestones && workTimeline.milestones.length > 0

    return dispatch({
      type: UPDATE_WORK_INFO,
      payload: updateWorkInfo(projectId, workstreamId, workId, updatedProps)
    }).then(() => {
      // if milestone has been activated, but doesn't have any milestones yet,
      // we should created default milestones with the first one active
      if (isWorkActivated && !isWorkHaveMilestones) {
        return createDefaultMilestones(work, workTimeline)
          // after creating milestones we should reload timeline to get updates in Redux store
          .then(() => dispatch(loadWorkTimeline(work.id)))
      }
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
        createTimelineForWork(work)
          .then((timeline) => {
            // if we created a work with active status, we should also create default milestones
            if (work.status === PHASE_STATUS_ACTIVE) {
              return createDefaultMilestones(work, timeline, dispatch)
            }
          })
          // after we created timeline for work, we should load the timeline to the Redux store
          // we wait until timeline is loaded before finishing work creating action
          // as we need milestone to render work card on the workstreams list (though not critical)
          .then(() => dispatch(loadWorkTimeline(work.id)))
          .then(() => work)
      )),
      meta: {
        workstreamId,
      },
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

/**
  * Start get list of challenge
 *
 * @return {Function} empty dispatch function
  */
export function startLoadChallenges() {
  return (dispatch) => {
    return dispatch({
      type: LOAD_CHALLENGES_START,
      payload: Promise.resolve()
    })
  }
}

/**
  * Get list of challenge
  * @param {String} query query string
  * @param {Number} directProjectId direct project id
  * @param {Number} offset offset of the list, default 0
 *
 * @return {Function} dispatch function
  */
export function loadChallenges(query, directProjectId, offset=0) {
  let filterString = 'status=ACTIVE'
  if (query) {
    filterString += `&name=${query}`
  }
  if (!_.isNil(directProjectId)) {
    filterString += `&projectId=${directProjectId}`
  }
  return (dispatch) => {
    return dispatch({
      type: LOAD_CHALLENGES,
      payload: getChallengesByFilter(encodeURIComponent(filterString), offset)
    })
  }
}

/**
  * Get list of challenge of workitems
  * @param {Array} workitems work item array
  * @param {Object} dispatch dispatch for action
 *
 * @return {Function} dispatch function
  */
export function loadChallengesForWorkItems(workitems, dispatch) {
  const challengesId = workitems.map(workItem => _.get(workItem, 'details.challengeId')).join(',')
  return dispatch({
    type: LOAD_CHALLENGES_WORK_ITEM,
    payload: getChallengesByFilter(`id=in(${challengesId})`, null)
  })
}

/**
 * Load work items
 * @param {String} projectId    project id
 * @param {String} workstreamId workstream id
 * @param {String} workId       work id
 *
 * @return {Function} dispatch function
 */
export function loadWorkitems(projectId, workstreamId, workId) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_WORK_ITEM,
      payload: getWorkitems(projectId, workstreamId, workId)
        .then((results) => {
          Promise.all([loadChallengesForWorkItems(results, dispatch)])
          return results
        })
    })
  }
}

/**
 * Create work item for a challenge
 *
 * @param {String} projectId    project id
 * @param {String} workstreamId workstream id
 * @param {String} workId       work id
 * @param {Object} challenge challenge
 *
 * @return {Promise} workitem
 */
function createWorkitemForChallenge(projectId, workstreamId, workId, challenge) {
  return newWorkitem(projectId, workstreamId, workId, {
    name: challenge.name,
    directProjectId: challenge.projectId,
    type: `challenge-${challenge.subTrack}`,
    templateId: challenge.templateId,
    details: {
      challengeId: challenge.id
    },
  })
}

/**
 * Create new work item
 * @param {String} projectId    project id
 * @param {String} workstreamId workstream id
 * @param {String} workId       work id
 * @param {Array} challenges  list of selected challenges
 *
 * @return {Function} dispatch function
 */
export function createWorkitem(projectId, workstreamId, workId, challenges) {
  return (dispatch) => {
    return dispatch({
      type: NEW_WORK_ITEM,
      payload: Promise.all(challenges.map(challenge => createWorkitemForChallenge(projectId, workstreamId, workId, challenge)))
        .then((results) => {
          results.forEach((workitem) => {
            const challengeId = _.get(workitem, 'details.challengeId', 0)
            workitem.challenge = _.find(challenges, { id: challengeId })
          })
          return results
        })
    })
  }
}

/**
  * Start delete work item
 * @param {String} workItemId       work item id
 *
 * @return {Function} empty dispatch function
  */
export function startDeleteWorkitem(workItemId) {
  return (dispatch) => {
    return dispatch({
      type: DELETE_WORK_ITEM_START,
      payload: Promise.resolve(workItemId)
    })
  }
}

/**
 * Delete new work item
 * @param {String} projectId    project id
 * @param {String} workstreamId workstream id
 * @param {String} workId       work id
 * @param {String} workItemId       work item id
 *
 * @return {Function} dispatch function
 */
export function deleteWorkitem(projectId, workstreamId, workId, workItemId) {
  return (dispatch) => {
    return dispatch({
      type: DELETE_WORK_ITEM,
      payload: deleteWorkitemApi(projectId, workstreamId, workId, workItemId)
    })
  }
}
