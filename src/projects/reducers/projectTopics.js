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
  LOAD_TOPIC_POSTS_FAILURE,
  CREATE_PROJECT_TOPIC_POST_PENDING,
  CREATE_PROJECT_TOPIC_POST_SUCCESS,
  CREATE_PROJECT_TOPIC_POST_FAILURE
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
  const payload = action.payload

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
      topics: payload.topics,
      totalTopics: payload.totalCount
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
    payload.posts = []
    return update (state, {
      isCreating: { $set : false },
      error: { $set : false },
      topics: { $splice: [[0, 0, payload]] }
    })
  case CREATE_PROJECT_TOPIC_FAILURE:
    return Object.assign({}, state, {
      isCreating: false,
      error: false
    })
  case LOAD_TOPIC_POSTS_PENDING:
    return state
  case LOAD_TOPIC_POSTS_SUCCESS: {
    const topicId = payload.topicId
    // find topic index from the state
    const topicIndex = _.findIndex(state.topics, topic => topic.id === topicId)
    // if we find the topic
    if (topicIndex >= 0) {
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
    break
  }
  case LOAD_TOPIC_POSTS_FAILURE:
    return state
  case CREATE_PROJECT_TOPIC_POST_PENDING:
    return state
  case CREATE_PROJECT_TOPIC_POST_SUCCESS: {
    const topicId = payload.topicId
    const comment = payload.comment
    // find topic index from the state
    const topicIndex = _.findIndex(state.topics, topic => topic.id === topicId)
    if (topicIndex >= 0) {
      const topic = state.topics[topicIndex]
      const totalComments = topic.totalComments + 1
      const updatedTopic = update (topic, {
        // no need to update hasMoreComments, it should maintain its prev value
        totalComments: { $set : totalComments },
        posts: { $push : [ comment ] }
      })
      // update the state
      return update (state, {
        topics: { $splice: [[topicIndex, 1, updatedTopic]] }
      })
    }
    break
  }
  case CREATE_PROJECT_TOPIC_POST_FAILURE:
    return state

  default:
    return state
  }
}
