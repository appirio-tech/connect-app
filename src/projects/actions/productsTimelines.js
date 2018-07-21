/**
 * Products timelines actions
 */
import _ from 'lodash'
import moment from 'moment'
import {
  getTimelinesByReference,
  getTimelineMilestones,
  updateMilestone,
} from '../../api/timelines'
import {
  LOAD_PRODUCT_TIMELINE_WITH_MILESTONES,
  UPDATE_PRODUCT_MILESTONE,
  COMPLETE_PRODUCT_MILESTONE,
  EXTEND_PRODUCT_MILESTONE,
  SUBMIT_FINAL_FIXES_REQUEST,
  MILESTONE_STATUS,
} from '../../config/constants'

function getNextNotHiddenMilestone(milestones, currentMilestoneIndex) {
  let index = currentMilestoneIndex + 1

  while (milestones[index] && milestones[index].hidden) {
    index++
  }

  return milestones[index]
}

/**
 * Populate timeline with the `milestones` property
 *
 * @param {Object} timeline timeline
 *
 * @returns {Promise} timeline object with `milestones`
 */
function populateProductTimelineWithMilestones(timeline) {
  return getTimelineMilestones(timeline.id)
    .then((milestones) => {
      timeline.milestones = milestones

      return timeline
    })
}

/**
 * Loads product timeline with milestones
 *
 * @param {String} productId
 */
export function loadProductTimelineWithMilestones(productId) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PRODUCT_TIMELINE_WITH_MILESTONES,
      payload: getTimelinesByReference('product', productId)
        .then((timelines) => timelines[0])
        .then(populateProductTimelineWithMilestones),
      meta: {
        productId
      }
    })
  }
}

/**
 * Update product milestone
 *
 * @param {Number} timelineId   timeline id
 * @param {Number} milestoneId  milestone id
 * @param {Object} updatedProps params need to update
 *
 * @return {Promise} updated milestone
 */
export function updateProductMilestone(productId, timelineId, milestoneId, updatedProps) {
  return (dispatch) => {
    return dispatch({
      type: UPDATE_PRODUCT_MILESTONE,
      payload: updateMilestone(timelineId, milestoneId, updatedProps),
      meta: {
        productId,
        milestoneId,
      }
    })
  }
}

export function completeProductMilestone(productId, timelineId, milestoneId, updatedProps = {}) {
  return (dispatch, getState) => {
    const timeline = getState().productsTimelines[productId]
    const milestoneIdx = _.findIndex(timeline.timeline.milestones, { id: milestoneId })

    const requests = [
      updateMilestone(timelineId, milestoneId, {
        ...updatedProps, // optional props to update
        status: MILESTONE_STATUS.COMPLETED,
        endDate: moment().utc().format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
        completionDate: moment().utc().format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
      })
    ]

    const nextMilestone = getNextNotHiddenMilestone(timeline.timeline.milestones, milestoneIdx)
    if (nextMilestone) {
      const startDate = moment()
      const endDate = moment(nextMilestone.endDate)

      requests.push(
        updateMilestone(timelineId, nextMilestone.id, {
          startDate: startDate.utc().format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
          duration: endDate.diff(startDate, 'days'),
          status: MILESTONE_STATUS.ACTIVE,
        })
      )
    }

    return dispatch({
      type: COMPLETE_PRODUCT_MILESTONE,
      payload: Promise.all(requests),
      meta: {
        productId,
        milestoneId,
        nextMilestoneId: nextMilestone ? nextMilestone.id : null,
      }
    })
  }
}

export function extendProductMilestone(productId, timelineId, milestoneId, extendDuration, updatedProps = {}) {
  return (dispatch, getState) => {
    const timeline = getState().productsTimelines[productId]
    const milestoneIdx = _.findIndex(timeline.timeline.milestones, { id: milestoneId })

    // move current milestone endDate
    const milestone = timeline.timeline.milestones[milestoneIdx]
    const startDate = moment(milestone.startDate)
    const endDate = moment(milestone.endDate)
    endDate.add(extendDuration, 'days')

    const requests = [
      updateMilestone(timelineId, milestoneId, {
        ...updatedProps, // optional props to update
        endDate: endDate.utc().format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
        duration: endDate.diff(startDate, 'days'),
      })
    ]

    // move next milestone startDate
    const nextMilestone = getNextNotHiddenMilestone(timeline.timeline.milestones, milestoneIdx)
    if (nextMilestone) {
      const nextStartDate = endDate.clone().add(1, 'days')
      const nextEndDate = moment(nextMilestone.endDate)

      requests.push(
        updateMilestone(timelineId, nextMilestone.id, {
          startDate: nextStartDate.utc().format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
          duration: nextEndDate.diff(nextStartDate, 'days'),
        })
      )
    }

    return dispatch({
      type: EXTEND_PRODUCT_MILESTONE,
      payload: Promise.all(requests),
      meta: {
        productId,
        milestoneId,
        nextMilestoneId: nextMilestone ? nextMilestone.id : null,
      }
    })
  }
}

export function submitFinalFixesRequest(productId, timelineId, milestoneId, finalFixRequests) {
  return (dispatch, getState) => {
    const timeline = getState().productsTimelines[productId]
    const milestoneIdx = _.findIndex(timeline.timeline.milestones, { id: milestoneId })
    const milestone = timeline.timeline.milestones[milestoneIdx]

    const finalFixesMilestone = timeline.timeline.milestones[milestoneIdx - 1]

    if (!finalFixesMilestone || finalFixesMilestone.type !== 'final-fixes') {
      throw new Error('Cannot find final-fixes milestone.')
    }

    const requests = [
      // mark that final fixes submitted in the current milestone
      updateMilestone(timelineId, milestoneId, {
        details: {
          ...milestone.details,
          content: {
            ..._.get(milestone, 'details.content', {}),
            isFinalFixesSubmitted: true,
          }
        }
      }),

      // show final fixes milestone
      updateMilestone(timelineId, finalFixesMilestone.id, {
        status: MILESTONE_STATUS.COMPLETED,
        hidden: false,
        startDate: milestone.startDate,
        endDate: milestone.startDate,
        completionDate: milestone.startDate,
        details: {
          ...finalFixesMilestone.details,
          content: {
            ..._.get(finalFixesMilestone, 'details.content', {}),
            finalFixRequests,
          }
        }
      })
    ]

    // to update using reducer in redux store
    const nextMilestone = finalFixesMilestone

    return dispatch({
      type: SUBMIT_FINAL_FIXES_REQUEST,
      payload: Promise.all(requests),
      meta: {
        productId,
        milestoneId,
        nextMilestoneId: nextMilestone ? nextMilestone.id : null,
      }
    })
  }
}
