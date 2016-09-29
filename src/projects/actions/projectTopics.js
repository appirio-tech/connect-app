import _ from 'lodash'
import { getTopics, getTopicPosts, createTopic, addTopicPost } from '../../api/messages'
import { 
  LOAD_PROJECT_FEEDS,
  CREATE_PROJECT_FEED,
  LOAD_PROJECT_FEED_COMMENTS,
  CREATE_PROJECT_FEED_COMMENT,
  LOAD_PROJECT_FEEDS_MEMBERS
} from '../../config/constants'
import { loadMembers } from '../../actions/members'

/**
 * Load all project data to paint the dashboard
 * @param  {integer} projectId project identifier
 */


export function loadDashboardFeeds(projectId) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT_FEEDS_MEMBERS,
      payload: getDashboardFeedsWithMembers(dispatch, projectId)
    })
  }
}

// ignore action param
/*eslint-disable no-unused-vars */
const getDashboardFeedsWithMembers = (dispatch, projectId) => {
  return new Promise((resolve, reject) => {
    return dispatch({
      type: LOAD_PROJECT_FEEDS,
      payload: getTopics({ reference : 'project', referenceId: projectId })
    })
    .then(({ value, action }) => {
      let userIds = []
      userIds = _.union(userIds, _.map(value.topics, 'userId'))
      _.forEach(value.topics, topic => {
        userIds = _.union(userIds, _.map(topic.posts, 'userId'))
      })
      // this is to remove any nulls from the list (dev had some bad data)
      _.remove(userIds, i => !i || i === 'system')
      // return if there are no userIds to retrieve, empty result set
      if (!userIds.length)
        resolve(true)
      return dispatch(loadMembers(userIds))
        .then(() => resolve(value))
        .catch(err => reject(err))
    })
    .catch(err => reject(err))
  })
}
/*eslint-enable*/

export function createProjectTopic(projectId, topic) {
  const updatedTopic = _.assign({
    reference: 'project',
    referenceId: projectId.toString()
  }, topic)
  return (dispatch) => {
    return dispatch({
      type: CREATE_PROJECT_FEED,
      payload: createTopic(updatedTopic),
      meta: {
        tag: topic.tag
      }
    })
  }
}

export function loadFeedComments(feedId, tag, fromIndex) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT_FEED_COMMENTS,
      payload: getTopicPosts(feedId, fromIndex),
      meta: {
        topicId: feedId,
        tag
      }
    })
  }
}

export function addFeedComment(feedId, tag, comment) {
  return (dispatch) => {
    return dispatch({
      type: CREATE_PROJECT_FEED_COMMENT,
      payload: addTopicPost(feedId, comment),
      meta: { feedId, tag }
    })
  }
}