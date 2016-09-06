
import {
  LOAD_PROJECT_TOPICS_PENDING,
  LOAD_PROJECT_TOPICS_SUCCESS,
  LOAD_PROJECT_TOPICS_FAILURE,
  CREATE_PROJECT_TOPIC_PENDING,
  CREATE_PROJECT_TOPIC_SUCCESS,
  CREATE_PROJECT_TOPIC_FAILURE
} from '../../config/constants'
import update from 'react-addons-update'

const initialState = {
  isLoading: true,
  isCreating: false,
  error: false,
  topics: [],
  totalTopics: 0
}

export const projectTopics = function (state=initialState, action) {

  switch (action.type) {
  case LOAD_PROJECT_TOPICS_PENDING:
    return Object.assign({}, state, {
      isLoading: true,
      error: false
    })
  case LOAD_PROJECT_TOPICS_SUCCESS:
    return Object.assign({}, state, {
      isLoading: false,
      error: true,
      topics: action.payload.topics,
      totalTopics: action.payload.totalCount
    })

  case LOAD_PROJECT_TOPICS_FAILURE:
    return Object.assign({}, state, {
      isLoading: false,
      error: true
    })
  case CREATE_PROJECT_TOPIC_PENDING:
    return Object.assign({}, state, {
      isCreating: true,
      error: false
    })
  case CREATE_PROJECT_TOPIC_SUCCESS:
    return update (state, {
      isCreating: { $set : false },
      error: { $set : false },
      topics: { $splice: [[0, 0, action.payload]] }
    })
  case CREATE_PROJECT_TOPIC_FAILURE:
    return Object.assign({}, state, {
      isCreating: false,
      error: false
    })

  default:
    return state
  }
}
