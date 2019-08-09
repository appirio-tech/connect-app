
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
 * New milestone
 *
 * @param {Number} timelineId   timeline id
 * @param {Object} milestone milestone
 *
 * @return {Function} dispatch function
 */
export function createMilestone(timelineId, milestone) {
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
      payload: createMilestoneApi(timelineId, milestoneData).then(newMilestone => ({ timelineId, milestone: newMilestone }))
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
