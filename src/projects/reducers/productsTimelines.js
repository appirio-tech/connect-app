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
  COMPLETE_PRODUCT_MILESTONE_PENDING,
  COMPLETE_PRODUCT_MILESTONE_SUCCESS,
  COMPLETE_PRODUCT_MILESTONE_FAILURE,

  MILESTONE_STATUS,
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

function updateMilestone(state, productId, milestoneId, updateMilestone, shouldReplace = false) {
  const milestoneIdx = _.findIndex(state[productId].timeline.milestones, { id: milestoneId })

  const updatedMilestone = shouldReplace
    ? updateMilestone
    : update(state[productId].timeline.milestones[milestoneIdx], updateMilestone)

  return update(state, {
    [productId]: {
      timeline: {
        milestones: { $splice: [[ milestoneIdx, 1, updatedMilestone ]] }
      }
    }
  })
}

export const productsTimelines = (state=initialState, action) => {
  const { type, payload, meta } = action

  switch (type) {

  case LOAD_PRODUCT_TIMELINE_WITH_MILESTONES_PENDING:
    return update(state, {
      [meta.productId]: {
        $set: {
          isLoading: true,
          error: false,
        }
      }
    })

  case LOAD_PRODUCT_TIMELINE_WITH_MILESTONES_SUCCESS:
    return update(state, {
      [meta.productId]: {
        isLoading: { $set: false },
        timeline: { $set: payload },
        error: { $set: false },
      }
    })

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

  case COMPLETE_PRODUCT_MILESTONE_PENDING:
    return updateMilestone(state, meta.productId, meta.milestoneId, {
      isUpdating: { $set: true },
      error: { $set: false }
    })

  case COMPLETE_PRODUCT_MILESTONE_SUCCESS: {
    let updatedState = updateMilestone(state, meta.productId, meta.milestoneId, {
      status: { $set: MILESTONE_STATUS.COMPLETED },
      isUpdating: { $set: false },
      error: { $set: false }
    })

    if (meta.nextMilestoneId) {
      updatedState = updateMilestone(updatedState, meta.productId, meta.nextMilestoneId, {
        status: { $set: MILESTONE_STATUS.ACTIVE },
      })
    }

    return updatedState
  }

  case COMPLETE_PRODUCT_MILESTONE_FAILURE:
    return updateMilestone(state, meta.productId, meta.milestoneId, {
      isUpdating: { $set: false },
      error: { $set: false }
    })

  default:
    return state
  }
}
