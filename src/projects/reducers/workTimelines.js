import {
  LOAD_WORK_TIMELINE_PENDING,
  LOAD_WORK_TIMELINE_SUCCESS,
  LOAD_WORK_TIMELINE_FAILURE,
  NEW_WORK_TIMELINE_MILESTONE_PENDING,
  NEW_WORK_TIMELINE_MILESTONE_SUCCESS,
  NEW_WORK_TIMELINE_MILESTONE_FAILURE,
  UPDATE_WORK_TIMELINE_MILESTONE_PENDING,
  UPDATE_WORK_TIMELINE_MILESTONE_SUCCESS,
  UPDATE_WORK_TIMELINE_MILESTONE_FAILURE,
  LOAD_WORK_TIMELINE_MILESTONE_PENDING,
  LOAD_WORK_TIMELINE_MILESTONE_SUCCESS,
  LOAD_WORK_TIMELINE_MILESTONE_FAILURE,
  DELETE_WORK_TIMELINE_MILESTONE_PENDING,
  DELETE_WORK_TIMELINE_MILESTONE_SUCCESS,
  DELETE_WORK_TIMELINE_MILESTONE_FAILURE,
  COMPLETE_WORK_TIMELINE_MILESTONE_PENDING,
  COMPLETE_WORK_TIMELINE_MILESTONE_SUCCESS,
  COMPLETE_WORK_TIMELINE_MILESTONE_FAILURE,
  CLEAR_LOADED_PROJECT,
  GET_PROJECTS_SUCCESS,
} from '../../config/constants'
import update from 'react-addons-update'
import {parseErrorObj} from '../../helpers/workstreams'

const initialState = {
  isLoadingMilestoneInfo: false,
  isUpdatingMilestoneInfo: false,
  isUpdatingMilestoneInfoWithProcessId: {},
  isCreatingMilestoneInfo: false,
  isDeletingMilestoneInfo: false,
  /**
   * indicates that milestone is currently in the processes ofr being marked as `completed`
   * this flag is always used together with `isLoadingMilestoneInfo`
   */
  isCompletingMilestone: false,
  timelines: {},
  milestone: null,
}

const updateTimelineByWorkId = (state, workId, updateTimelineQuery) => {
  const timelineStateToUpdate = state.timelines[workId] || {}

  return {
    ...state,
    timelines: {
      ...state.timelines,
      [workId]: update(timelineStateToUpdate, updateTimelineQuery)
    }
  }
}

/**
 * Update updating value by progress id
 * @param {Object} oldState state object
 * @param {Object} changingState update state value
 * @param {Array} progressIds array of progress id
 * @param {Boolean} updating is updating
 */
const updateUpdatingByProgress = (state, changingState, progressIds, updating) => {
  const { isUpdatingMilestoneInfoWithProcessId } = state
  _.forEach(progressIds, (progressId) => {
    const oldValue = isUpdatingMilestoneInfoWithProcessId[progressId]
    isUpdatingMilestoneInfoWithProcessId[progressId] = update(oldValue, { $set: updating })
  })
  changingState.isUpdatingMilestoneInfoWithProcessId = isUpdatingMilestoneInfoWithProcessId
}

const updateTimelineByTemplateId = (state, templateId, updateTimelineQuery) => {
  const workId = _.findKey(state.timelines, { timeline: { id: templateId }})
  const timelineStateToUpdate = state.timelines[workId]

  return {
    ...state,
    timelines: {
      ...state.timelines,
      [workId]: update(timelineStateToUpdate, updateTimelineQuery)
    }
  }
}

