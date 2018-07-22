/**
 * Products timelines actions
 */
import _ from 'lodash'
import moment from 'moment'
import {
  getTimelinesByReference,
  getTimelineById,
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

/**
 * Get the next milestone in the list, which is not hidden
 *
 * @param {Array}  milestones            list of milestones
 * @param {Number} currentMilestoneIndex index of the current milestone
 *
 * @returns {Object} milestone
 */
function getNextNotHiddenMilestone(milestones, currentMilestoneIndex) {
  let index = currentMilestoneIndex + 1

  while (milestones[index] && milestones[index].hidden) {
    index++
  }

  return milestones[index]
}

/**
 * Loads product timeline with milestones
 *
 * @param {String} productId product id
 */
export function loadProductTimelineWithMilestones(productId) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PRODUCT_TIMELINE_WITH_MILESTONES,
      payload: getTimelinesByReference('product', productId)
        // if product doesn't have timeline, return null
        .then((timelines) => timelines[0] || null)
        // TODO $TIMELINE_MILESTONE$  as getTimelinesByReference returns timelines not with all milestones
        // requests timelines again using endpoint which return all milestones
        // the next line has to be remove when fixed https://github.com/topcoder-platform/tc-project-service/issues/116
        .then((timeline) => timeline ? getTimelineById(timeline.id) : null),
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

/**
 * Mark the current milestone as 'completed', and the next milestone as 'active'.
 * Also adjust staring time and duration of the next milestone.
 * Optionally updates some properties of the completed milestone.
 *
 * @param {Number} productId    product id
 * @param {Number} timelineId   timeline id
 * @param {Number} milestoneId  milestone id
 * @param {Object} updatedProps (optional) milestone properties to update
 */
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

/**
 * Extends the milestone
 * Also adjust staring time and duration of the next milestone.
 *
 * @param {Number} productId      product id
 * @param {Number} timelineId     timeline id
 * @param {Number} milestoneId    milestone id
 * @param {Number} extendDuration duration to extend in days
 * @param {Object} updatedProps   (optional) milestone properties to update
 */
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

/**
 * Make visible final fixes milestone and adds the list of final fix requests.
 * Also adjust start/end time of final-fix milestone.
 * Marks that current milestone has submitted some final fixes.
 *
 * @param {Number} productId        product id
 * @param {Number} timelineId       timeline id
 * @param {Number} milestoneId      milestone id
 * @param {Array}  finalFixRequests list of final fixe requests
 */
export function submitFinalFixesRequest(productId, timelineId, milestoneId, finalFixRequests) {
  return (dispatch, getState) => {
    const timeline = getState().productsTimelines[productId]
    const milestoneIdx = _.findIndex(timeline.timeline.milestones, { id: milestoneId })
    const milestone = timeline.timeline.milestones[milestoneIdx]

    const finalFixesMilestone = timeline.timeline.milestones[milestoneIdx - 1]

    if (!finalFixesMilestone || finalFixesMilestone.type !== 'final-fix') {
      throw new Error('Cannot find final-fix milestone.')
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
