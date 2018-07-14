/**
 * Products timelines actions
 */
import {
  getTimelinesByReference,
  getTimelineMilestones,
  updateMilestone,
} from '../../api/timelines'
import {
  LOAD_PRODUCT_TIMELINE_WITH_MILESTONES,
  UPDATE_PRODUCT_MILESTONE,
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
