/**
 * Topic actions
 */
import _ from 'lodash'
import {
  getTopicsWithComments,
  addTopicPost as addTopicPostAPI,
  saveTopicPost as saveTopicPostAPI,
  deleteTopicPost as deleteTopicPostAPI,
} from '../api/messages'
import {
  LOAD_TOPIC_MEMBERS,
  LOAD_TOPIC,
  CREATE_TOPIC_POST,
  DELETE_TOPIC_POST,
  UPDATE_TOPIC_POST,
  DISCOURSE_BOT_USERID,
  CODER_BOT_USERID,
  TC_SYSTEM_USERID,
} from '../config/constants'
import { loadMembers } from './members'
import { EventTypes } from 'redux-segment'

/**
 * Load topics for given tags
 * @param  {integer} projectId project identifier
 * @param  {Array} tags list of tags
 * @param  {Function} dispatch dispatch function
 * @return {Array} topics
 */
export function loadTopics(projectId, tags, dispatch) {
  return Promise.all(
    tags.map((tag) => getTopicWithoutMembers(dispatch, projectId, tag))
  ).then((responses) => {
    return _.map(responses, (resp) => ({
      topics: _.get(resp, 'value') ? [_.get(resp, 'value')] : [],
      tag: _.get(resp, 'action.meta.tag'),
    }))
  })
}

/**
 * Load topic for a given tag
 * @param  {integer} projectId project identifier
 * @param  {String} tag tag
 * @return {Object} action
 */
export function loadTopic(projectId, tag) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_TOPIC_MEMBERS,
      payload: getTopicWithMember(dispatch, projectId, tag),
      meta: { tag }
    })
  }
}

/**
 * Get topics without members
 * @param  {Function} dispatch dispatch function
 * @param  {integer} projectId project identifier
 * @param  {String} tag tag
 * @return {Object} topic
 */
function getTopicWithoutMembers(dispatch, projectId, tag) {
  return dispatch({
    type: LOAD_TOPIC_MEMBERS,
    payload:  new Promise((resolve, reject) => {
      return getTopicsWithComments('project', `${projectId}`, tag, false)
        .then((resp) => resolve(_.get(resp, 'topics[0]')))
        .catch(err => reject(err))
    }),
    meta: { tag }
  })
}

/**
 * Get topics with members
 * @param  {Function} dispatch dispatch function
 * @param  {integer} projectId project identifier
 * @param  {String} tag tag
 * @return {Promise}
 */
function getTopicWithMember(dispatch, projectId, tag) {
  return new Promise((resolve, reject) => {
    return dispatch({
      type: LOAD_TOPIC,
      payload: getTopicsWithComments('project', `${projectId}`, tag, false),
      meta: { tag }
    })
      .then(({ value }) => {
        let userIds = []
        userIds = _.union(userIds, _.map(value.topics, 'userId'))
        _.forEach(value.topics, topic => {
          userIds = _.union(userIds, _.map(topic.posts, 'userId'))
        })
        // this is to remove any nulls from the list (dev had some bad data)
        _.remove(userIds, i => !i || [DISCOURSE_BOT_USERID, CODER_BOT_USERID, TC_SYSTEM_USERID].indexOf(i) > -1)
        // return if there are no userIds to retrieve, empty result set
        if (!userIds.length)
          resolve(value.topics[0])
        return dispatch(loadMembers(userIds))
          .then(() => resolve(value.topics[0]))
          .catch(err => reject(err))
      })
      .catch(err => reject(err))
  })
}

/**
 * Add post to the topic
 * @param  {String} tag tag
 * @param  {integer} topicId topic identifier
 * @param  {Object} post post
 * @return {Object} action
 */
export function addTopicPost(tag, topicId, post) {
  return (dispatch, getState) => {
    const projectStatus = getState().projectState.project.status
    return dispatch({
      type: CREATE_TOPIC_POST,
      payload: addTopicPostAPI(topicId, post),
      meta: {
        feedId: topicId,
        tag,
        rawContent: post.content,
        onSuccessAnalytics: {
          eventType: EventTypes.track,
          eventPayload: {
            event: 'Post Created',
            properties: {
              topicCategory: tag,
              topicId,
              projectStatus
            }
          }
        }
      }
    })
  }
}

/**
 * Delete post
 * @param  {String} tag tag
 * @param  {integer} topicId topic identifier
 * @param  {integer} postId post identifier
 * @return {Object} action
 */
export function deleteTopicPost(tag, topicId, postId) {
  return (dispatch, getState) => {
    const projectStatus = getState().projectState.project.status
    return dispatch({
      type: DELETE_TOPIC_POST,
      payload: deleteTopicPostAPI(topicId, postId),
      meta: {
        feedId: topicId,
        tag,
        commentId: postId,
        onSuccessAnalytics: {
          eventType: EventTypes.track,
          eventPayload: {
            event: 'Post Deleted',
            properties: {
              topicCategory: tag,
              topicId,
              projectStatus
            }
          }
        }
      }
    })
  }
}

/**
 * Update post
 * @param  {String} tag tag
 * @param  {integer} topicId topic identifier
 * @param  {Object} post post
 * @return {Object} action
 */
export function updateTopicPost(tag, topicId, post) {
  return (dispatch, getState) => {
    const projectStatus = getState().projectState.project.status
    return dispatch({
      type: UPDATE_TOPIC_POST,
      payload: saveTopicPostAPI(topicId, post),
      meta: {
        feedId: topicId,
        tag,
        commentId: post.id,
        rawContent: post.content,
        onSuccessAnalytics: {
          eventType: EventTypes.track,
          eventPayload: {
            event: 'Post Saved',
            properties: {
              topicCategory: tag,
              topicId,
              projectStatus
            }
          }
        }
      }
    })
  }
}
