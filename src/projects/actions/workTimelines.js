import _ from 'lodash'
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
  LOAD_WORK_TIMELINE_MILESTONE,
  COMPLETE_WORK_TIMELINE_MILESTONE,
  MILESTONE_STATUS,
} from '../../config/constants'
import { getNextNotHiddenMilestone } from '../../helpers/milestoneHelper'


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
      payload: getTimelinesByReference('work', workId)
        .then(timelines => {
          const timeline = timelines[0]

          if (!timeline) {
            const err = new Error('Timeline for work is not found.')
            _.set(err, 'response.data.result.content.message', 'Timeline for work is not found.')
            _.set(err, 'response.status', 404)

            throw err
          }

          if (!timeline.milestones) {
            timeline.milestones = []
          }

          return {
            timeline,
          }
        }),
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
      payload: createMilestoneApi(timelineId, milestoneData).then(newMilestone => ({ milestone: newMilestone })),
      meta: {
        workId,
        timelineId,
      }
    }).then(() => {
      // reload timeline after creating a milestone,
      // because backend could make cascading updates to the timeline and other milestones
      dispatch(loadWorkTimeline(workId))
    })
  }
}

/**
 * Update milestone for work timeline
 *
 * @param {Number} workId          work id
 * @param {Number} timelineId      timeline id
 * @param {Object} milestoneUpdate milestone data to update
 * @param {Array} progressIds   array of progress id
 *
 * @return {Function} dispatch function
 */
export function updateWorkMilestone(workId, timelineId, milestoneId, milestoneUpdate, progressIds) {
  return (dispatch) => {
    return dispatch({
      type: UPDATE_WORK_TIMELINE_MILESTONE,
      payload: updateMilestoneApi(timelineId, milestoneId, milestoneUpdate).then(updatedMilestone => ({ milestone: updatedMilestone })),
      meta: {
        workId,
        timelineId,
        milestoneId,
        progressIds
      }
    }).then(() => {
      // reload timeline after creating a milestone,
      // because backend could make cascading updates to the timeline and other milestones
      dispatch(loadWorkTimeline(workId))
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
      payload: deleteMilestoneApi(timelineId, milestoneId),
      meta: {
        workId,
        timelineId,
        milestoneId,
      }
    }).then(() => {
      // reload timeline after creating a milestone,
      // because backend could make cascading updates to the timeline and other milestones
      dispatch(loadWorkTimeline(workId))
    })
  }
}

/**
 * Mark work milestone as completed
 *
 * @param {Number} workId         work id
 * @param {Number} timelineId     timeline id
 * @param {Number} milestoneId    milestone id
 * @param {Object} [updatedProps] milestone properties to update
 *
 * @return {Function} dispatch function
 */
export function completeWorkMilestone(workId, timelineId, milestoneId, updatedProps) {
  return (dispatch, getState) => {
    const state = getState()
    let nextMilestone
    const timeline = _.get(state.workTimelines.timelines[workId], 'timeline')
    if (timeline) {
      const milestoneIdx = _.findIndex(timeline.milestones, { id: milestoneId })
      nextMilestone = getNextNotHiddenMilestone(timeline.milestones, milestoneIdx)
    }

    return dispatch({
      type: COMPLETE_WORK_TIMELINE_MILESTONE,
      payload: updateMilestoneApi(timelineId, milestoneId, {
        ...updatedProps,
        status: MILESTONE_STATUS.COMPLETED,
      }).then((completedMilestone) => {
        // When we complete milestone we should copy content of the completed milestone to the next milestone
        // so the next milestone could use it for its own needs
        // TODO $TIMELINE_MILESTONE$ updating of the next milestone could be done in parallel
        // but due to the backend issue https://github.com/topcoder-platform/tc-project-service/issues/162
        // we do in sequentially for now
        if (nextMilestone) {
          // NOTE we wait until the next milestone is also updated before fire COMPLETE_WORK_TIMELINE_MILESTONE_SUCCESS
          const details = {
            ...nextMilestone.details,
            prevMilestoneContent: completedMilestone.details.content,
            prevMilestoneType: completedMilestone.type,
          }
          const isFinishedEnteringDesignForReview = (
            (nextMilestone.type === 'checkpoint-review' || nextMilestone.type === 'final-designs') &&
            completedMilestone.type === 'design-works'
          )
          if (isFinishedEnteringDesignForReview) {
            details.metadata = {
              ..._.get(nextMilestone.details, 'metadata', {}),
              waitingForCustomer: true
            }
          }
          return updateMilestoneApi(timelineId, nextMilestone.id, {
            details
          // always return completedMilestone for COMPLETE_WORK_TIMELINE_MILESTONE
          }).then(() => ({ milestone: completedMilestone }))
        } else {
          // always return completedMilestone for COMPLETE_WORK_TIMELINE_MILESTONE
          return ({ milestone: completedMilestone })
        }
      }),
      meta: {
        workId,
        timelineId,
        milestoneId,
      }
    }).then(() => {
      // reload timeline after completing a milestone,
      // because backend could make cascading updates to the timeline and other milestones
      dispatch(loadWorkTimeline(workId))
    })
  }
}