import update from 'react-addons-update'

import {
  LOAD_WORK_INFO_PENDING,
  LOAD_WORK_INFO_SUCCESS,
  LOAD_WORK_INFO_FAILURE,
  LOAD_WORK_ITEM_PENDING,
  LOAD_WORK_ITEM_SUCCESS,
  LOAD_WORK_ITEM_FAILURE,
  UPDATE_WORK_INFO_PENDING,
  UPDATE_WORK_INFO_SUCCESS,
  UPDATE_WORK_INFO_FAILURE,
  DELETE_WORK_INFO_PENDING,
  DELETE_WORK_INFO_SUCCESS,
  DELETE_WORK_INFO_FAILURE,
  NEW_WORK_INFO_PENDING,
  NEW_WORK_INFO_SUCCESS,
  NEW_WORK_INFO_FAILURE,
  NEW_WORK_ITEM_PENDING,
  NEW_WORK_ITEM_SUCCESS,
  NEW_WORK_ITEM_FAILURE,
  DELETE_WORK_ITEM_PENDING,
  DELETE_WORK_ITEM_SUCCESS,
  DELETE_WORK_ITEM_FAILURE,
  DELETE_WORK_ITEM_START_SUCCESS,
  LOAD_CHALLENGES_PENDING,
  LOAD_CHALLENGES_SUCCESS,
  LOAD_CHALLENGES_FAILURE,
  LOAD_CHALLENGES_START_SUCCESS,
  LOAD_CHALLENGES_WORK_ITEM_SUCCESS,
  CLEAR_LOADED_PROJECT,
  GET_PROJECTS_SUCCESS,
} from '../../config/constants'

import {parseErrorObj} from '../../helpers/workstreams'

const initialState = {
  isLoading: false,
  isLoadingChallenge: false,
  isLoadingWorkItem: false,
  isCreatingWorkItem: false,
  errorWorkItem: false,
  isUpdating: false,
  isUpdatingWithProgressId: {},
  isDeleting: false,
  isCreating: false,
  error: false,
  work: {}, // work are pushed directly into it hence need to declare first
  challenges: [], // challenge list are pushed directly into it hence need to declare first
  challengeMetadata: {},  // challenge metadata are pushed directly into it hence need to declare first
  workitems: null,
  workItemsIsDeleting: {}
}

/**
 * Update updating value by progress id
 * @param {Object} oldState state object
 * @param {Object} changingState update state value
 * @param {Array} progressIds array of progress id
 * @param {Boolean} updating is updating
 */
const updateUpdatingByProgress = (state, changingState, progressIds, updating) => {
  const { isUpdatingWithProgressId } = state
  const setQuery = {}
  _.forEach(progressIds, (progressId) => {
    setQuery[progressId] = { $set: updating }
  })
  changingState.isUpdatingWithProgressId = update(isUpdatingWithProgressId, setQuery)
}