export const workTimelines = function (state=initialState, action) {

  switch (action.type) {
  case LOAD_WORK_TIMELINE_PENDING:
    return updateTimelineByWorkId(state, action.meta.workId, {
      isLoading: { $set: true },
      error: { $set: false },
    })

  case LOAD_WORK_TIMELINE_SUCCESS: {
    const timeline = action.payload.timelines[0]

    if (!timeline.milestones) {
      timeline.milestones = []
    }

    return updateTimelineByWorkId(state, action.meta.workId, {
      isLoading: { $set: false },
      error: { $set: false },
      timeline: { $set: timeline },
    })
  }

  case LOAD_WORK_TIMELINE_FAILURE:
    return updateTimelineByWorkId(state, action.meta.workId, {
      isLoading: { $set: false },
      error: { $set: parseErrorObj(action) },
    })

  case NEW_WORK_TIMELINE_MILESTONE_PENDING:
    return Object.assign({}, state, {
      isCreatingMilestoneInfo: true,
      error: false
    })

  case NEW_WORK_TIMELINE_MILESTONE_SUCCESS: {
    const stateWithUpdatedTimeline = updateTimelineByWorkId(state, action.meta.workId, {
      timeline: {
        milestones: { $push: [action.payload.milestone] }
      }
    })

    return Object.assign({}, stateWithUpdatedTimeline, {
      isCreatingMilestoneInfo: false,
      error: false,
      milestone: action.payload.milestone,
    })
  }

  case NEW_WORK_TIMELINE_MILESTONE_FAILURE:
    return Object.assign({}, state, {
      isCreatingMilestoneInfo: false,
      error: parseErrorObj(action)
    })

  case UPDATE_WORK_TIMELINE_MILESTONE_PENDING:
  case COMPLETE_WORK_TIMELINE_MILESTONE_PENDING: {
    const mergeObject = {
      isUpdatingMilestoneInfo: true,
      isCompletingMilestone: action.type === COMPLETE_WORK_TIMELINE_MILESTONE_PENDING ?  true : state.isCompletingMilestone,
      error: false
    }
    if (!_.isNil(action.meta.progressIds)) {
      updateUpdatingByProgress(state, mergeObject, action.meta.progressIds, true)
    }
    return Object.assign({}, state, mergeObject)
  }
  case UPDATE_WORK_TIMELINE_MILESTONE_SUCCESS:
  case COMPLETE_WORK_TIMELINE_MILESTONE_SUCCESS: {
    const timelineStateToUpdate = state.timelines[action.meta.workId]
    let stateWithUpdatedTimeline = state

    if (timelineStateToUpdate) {
      const milestoneIndexToUpdate = _.findIndex(timelineStateToUpdate.timeline.milestones, { id: action.meta.milestoneId })
      stateWithUpdatedTimeline = updateTimelineByWorkId(state, action.meta.workId, {
        timeline: {
          milestones: { $splice: [[milestoneIndexToUpdate, 1, action.payload.milestone]] }
        }
      })
    }

    const mergeObject = {
      isUpdatingMilestoneInfo: false,
      isCompletingMilestone: action.type === COMPLETE_WORK_TIMELINE_MILESTONE_SUCCESS ? false : state.isCompletingMilestone,
      error: false,
      milestone: action.payload.milestone,
    }
    if (!_.isNil(action.meta.progressIds)) {
      updateUpdatingByProgress(state, mergeObject, action.meta.progressIds, false)
    }
    return Object.assign({}, stateWithUpdatedTimeline, mergeObject)
  }

  case UPDATE_WORK_TIMELINE_MILESTONE_FAILURE:
  case COMPLETE_WORK_TIMELINE_MILESTONE_FAILURE: {
    const mergeObject = {
      isUpdatingMilestoneInfo: false,
      isCompletingMilestone: action.type === COMPLETE_WORK_TIMELINE_MILESTONE_FAILURE ? false : state.isCompletingMilestone,
      error: parseErrorObj(action)
    }
    if (!_.isNil(action.meta.progressIds)) {
      updateUpdatingByProgress(state, mergeObject, action.meta.progressIds, false)
    }
    return Object.assign({}, state, mergeObject)
  }

  case LOAD_WORK_TIMELINE_MILESTONE_PENDING:
    return Object.assign({}, state, {
      isLoadingMilestoneInfo: true,
      error: false
    })

  case LOAD_WORK_TIMELINE_MILESTONE_SUCCESS: {
    // we reload milestone before editing, actually this reducer is same to UPDATE_WORK_TIMELINE_MILESTONE_SUCCESS
    // the only difference is that this reducer uses `isLoadingMilestoneInfo` instead of `isUpdatingMilestoneInfo`
    const workId = _.findKey(state.timelines, { timeline: { id: action.meta.timelineId }})
    const timelineStateToUpdate = state.timelines[workId]
    let stateWithUpdatedTimeline = state

    if (timelineStateToUpdate) {
      const milestoneIndexToUpdate = _.findIndex(timelineStateToUpdate.timeline.milestones, { id: action.meta.milestoneId })
      stateWithUpdatedTimeline = updateTimelineByTemplateId(state, action.meta.timelineId, {
        timeline: {
          milestones: { $splice: [[milestoneIndexToUpdate, 1, action.payload.milestone]] }
        }
      })
    }

    return Object.assign({}, stateWithUpdatedTimeline, {
      isLoadingMilestoneInfo: false,
      error: false,
      milestone: action.payload.milestone,
    })
  }

  case LOAD_WORK_TIMELINE_MILESTONE_FAILURE:
    return Object.assign({}, state, {
      isLoadingMilestoneInfo: false,
      error: parseErrorObj(action)
    })

  case DELETE_WORK_TIMELINE_MILESTONE_PENDING:
    return Object.assign({}, state, {
      isDeletingMilestoneInfo: true,
      error: false
    })

  case DELETE_WORK_TIMELINE_MILESTONE_SUCCESS: {
    const timelineStateToUpdate = state.timelines[action.meta.workId]
    const milestoneIndexToDelete = _.findIndex(timelineStateToUpdate.timeline.milestones, { id: action.meta.milestoneId })
    const stateWithUpdatedTimeline = updateTimelineByWorkId(state, action.meta.workId, {
      timeline: {
        milestones: { $splice: [[milestoneIndexToDelete, 1]] }
      }
    })

    return Object.assign({}, stateWithUpdatedTimeline, {
      isDeletingMilestoneInfo: false,
      error: false,
      milestone: null,
    })
  }

  case DELETE_WORK_TIMELINE_MILESTONE_FAILURE:
    return Object.assign({}, state, {
      isDeletingMilestoneInfo: false,
      error: parseErrorObj(action)
    })

  // when we clear the project we have to put dashboard state to the initial state
  // because the code relies on the initial state
  // for example spinnerWhileLoading in ProjectDerail.jsx expects `isLoading` to be true
  // to prevent components which require dashboard data from rendering
  case CLEAR_LOADED_PROJECT:
  case GET_PROJECTS_SUCCESS:
    return Object.assign({}, state, initialState)

  default:
    return state
  }
}
