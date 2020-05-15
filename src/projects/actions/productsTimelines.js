/**
 * Products timelines actions
 */
import _ from 'lodash'
import {
  getTimelinesByReference,
  getTimelineById,
  updateMilestones,
  updateTimeline,
} from '../../api/timelines'
import {updatePhase} from './project'
import {
  LOAD_PRODUCT_TIMELINE_WITH_MILESTONES,
  UPDATE_PRODUCT_MILESTONE_PENDING,
  UPDATE_PRODUCT_MILESTONE_SUCCESS,
  UPDATE_PRODUCT_MILESTONE_FAILURE,
  COMPLETE_PRODUCT_MILESTONE_PENDING,
  COMPLETE_PRODUCT_MILESTONE_SUCCESS,
  COMPLETE_PRODUCT_MILESTONE_FAILURE,
  EXTEND_PRODUCT_MILESTONE_PENDING,
  EXTEND_PRODUCT_MILESTONE_SUCCESS,
  EXTEND_PRODUCT_MILESTONE_FAILURE,
  SUBMIT_FINAL_FIXES_REQUEST_PENDING,
  SUBMIT_FINAL_FIXES_REQUEST_SUCCESS,
  SUBMIT_FINAL_FIXES_REQUEST_FAILURE,
  MILESTONE_STATUS,
  UPDATE_PRODUCT_TIMELINE,
  PHASE_STATUS_COMPLETED,
  BULK_UPDATE_PRODUCT_MILESTONES,
} from '../../config/constants'
import { processUpdateMilestone } from '../../helpers/milestoneHelper'

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
 * Check if the milestone is last non-hidden milestone in the timeline or no
 *
 * @param {Object} milestones     timeline's milestones
 * @param {Number} milestoneIdx milestone index
 *
 * @returns {Boolean} true if milestone is last non-hidden
 */
function checkIfLastMilestone(milestones, milestoneIdx) {
  return _.slice(milestones, milestoneIdx + 1).filter(m => !m.hidden).length === 0
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
        .then((timelines) => timelines[0] || null),
      meta: {
        productId
      }
    })
  }
}

/**
 * Loads product timeline, by timeline id, with milestones
 *
 * @param {String} timelineId timeline id
 * @param {String} productId product id
 */
export function loadProductTimelineWithMilestonesById(timelineId, productId) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PRODUCT_TIMELINE_WITH_MILESTONES,
      payload: getTimelineById(timelineId),
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
  return (dispatch, getState) => {
    const timeline = getState().productsTimelines[productId].timeline
    const milestoneIdx = _.findIndex(timeline.milestones, { id: milestoneId })
    const milestone = timeline.milestones[milestoneIdx]
    const updatedTimelineMilestones = processUpdateMilestone(milestone, updatedProps, timeline.milestones).updatedTimelineMilestones

    dispatch({
      type: UPDATE_PRODUCT_MILESTONE_PENDING,
      meta: {
        productId,
        milestoneId,
      }
    })

    const milestones = updatedTimelineMilestones.map(item => _.omit(item, ['timelineId', 'error', 'isUpdating', 'statusHistory']))
    return dispatch({
      type: BULK_UPDATE_PRODUCT_MILESTONES,
      payload: updateMilestones(timelineId, milestones),
      meta: { productId }
    }).then(() => {
      dispatch({
        type: UPDATE_PRODUCT_MILESTONE_SUCCESS,
        meta: { productId, milestoneId }
      })
    }).catch((error) => {
      dispatch({
        type: UPDATE_PRODUCT_MILESTONE_FAILURE,
        payload: error,
        meta: { productId, milestoneId }
      })
      throw error
    })
  }
}

/**
 * Update product timeline
 *
 * @param {Number} timelineId   timeline id
 * @param {Object} updatedProps params need to update
 */
