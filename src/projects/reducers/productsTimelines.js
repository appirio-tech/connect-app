/**
 * Reducer for projectState.timelines
 */
import _ from 'lodash'
import {
  LOAD_PRODUCT_TIMELINE_WITH_MILESTONES_PENDING,
  LOAD_PRODUCT_TIMELINE_WITH_MILESTONES_SUCCESS,
  LOAD_PRODUCT_TIMELINE_WITH_MILESTONES_FAILURE,
  UPDATE_PRODUCT_MILESTONE_PENDING,
  UPDATE_PRODUCT_MILESTONE_SUCCESS,
  UPDATE_PRODUCT_MILESTONE_FAILURE,
  UPDATE_PRODUCT_TIMELINE_PENDING,
  UPDATE_PRODUCT_TIMELINE_SUCCESS,
  UPDATE_PRODUCT_TIMELINE_FAILURE,
  COMPLETE_PRODUCT_MILESTONE_PENDING,
  COMPLETE_PRODUCT_MILESTONE_SUCCESS,
  COMPLETE_PRODUCT_MILESTONE_FAILURE,
  EXTEND_PRODUCT_MILESTONE_PENDING,
  EXTEND_PRODUCT_MILESTONE_SUCCESS,
  EXTEND_PRODUCT_MILESTONE_FAILURE,
  SUBMIT_FINAL_FIXES_REQUEST_PENDING,
  SUBMIT_FINAL_FIXES_REQUEST_SUCCESS,
  SUBMIT_FINAL_FIXES_REQUEST_FAILURE,
  CREATE_PROJECT_STAGE_SUCCESS,
} from '../../config/constants'
import update from 'react-addons-update'

const initialState = {
  /*
    State has product.id as keys and an object as values in the next shape:

    [product.id]: {
      isLoading: <Boolean>,      // is loading product timeline
      error: <Boolean>|<String>, // if has error during loading product timeline
      timeline: {
        ...
        milestones: [
          {
            ...
            isUpdating: <Boolean>,    // is updating this milestone
            error: <Boolean>|<String>, // if has error during updating this milestone
            ...
          }
        ]
        ...
      },
    },
  */
}

/**
 * Update a particular milestone in the state
 *
 * @param {Object}  state          state
 * @param {Number}  productId      product id
 * @param {Number}  milestoneId    milestone Id
 * @param {Object}  dirtyMilestone milestone update rule or new milestone if shouldReplace is set
 * @param {Boolean} shouldReplace  replaces milestone instead of update if true
 *
 * @returns {Object} state
 */
function updateMilestone(state, productId, milestoneId, dirtyMilestone, shouldReplace = false) {
  if (!state[productId].timeline) return state
  const milestoneIdx = _.findIndex(state[productId].timeline.milestones, { id: milestoneId })

  const updatedMilestone = shouldReplace
    ? dirtyMilestone
    : update(state[productId].timeline.milestones[milestoneIdx], dirtyMilestone)

  return update(state, {
    [productId]: {
      timeline: {
        milestones: { $splice: [[ milestoneIdx, 1, updatedMilestone ]] }
      }
    }
  })
}

/**
 * Update state's productsTimeline property
 *
 * @param {Object} state The state
 * @param {Number} productId The product id
 * @param {Object} updateTimeline The product timeline update
 * @param {Boolean} shouldReplace The product timeline replacement flag
 *
 * @returns {Object} The state
 */
function updateTimeline(state, productId, updateTimeline, shouldReplace = false) {
  const updatedTimeline = shouldReplace
    ? updateTimeline
    : update(state[productId].timeline, updateTimeline)

  return update(state, {
    [productId]: {
      timeline: {$set: updatedTimeline}
    }
  })
}

