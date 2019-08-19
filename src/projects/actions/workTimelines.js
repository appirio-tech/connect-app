
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
import _ from 'lodash'

/**
 * Load work timeline
 *
 * @param {String} workId work id
 *
 * @return {Function} action creator
 */
export function loadWorkTimeline(workId) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_WORK_TIMELINE,
      payload: getTimelinesByReference('work', workId).then(timelines => ({ timelines })),
      meta: { workId },
    })
  }
}

const demoDetails = {
  prevMilestoneContent: {
    designs: [
      {
        title: 'Option 1 - Creative Freedom',
        submissionId: '273645',
        previewUrl: 'https://topcoder-dev-media.s3.amazonaws.com/member/profile/pshah_manager-1565325063054.jpeg',
        links: [
          {
            title: '001 Puppy Mobile',
            url: 'https://marvelapp.com/54cf844/screen/59214040'
          },
          {
            title: '001 Puppy Desktop',
            url: 'https://marvelapp.com/54cf844/screen/59214021'
          },
          {
            title: 'GDrive',
            url: 'https://marvelapp.com/54cf844/screen/59214017'
          }
        ]
      },
      {
        title: 'Option 2 - Nature',
        submissionId: '273646',
        previewUrl: 'https://topcoder-dev-media.s3.amazonaws.com/member/profile/pshah_customer-1552561016111.png',
        links: [
          {
            title: '001 Puppy Mobile',
            url: 'https://marvelapp.com/54cf844/screen/59214040'
          },
          {
            title: '001 Puppy Desktop',
            url: 'https://marvelapp.com/54cf844/screen/59214067'
          },
          {
            title: 'GDrive',
            url: 'https://marvelapp.com/54cf844/screen/59214068'
          }
        ]
      },
      {
        title: 'Option 3 - Zen/Nature',
        submissionId: '273647',
        previewUrl: 'https://topcoder-dev-media.s3.amazonaws.com/member/profile/pshah_customer-1552561016111.png',
        links: [
          {
            title: '001 Puppy Mobile',
            url: 'https://marvelapp.com/54cf844/screen/59214040'
          },
          {
            title: '001 Puppy Desktop',
            url: 'https://marvelapp.com/54cf844/screen/59214067'
          },
          {
            title: 'GDrive',
            url: 'https://marvelapp.com/54cf844/screen/59214068'
          }
        ]
      }
    ]
  }
}

/**
 * Create a new milestone for work timeline
 *
 * @param {Number} workId     work id
 * @param {Number} timelineId timeline id
 * @param {Object} milestone  milestone
 *
 * @return {Function} action creator
 */
export function createWorkMilestone(workId, timelineId, milestone) {
  // START: ADD DEMO DATA
  const milestoneData = {...milestone}

  if (milestone.type === 'checkpoint-review') {
    milestoneData.details = demoDetails
  }

  if (milestone.type === 'final-designs') {
    const demoDetailsFinal = _.cloneDeep(demoDetails)
    demoDetailsFinal.prevMilestoneContent.designs.reverse()
    milestoneData.details = demoDetailsFinal
  }
  // END: ADD DEMO DATA

  return (dispatch) => {
    return dispatch({
      type: NEW_WORK_TIMELINE_MILESTONE,
      payload: createMilestoneApi(timelineId, milestoneData).then(newMilestone => {
        // reload timeline after creating a milestone,
        // because backend could make cascading updates to the timeline and other milestones
        dispatch(loadWorkTimeline(workId))

        return ({ milestone: newMilestone })
      }),
      meta: {
        workId,
        timelineId,
      }
    })
  }
}

/**
 * Update milestone for work timeline
 *
 * @param {Number} workId          work id
 * @param {Number} timelineId      timeline id
 * @param {Object} milestoneUpdate milestone data to update
 *
 * @return {Function} dispatch function
 */
export function updateWorkMilestone(workId, timelineId, milestoneId, milestoneUpdate) {
  return (dispatch) => {
    return dispatch({
      type: UPDATE_WORK_TIMELINE_MILESTONE,
      payload: updateMilestoneApi(timelineId, milestoneId, milestoneUpdate).then(updatedMilestone => {
        // reload timeline after updating a milestone,
        // because backend could make cascading updates to the timeline and other milestones
        dispatch(loadWorkTimeline(workId))

        return ({ milestone: updatedMilestone })
      }),
      meta: {
        workId,
        timelineId,
        milestoneId,
      }
    })
  }
}

/**
 * Load milestone for work timeline
 *
 * @param {Number} workId      work id
 * @param {Number} timelineId  timeline id
 * @param {Number} milestoneId milestone id
 *
 * @return {Function} dispatch function
 */
export function loadWorkMilestone(workId, timelineId, milestoneId) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_WORK_TIMELINE_MILESTONE,
      payload: getMilestone(timelineId, milestoneId).then(milestone => ({ milestone })),
      meta: {
        workId,
        timelineId,
        milestoneId,
      }
    })
  }
}

/**
 * Delete milestone for work timeline
 *
 * @param {Number} workId       work id
 * @param {Number} timelineId   timeline id
 * @param {Number} milestoneId  milestone id
 *
 * @return {Function} dispatch function
 */
export function deleteWorkMilestone(workId, timelineId, milestoneId) {
  return (dispatch) => {
    return dispatch({
      type: DELETE_WORK_TIMELINE_MILESTONE,
      payload: deleteMilestoneApi(timelineId, milestoneId).then(() => {
        // reload timeline after deleting a milestone,
        // because backend could make cascading updates to the timeline and other milestones
        dispatch(loadWorkTimeline(workId))
      }),
      meta: {
        workId,
        timelineId,
        milestoneId,
      }
    })
  }
}