export const works = function (state=initialState, action) {

  switch (action.type) {
  case LOAD_WORK_INFO_PENDING:
    return Object.assign({}, state, {
      isLoading: true,
      error: false
    })
  case LOAD_WORK_INFO_SUCCESS:
    return Object.assign({}, state, {
      isLoading: false,
      error: false,
      work: action.payload,
      workitems: null,
      workItemsIsDeleting: {}
    })
  case LOAD_WORK_INFO_FAILURE:
    return Object.assign({}, state, {
      isLoading: false,
      error: parseErrorObj(action)
    })
  case LOAD_WORK_ITEM_PENDING:
    return Object.assign({}, state, {
      isLoadingWorkItem: true,
      errorWorkItem: false
    })
  case LOAD_WORK_ITEM_SUCCESS:
    return Object.assign({}, state, {
      isLoadingWorkItem: false,
      errorWorkItem: false,
      workitems: action.payload,
    })
  case LOAD_WORK_ITEM_FAILURE:
    return Object.assign({}, state, {
      isLoadingWorkItem: false,
      errorWorkItem: parseErrorObj(action)
    })
  case UPDATE_WORK_INFO_PENDING: {
    const mergeObject = {
      error: false
    }
    if (!_.isNil(action.meta.progressIds)) {
      updateUpdatingByProgress(state, mergeObject, action.meta.progressIds, true)
    } else {
      mergeObject.isUpdating = true
    }
    return Object.assign({}, state, mergeObject)
  }
  case UPDATE_WORK_INFO_SUCCESS: {
    const mergeObject = {
      error: false,
      work: action.payload
    }
    if (!_.isNil(action.meta.progressIds)) {
      updateUpdatingByProgress(state, mergeObject, action.meta.progressIds, false)
    } else {
      mergeObject.isUpdating = false
    }
    return Object.assign({}, state, mergeObject)
  }
  case UPDATE_WORK_INFO_FAILURE: {
    const mergeObject = {
      error: parseErrorObj(action)
    }
    if (!_.isNil(action.meta.progressIds)) {
      updateUpdatingByProgress(state, mergeObject, action.meta.progressIds, false)
    } else {
      mergeObject.isUpdating = false
    }
    return Object.assign({}, state, mergeObject)
  }
  case DELETE_WORK_INFO_PENDING:
    return Object.assign({}, state, {
      isDeleting: true,
      error: false
    })
  case DELETE_WORK_INFO_SUCCESS:
    return Object.assign({}, state, {
      isDeleting: false,
      error: false,
      work: {}
    })
  case DELETE_WORK_INFO_FAILURE:
    return Object.assign({}, state, {
      isDeleting: false,
      error: parseErrorObj(action)
    })
  case NEW_WORK_INFO_PENDING:
    return Object.assign({}, state, {
      isCreating: true,
      error: false
    })
  case NEW_WORK_INFO_SUCCESS:
    return Object.assign({}, state, {
      isCreating: false,
      error: false,
      work: action.payload
    })
  case NEW_WORK_INFO_FAILURE:
    return Object.assign({}, state, {
      isCreating: false,
      error: parseErrorObj(action)
    })
  case LOAD_CHALLENGES_PENDING:
    return Object.assign({}, state, {
      isLoadingChallenge: true,
      error: false
    })
  case LOAD_CHALLENGES_SUCCESS: {
    const { challenges } = state
    return Object.assign({}, state, {
      isLoadingChallenge: false,
      error: false,
      challenges: challenges.concat(action.payload.challenges),
      challengeMetadata: action.payload.metadata,
    })
  }
  case LOAD_CHALLENGES_FAILURE:
    return Object.assign({}, state, {
      isLoadingChallenge: false,
      error: parseErrorObj(action)
    })
  case LOAD_CHALLENGES_START_SUCCESS:
    return Object.assign({}, state, {
      isLoadingChallenge: true,
      challenges: []
    })
  case NEW_WORK_ITEM_PENDING:
    return Object.assign({}, state, {
      isCreatingWorkItem: true,
      errorWorkItem: false
    })
  case NEW_WORK_ITEM_SUCCESS: {
    const { workitems } = state
    const newWorkitems = action.payload
    return Object.assign({}, state, {
      isCreatingWorkItem: false,
      errorWorkItem: false,
      workitems: workitems ? workitems.concat(newWorkitems) : newWorkitems,
    })
  }
  case NEW_WORK_ITEM_FAILURE:
    return Object.assign({}, state, {
      isCreatingWorkItem: false,
      errorWorkItem: parseErrorObj(action)
    })
  case LOAD_CHALLENGES_WORK_ITEM_SUCCESS: {
    const { workitems } = state
    const challenges = action.payload.challenges
    for(const workitem of workitems) {
      const challengeId = _.get(workitem, 'details.challengeId', 0)
      workitem.challenge = _.find(challenges, { id: challengeId })
    }
    return Object.assign({}, state, {
      workitems: _.cloneDeep(workitems)
    })
  }
  case DELETE_WORK_ITEM_PENDING:
    return Object.assign({}, state, {
      errorWorkItem: false
    })
  case DELETE_WORK_ITEM_SUCCESS: {
    const { workitems, workItemsIsDeleting } = state
    const workItemIndex = _.findIndex(workitems, workitem => (workitem.id === action.payload))
    if (workItemIndex >= 0) {
      _.remove(workitems, {
        id: action.payload
      })
    }
    workItemsIsDeleting[action.payload] = false
    return Object.assign({}, state, {
      errorWorkItem: false,
      workitems,
      workItemsIsDeleting
    })
  }
  case DELETE_WORK_ITEM_START_SUCCESS: {
    const { workItemsIsDeleting } = state
    workItemsIsDeleting[action.payload] = true
    return Object.assign({}, state, {
      workItemsIsDeleting
    })
  }
  case DELETE_WORK_ITEM_FAILURE: {
    const { workItemsIsDeleting } = state
    const workitemId = _.get(action, 'payload.workitemId', -1)
    if (workItemsIsDeleting[workitemId]) {
      delete workItemsIsDeleting[workitemId]
    }
    return Object.assign({}, state, {
      errorWorkItem: parseErrorObj(action),
      workItemsIsDeleting
    })
  }

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
