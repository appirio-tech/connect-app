import _ from 'lodash'
import { getTopics, getTopicPosts, createTopic, addTopicPost } from '../../api/messages'
import { 
  LOAD_PROJECT_FEEDS,
  CREATE_PROJECT_FEED,
  LOAD_PROJECT_FEED_COMMENTS,
  CREATE_PROJECT_FEED_COMMENT
} from '../../config/constants'

/**
 * Load all project data to paint the dashboard
 * @param  {integer} projectId project identifier
 */


export function loadDashboardFeeds(projectId) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT_FEEDS,
      payload: getTopics({ reference : 'project', referenceId: projectId })
    })
  }
}

export function createProjectTopic(projectId, topic) {
  const updatedTopic = _.assign({
    reference: 'project',
    referenceId: projectId.toString()
  }, topic)
  return (dispatch) => {
    return dispatch({
      type: CREATE_PROJECT_FEED,
      payload: createTopic(updatedTopic)
    })
  }
}

export function loadFeedComments(feedId, fromIndex) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT_FEED_COMMENTS,
      payload: getTopicPosts(feedId, fromIndex)
    })
  }
}

export function addFeedComment(feedId, comment) {
  // const updatedTopic = _.assign({ reference: 'project', referenceId: projectId.toString()}, topic)
  return (dispatch) => {
    return dispatch({
      type: CREATE_PROJECT_FEED_COMMENT,
      payload: addTopicPost(feedId, comment)
    })
  }
}