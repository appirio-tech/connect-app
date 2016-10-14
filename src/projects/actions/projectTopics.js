import _ from 'lodash'
import { getTopics, getTopicPosts, createTopic, addTopicPost } from '../../api/messages'
import {
  PROJECT_FEED_TYPE_PRIMARY,
  PROJECT_FEED_TYPE_MESSAGES,
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
  const tag = PROJECT_FEED_TYPE_PRIMARY
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT_FEEDS_MEMBERS,
      payload: getProjectTopicsWithMember(dispatch, projectId, tag),
      meta: { tag, projectId }
    })
  }
}

export function laodProjectMessages(projectId) {
  const tag = PROJECT_FEED_TYPE_MESSAGES
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT_FEEDS_MEMBERS,
      payload: getProjectTopicsWithMember(dispatch, projectId, tag),
      meta: { tag, projectId }
    })
  }
}

// ignore action param
/*eslint-disable no-unused-vars */

const getTopicsWithComments = (projectId, tag) => {
  return getTopics({ reference : 'project', referenceId: projectId, tag })
    .then(({topics, totalCount}) => {
      const additionalPosts = []
      // if a topic has more than 20 posts then to display the latest posts,
      // we'll have to first retrieve them from the server
      _.forEach(topics, (t) => {
        if (t.postIds.length > 20) {
          const postIds = t.postIds.slice(20).slice(-6)
          additionalPosts.push(getTopicPosts(t.id, postIds))
        }
        t.posts = _.sortBy(t.posts, ['id'])
      })
      if (additionalPosts.length === 0) {
        // we dont need to retrieve any additional posts
        return { topics, totalCount }
      }
      return Promise.all(additionalPosts)
        .then(posts => {
          _.forEach(posts, (p) => {
            const topic = _.find(topics, p.topicId)
            topic.posts = _.sortBy(topic.posts.concat(p.posts), ['id'])
          })
          return { topics, totalCount }
        })

    })
}
const getProjectTopicsWithMember = (dispatch, projectId, tag) => {
  return new Promise((resolve, reject) => {
    return dispatch({
      type: LOAD_PROJECT_FEEDS,
      payload: getTopicsWithComments(projectId, tag),
      meta: { tag, projectId }
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
        resolve(value)
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
