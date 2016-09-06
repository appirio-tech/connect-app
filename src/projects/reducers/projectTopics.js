
import {
  LOAD_PROJECT_TOPICS_PENDING,
  LOAD_PROJECT_TOPICS_SUCCESS,
  LOAD_PROJECT_TOPICS_FAILURE
} from '../../config/constants'

const initialState = {
  isLoading: true,
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

  default:
    return state
  }
}
