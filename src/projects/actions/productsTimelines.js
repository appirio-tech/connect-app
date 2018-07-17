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
  MILESTONE_STATUS,
} from '../../config/constants'

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
      })
    ]

    const nextMilestone = timeline.timeline.milestones[milestoneIdx + 1]
    if (nextMilestone) {
      const startDate = moment()
      const endDate = moment(nextMilestone.endDate)

      requests.push(
        updateMilestone(timelineId, nextMilestone.id, {
          startDate: startDate.format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
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
