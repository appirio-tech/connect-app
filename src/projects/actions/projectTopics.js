import _ from 'lodash'
import { getTopics, getTopicPosts, createTopic } from '../../api/messages'
import { LOAD_PROJECT_TOPICS, CREATE_PROJECT_TOPIC, LOAD_TOPIC_POSTS } from '../../config/constants'

/**
 * Load all project data to paint the dashboard
 * @param  {integer} projectId project identifier
 */


export function loadDashboardFeeds(projectId) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT_TOPICS,
      payload: getTopics({ reference : 'project', referenceId: projectId })
    })
  }
}

export function createProjectTopic(projectId, topic) {
  const updatedTopic = _.assign({ reference: 'project', referenceId: projectId.toString()}, topic)
  return (dispatch) => {
    return dispatch({
      type: CREATE_PROJECT_TOPIC,
      payload: createTopic(updatedTopic)
    })
  }
}

export function loadFeedComments(feedId, fromIndex) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_TOPIC_POSTS,
      payload: getTopicPosts(feedId)
    })
  }
}