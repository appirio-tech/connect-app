import _ from 'lodash'
import {
  LOAD_PROJECT_TOPICS_PENDING,
  LOAD_PROJECT_TOPICS_SUCCESS,
  LOAD_PROJECT_TOPICS_FAILURE,
  CREATE_PROJECT_TOPIC_PENDING,
  CREATE_PROJECT_TOPIC_SUCCESS,
  CREATE_PROJECT_TOPIC_FAILURE,
  LOAD_TOPIC_POSTS_PENDING,
  LOAD_TOPIC_POSTS_SUCCESS,
  LOAD_TOPIC_POSTS_FAILURE
} from '../../config/constants'
import update from 'react-addons-update'

const initialState = {
  isLoading: true,
  isCreating: false,
  isLoadingTopicPosts: {},
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
  case LOAD_TOPIC_POSTS_PENDING:
    return state
  case LOAD_TOPIC_POSTS_SUCCESS:
    const payload = action.payload
    const topicId = payload.topicId
    // find topic index from the state
    const topicIndex = _.findIndex(state.topics, topic => topic.id === topicId)
    // if we find the topic
    if (topicIndex) {
      const topic = state.topics[topicIndex]
      // number of posts those would be rendered after this state update
      const noOfRenderedPosts = topic.posts.length + payload.posts.length
      // updates topic, pushes the new posts into posts array of the topic
      const updatedTopic = update(topic, {
        hasMoreComments: { $set : payload.totalCount > noOfRenderedPosts },
        totalComments: { $set : payload.totalCount },
        posts: { $push : payload.posts }
      })
      // update the state
      return update (state, {
        topics: { $splice: [[topicIndex, 1, updatedTopic]] }
      })
    }
  // case LOAD_TOPIC_POSTS_FAILURE:

  default:
    return state
  }
}