export const productsTimelines = (state=initialState, action) => {
  const { type, payload, meta } = action

  switch (type) {

  case LOAD_PRODUCT_TIMELINE_WITH_MILESTONES_PENDING:
    // if already have previously loaded timeline, just update some props
    return state[meta.productId] ? (
      update(state, {
        [meta.productId]: {
          isLoading: { $set: true },
          error: { $set: false },
        },
      })

    // if don't have already loaded timeline, create an object for it
    ) : (
      update(state, {
        [meta.productId]: {
          $set: {
            isLoading: true,
            error: false,
          },
        },
      })
    )


  case CREATE_PROJECT_STAGE_SUCCESS: {
    const timeline = payload.timeline
    const product = payload.product

    // if there is timeline for the product
    if (timeline) {
      // sort milestones by order as server doesn't do it
      timeline.milestones = _.sortBy(timeline.milestones, 'order')
    }

    if (timeline && product) {
      return update(state, {
        [product.id]: {
          $set: {
            isLoading: false,
            timeline,
            error: false
          }
        }
      })
    }
    return state
  }

  case LOAD_PRODUCT_TIMELINE_WITH_MILESTONES_SUCCESS: {
    const timeline = payload

    // if there is timeline for the product
    if (timeline) {
      // sort milestones by order as server doesn't do it
      timeline.milestones = _.sortBy(timeline.milestones, 'order')
    }

    return update(state, {
      [meta.productId]: {
        isLoading: { $set: false },
        timeline: { $set: timeline },
        error: { $set: false },
      }
    })
  }

  // when we create a product we also create a timeline and have to add it to the store
  case CREATE_PROJECT_STAGE_SUCCESS: {
    const timeline = payload.timeline
    const productId = payload.product.id

    // if there is timeline for the product
    if (timeline) {
      // sort milestones by order as server doesn't do it
      timeline.milestones = _.sortBy(timeline.milestones, 'order')
    }

    return update(state, {
      [productId]: {
        $set: {
          isLoading: false,
          timeline,
          error: false,
        },
      },
    })
  }

  case LOAD_PRODUCT_TIMELINE_WITH_MILESTONES_FAILURE:
    return update(state, {
      [meta.productId]: {
        isLoading: { $set: false },
        error: { $set: true },
      }
    })

  case UPDATE_PRODUCT_MILESTONE_PENDING:
    return updateMilestone(state, meta.productId, meta.milestoneId, {
      isUpdating: { $set: true },
      error: { $set: false }
    })

  case UPDATE_PRODUCT_MILESTONE_SUCCESS:
    return updateMilestone(state, meta.productId, meta.milestoneId, payload, true)

  case UPDATE_PRODUCT_MILESTONE_FAILURE:
    return updateMilestone(state, meta.productId, meta.milestoneId, {
      isUpdating: { $set: false },
      error: { $set: false }
    })

  case UPDATE_PRODUCT_TIMELINE_PENDING:
    return updateTimeline(state, meta.productId, {
      isUpdating: { $set: true },
      error: { $set: false }
    })

  case UPDATE_PRODUCT_TIMELINE_SUCCESS:
    return updateTimeline(state, meta.productId, payload, true)

  case UPDATE_PRODUCT_TIMELINE_FAILURE:
    return updateTimeline(state, meta.productId, {
      isUpdating: { $set: false },
      error: { $set: false }
    })

  case COMPLETE_PRODUCT_MILESTONE_PENDING:
  case EXTEND_PRODUCT_MILESTONE_PENDING:
  case SUBMIT_FINAL_FIXES_REQUEST_PENDING:
    return updateMilestone(state, meta.productId, meta.milestoneId, {
      isUpdating: { $set: true },
      error: { $set: false }
    })

  case COMPLETE_PRODUCT_MILESTONE_SUCCESS:
  case EXTEND_PRODUCT_MILESTONE_SUCCESS:
  case SUBMIT_FINAL_FIXES_REQUEST_SUCCESS: {
    let updatedState = updateMilestone(state, meta.productId, meta.milestoneId, payload[0], true)

    if (meta.nextMilestoneId) {
      updatedState = updateMilestone(updatedState, meta.productId, meta.nextMilestoneId, payload[1], true)
    }

    return updatedState
  }

  case COMPLETE_PRODUCT_MILESTONE_FAILURE:
  case EXTEND_PRODUCT_MILESTONE_FAILURE:
  case SUBMIT_FINAL_FIXES_REQUEST_FAILURE:
    return updateMilestone(state, meta.productId, meta.milestoneId, {
      isUpdating: { $set: false },
      error: { $set: false }
    })

  default:
    return state
  }
}