export function updateProductTimeline(productId, timelineId, updatedProps) {
  return (dispatch) => {
    return dispatch({
      type: UPDATE_PRODUCT_TIMELINE,
      payload: updateTimeline(timelineId, updatedProps),
      meta: {
        productId,
        timelineId,
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
    const state = getState()
    const timeline = state.productsTimelines[productId].timeline
    const milestoneIdx = _.findIndex(timeline.milestones, { id: milestoneId })
    const milestone = timeline.milestones[milestoneIdx]

    const result = processUpdateMilestone(
      milestone, {
        ...updatedProps, // optional props to update
        status: MILESTONE_STATUS.COMPLETED
      }, timeline.milestones
    )

    let updatedTimelineMilestones = result.updatedTimelineMilestones
    const completedMilestone = result.updatedMilestone
    const nextMilestone = getNextNotHiddenMilestone(updatedTimelineMilestones, milestoneIdx)

    if (nextMilestone) {
      const details = {
        ...nextMilestone.details,
        prevMilestoneContent: completedMilestone.details.content,
        prevMilestoneType: completedMilestone.type,
      }
      if ( ((nextMilestone.type === 'checkpoint-review' || nextMilestone.type === 'final-designs') // case # 2
        && completedMilestone.type === 'add-links' ) ||
        ((nextMilestone.type === 'delivery-design' || nextMilestone.type === 'delivery-dev') // case # 4
          && completedMilestone.type !== 'final-fix' ) ) {
        details.metadata = {
          ..._.get(nextMilestone.details, 'metadata', {}),
          waitingForCustomer: true
        }
      }

      updatedTimelineMilestones  = processUpdateMilestone(nextMilestone, { details }, updatedTimelineMilestones).updatedTimelineMilestones
    }

    dispatch({
      type: COMPLETE_PRODUCT_MILESTONE_PENDING,
      meta: { productId, milestoneId }
    })

    const milestones = updatedTimelineMilestones.map(milestone => _.omit(milestone, ['timelineId', 'error', 'isUpdating', 'statusHistory']))
    return dispatch({
      type: BULK_UPDATE_PRODUCT_MILESTONES,
      payload: updateMilestones(timelineId, milestones),
      meta: { productId }
    }).then(() => {
      const milestoneIdx = _.findIndex(updatedTimelineMilestones, { id: milestoneId })
      const isLastMilestone = checkIfLastMilestone(updatedTimelineMilestones, milestoneIdx)
      if (isLastMilestone){
        const phaseIndex = _.findIndex(state.projectState.phases, p => p.products[0].id === productId)
        const phase = state.projectState.phases[phaseIndex]
        dispatch(updatePhase(state.projectState.project.id, phase.id, {status: PHASE_STATUS_COMPLETED}, phaseIndex))
      }

      dispatch({
        type: COMPLETE_PRODUCT_MILESTONE_SUCCESS,
        meta: { productId, milestoneId }
      })

      return true
    }).catch((error) => {
      dispatch({
        type: COMPLETE_PRODUCT_MILESTONE_FAILURE,
        payload: error,
        meta: { productId, milestoneId }
      })
      throw error
    })
  }
}

/**
 * Extends the milestone
 *
 * @param {Number} productId      product id
 * @param {Number} timelineId     timeline id
 * @param {Number} milestoneId    milestone id
 * @param {Number} extendDuration duration to extend in days
 * @param {Object} updatedProps   (optional) milestone properties to update
 */
export function extendProductMilestone(productId, timelineId, milestoneId, extendDuration, updatedProps = {}) {
  return (dispatch, getState) => {
    const timeline = getState().productsTimelines[productId].timeline
    const milestoneIdx = _.findIndex(timeline.milestones, { id: milestoneId })
    const milestone = timeline.milestones[milestoneIdx]

    const updatedTimelineMilestones = processUpdateMilestone(
      milestone,
      {
        ...updatedProps, // optional props to update
        duration: milestone.duration + extendDuration
      },
      timeline.milestones
    ).updatedTimelineMilestones

    dispatch({
      type: EXTEND_PRODUCT_MILESTONE_PENDING,
      meta: { productId, milestoneId }
    })

    const milestones = updatedTimelineMilestones.map(milestone => _.omit(milestone, ['timelineId', 'error', 'isUpdating', 'statusHistory']))
    return dispatch({
      type: BULK_UPDATE_PRODUCT_MILESTONES,
      payload: updateMilestones(timelineId, milestones),
      meta: { productId }
    }).then(() => {
      dispatch({
        type: EXTEND_PRODUCT_MILESTONE_SUCCESS,
        meta: { productId, milestoneId }
      })
    }).catch((error) => {
      dispatch({
        type: EXTEND_PRODUCT_MILESTONE_FAILURE,
        payload: error,
        meta: { productId, milestoneId }
      })
      throw error
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
    const timeline = getState().productsTimelines[productId].timeline
    const milestoneIdx = _.findIndex(timeline.milestones, { id: milestoneId })
    const milestone = timeline.milestones[milestoneIdx]

    let finalFixesMilestone = timeline.milestones[milestoneIdx - 1]

    if (!finalFixesMilestone || finalFixesMilestone.type !== 'final-fix') {
      throw new Error('Cannot find final-fix milestone.')
    }

    let updatedTimelineMilestones = processUpdateMilestone(
      milestone, {
        status: MILESTONE_STATUS.PLANNED,
        details: {
          ...milestone.details,
          metadata: {
            ..._.get(milestone, 'details.metadata', {}),
            waitingForCustomer: false,
          },
          content: {
            ..._.get(milestone, 'details.content', {}),
            isFinalFixesSubmitted: true
          }
        }
      }, timeline.milestones
    ).updatedTimelineMilestones

    finalFixesMilestone = updatedTimelineMilestones[milestoneIdx - 1]

    updatedTimelineMilestones = processUpdateMilestone(
      finalFixesMilestone, {
        status: MILESTONE_STATUS.ACTIVE,
        hidden: false,
        details: {
          ...finalFixesMilestone.details,
          content: {
            ..._.get(finalFixesMilestone, 'details.content', {}),
            finalFixRequests,
          }
        }
      }, updatedTimelineMilestones
    ).updatedTimelineMilestones

    dispatch({
      type: SUBMIT_FINAL_FIXES_REQUEST_PENDING,
      meta: { productId, milestoneId }
    })

    const milestones = updatedTimelineMilestones.map(milestone => _.omit(milestone, ['timelineId', 'error', 'isUpdating', 'statusHistory']))
    return dispatch({
      type: BULK_UPDATE_PRODUCT_MILESTONES,
      payload: updateMilestones(timelineId, milestones),
      meta: {
        productId,
      }
    }).then(() => {
      dispatch({
        type: SUBMIT_FINAL_FIXES_REQUEST_SUCCESS,
        meta: { productId, milestoneId }
      })
    }).catch((error) => {
      dispatch({
        type: SUBMIT_FINAL_FIXES_REQUEST_FAILURE,
        payload: error,
        meta: { productId, milestoneId }
      })
      throw error
    })
  }
}

/**
 * Mark the final-fix milestone as 'completed', and the next milestone(delivery) also 'completed'.
 *
 * @param {Number} productId    product id
 * @param {Number} timelineId   timeline id
 * @param {Number} milestoneId  milestone id
 * @param {Object} updatedProps (optional) milestone properties to update
 */
export function completeFinalFixesMilestone(productId, timelineId, milestoneId, updatedProps = {}) {
  return (dispatch, getState) => {
    const state = getState()
    const timeline = state.productsTimelines[productId].timeline
    const milestoneIdx = _.findIndex(timeline.milestones, { id: milestoneId })
    const milestone = timeline.milestones[milestoneIdx]

    const result = processUpdateMilestone(
      milestone, {
        ...updatedProps, // optional props to update
        status: MILESTONE_STATUS.COMPLETED,
      },
      timeline.milestones
    )
    let updatedTimelineMilestones = result.updatedTimelineMilestones
    const completedMilestone = result.updatedMilestone
    const nextMilestone = getNextNotHiddenMilestone(updatedTimelineMilestones, milestoneIdx)

    if (nextMilestone) {
      updatedTimelineMilestones = processUpdateMilestone(
        nextMilestone, {
          details: {
            ...nextMilestone.details,
            prevMilestoneContent: completedMilestone.details.content,
            prevMilestoneType: completedMilestone.type,
          },
          status: MILESTONE_STATUS.COMPLETED,
        }, updatedTimelineMilestones
      ).updatedTimelineMilestones
    }

    dispatch({
      type: COMPLETE_PRODUCT_MILESTONE_PENDING,
      meta: { productId, milestoneId }
    })

    const milestones = updatedTimelineMilestones.map(milestone => _.omit(milestone, ['timelineId', 'error', 'isUpdating', 'statusHistory']))
    return dispatch({
      type: BULK_UPDATE_PRODUCT_MILESTONES,
      payload: updateMilestones(timelineId, milestones),
      meta: {
        productId,
      }
    }).then(() => {
      const phaseIndex = _.findIndex(state.projectState.phases, p => p.products[0].id === productId)
      const phase = state.projectState.phases[phaseIndex]
      dispatch(updatePhase(state.projectState.project.id, phase.id, {status: PHASE_STATUS_COMPLETED}, phaseIndex))

      dispatch({
        type: COMPLETE_PRODUCT_MILESTONE_SUCCESS,
        meta: { productId, milestoneId }
      })

      return true
    }).catch((error) => {
      dispatch({
        type: COMPLETE_PRODUCT_MILESTONE_FAILURE,
        payload: error,
        meta: { productId, milestoneId }
      })
      throw error
    })
  }
}
