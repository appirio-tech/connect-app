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
  CLEAR_LOADED_PROJECT,
  GET_PROJECTS_SUCCESS,
} from '../../config/constants'

import {parseErrorObj} from '../../helpers/workstreams'

const initialState = {
  isLoading: false,
  isLoadingMilestoneInfo: false,
  isUpdatingMilestoneInfo: false,
  isCreatingMilestoneInfo: false,
  isDeletingMilestoneInfo: false,
  error: false,
  timelines: [], // timelines are pushed directly into it hence need to declare first
  workId: null,
  milestone: null,
}

export const workTimelines = function (state=initialState, action) {

  switch (action.type) {
  case LOAD_WORK_TIMELINE_PENDING:
    return Object.assign({}, state, {
      isLoading: true,
      error: false
    })
  case LOAD_WORK_TIMELINE_SUCCESS:
    for(const timeline of action.payload.timelines) {
      if (!timeline.milestones) {
        timeline.milestones = []
      }
    }
    return Object.assign({}, state, {
      isLoading: false,
      error: false,
      timelines: action.payload.timelines,
      workId: action.payload.workId
    })
  case LOAD_WORK_TIMELINE_FAILURE:
    return Object.assign({}, state, {
      isLoading: false,
      error: parseErrorObj(action)
    })
  case NEW_WORK_TIMELINE_MILESTONE_PENDING:
    return Object.assign({}, state, {
      isCreatingMilestoneInfo: true,
      error: false
    })
  case NEW_WORK_TIMELINE_MILESTONE_SUCCESS: {
    const { timelines } = state
    const timelineIndex = _.findIndex(timelines, timeline => (timeline.id === action.payload.timelineId))
    if (timelineIndex >= 0) {
      timelines[timelineIndex].milestones.push(action.payload.milestone)
    }
    return Object.assign({}, state, {
      isCreatingMilestoneInfo: false,
      error: false,
      milestone: action.payload.milestone,
      timelines
    })
  }
  case NEW_WORK_TIMELINE_MILESTONE_FAILURE:
    return Object.assign({}, state, {
      isCreatingMilestoneInfo: false,
      error: parseErrorObj(action)
    })
  case UPDATE_WORK_TIMELINE_MILESTONE_PENDING:
    return Object.assign({}, state, {
      isUpdatingMilestoneInfo: true,
      error: false
    })
  case UPDATE_WORK_TIMELINE_MILESTONE_SUCCESS: {
    return Object.assign({}, state, {
      isUpdatingMilestoneInfo: false,
      error: false,
      milestone: action.payload.milestone,
      timelines: action.payload.timelines,
    })
  }
  case UPDATE_WORK_TIMELINE_MILESTONE_FAILURE:
    return Object.assign({}, state, {
      isUpdatingMilestoneInfo: false,
      error: parseErrorObj(action)
    })
  case LOAD_WORK_TIMELINE_MILESTONE_PENDING:
    return Object.assign({}, state, {
      isLoadingMilestoneInfo: true,
      error: false
    })
  case LOAD_WORK_TIMELINE_MILESTONE_SUCCESS: {
    return Object.assign({}, state, {
      isLoadingMilestoneInfo: false,
      error: false,
      milestone: action.payload
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
    return Object.assign({}, state, {
      isDeletingMilestoneInfo: false,
      error: false,
      milestone: null,
      timelines: action.payload.timelines,
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
