import _ from 'lodash'
import { getTopicsWithComments, getTopicPosts, createTopic, saveTopic, deleteTopic, addTopicPost, saveTopicPost, getTopicPost, deleteTopicPost } from '../../api/messages'
import {
  PROJECT_FEED_TYPE_PRIMARY,
  PROJECT_FEED_TYPE_MESSAGES,
  LOAD_PROJECT_FEEDS,
  CREATE_PROJECT_FEED,
  SAVE_PROJECT_FEED,
  DELETE_PROJECT_FEED,
  LOAD_PROJECT_FEED_COMMENTS,
  CREATE_PROJECT_FEED_COMMENT,
  SAVE_PROJECT_FEED_COMMENT,
  GET_PROJECT_FEED_COMMENT,
  DELETE_PROJECT_FEED_COMMENT,
  LOAD_PROJECT_FEEDS_MEMBERS,
  DISCOURSE_BOT_USERID,
  CODER_BOT_USERID,
  TC_SYSTEM_USERID
} from '../../config/constants'
import { loadMembers } from '../../actions/members'
import { EventTypes } from 'redux-segment'

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

export function loadProjectMessages(projectId) {
  const tag = PROJECT_FEED_TYPE_MESSAGES
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT_FEEDS_MEMBERS,
      payload: getProjectTopicsWithMember(dispatch, projectId, tag),
      meta: { tag, projectId }
    })
  }
}

const getProjectTopicsWithMember = (dispatch, projectId, tag) => {
  return new Promise((resolve, reject) => {
    return dispatch({
      type: LOAD_PROJECT_FEEDS,
      payload: getTopicsWithComments('project', projectId, tag, false),
      meta: { tag, projectId }
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
  return (dispatch, getState) => {
    const projectStatus = getState().projectState.project.status
    return dispatch({
      type: CREATE_PROJECT_FEED,
      payload: createTopic(updatedTopic),
      meta: {
        tag: topic.tag,
        rawContent: topic.body,
        onSuccessAnalytics: {
          eventType: EventTypes.track,
          eventPayload: {
            event: 'Project Topic Created',
            properties: {
              text: topic.body,
              topicCategory: topic.tag,
              projectId,
              projectStatus
            }
          }
        }
      }
    })
  }
}

export function saveProjectTopic(feedId, tag, topicProps) {
  return (dispatch, getState) => {
    const projectStatus = getState().projectState.project.status
    return dispatch({
      type: SAVE_PROJECT_FEED,
      payload: saveTopic(feedId, topicProps),
      meta: {
        feedId,
        tag,
        rawContent: topicProps.content,
        onSuccessAnalytics: {
          eventType: EventTypes.track,
          eventPayload: {
            event: 'Project Topic Saved',
            properties: {
              topicCategory: tag,
              topicId: feedId,
              projectStatus
            }
          }
        }
      }
    })
  }
}

export function deleteProjectTopic(feedId, tag) {
  return (dispatch, getState) => {
    const projectStatus = getState().projectState.project.status
    return dispatch({
      type: DELETE_PROJECT_FEED,
      payload: deleteTopic(feedId),
      meta: {
        feedId,
        tag,
        onSuccessAnalytics: {
          eventType: EventTypes.track,
          eventPayload: {
            event: 'Project Topic Deleted',
            properties: {
              topicCategory: tag,
              topicId: feedId,
              projectStatus
            }
          }
        }
      }
    })
  }
}

export function loadFeedComments(feedId, tag, postIds) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT_FEED_COMMENTS,
      payload: getTopicPosts(feedId, postIds),
      meta: {
        topicId: feedId,
        tag
      }
    })
  }
}

export function addFeedComment(feedId, tag, comment) {
  return (dispatch, getState) => {
    const projectStatus = getState().projectState.project.status
    return dispatch({
      type: CREATE_PROJECT_FEED_COMMENT,
      payload: addTopicPost(feedId, comment),
      meta: {
        feedId,
        tag,
        rawContent: comment.content,
        onSuccessAnalytics: {
          eventType: EventTypes.track,
          eventPayload: {
            event: 'Project Topic Comment Created',
            properties: {
              topicCategory: tag,
              topicId: feedId,
              projectStatus
            }
          }
        }
      }
    })
  }
}

export function saveFeedComment(feedId, tag, comment) {
  return (dispatch, getState) => {
    const projectStatus = getState().projectState.project.status
    return dispatch({
      type: SAVE_PROJECT_FEED_COMMENT,
      payload: saveTopicPost(feedId, comment),
      meta: {
        feedId,
        tag,
        commentId: comment.id,
        rawContent: comment.content,
        onSuccessAnalytics: {
          eventType: EventTypes.track,
          eventPayload: {
            event: 'Project Topic Comment Saved',
            properties: {
              topicCategory: tag,
              topicId: feedId,
              projectStatus
            }
          }
        }
      }
    })
  }
}

export function deleteFeedComment(feedId, tag, commentId) {
  return (dispatch, getState) => {
    const projectStatus = getState().projectState.project.status
    return dispatch({
      type: DELETE_PROJECT_FEED_COMMENT,
      payload: deleteTopicPost(feedId, commentId),
      meta: {
        feedId,
        tag,
        commentId,
        onSuccessAnalytics: {
          eventType: EventTypes.track,
          eventPayload: {
            event: 'Project Topic Comment Deleted',
            properties: {
              topicCategory: tag,
              topicId: feedId,
              projectStatus
            }
          }
        }
      }
    })
  }
}

export function getFeedComment(feedId, tag, commentId) {
  return (dispatch, getState) => {
    const projectStatus = getState().projectState.project.status
    return dispatch({
      type: GET_PROJECT_FEED_COMMENT,
      payload: getTopicPost(feedId, commentId),
      meta: {
        feedId,
        tag,
        commentId,
        onSuccessAnalytics: {
          eventType: EventTypes.track,
          eventPayload: {
            event: 'Project Topic Comment Retrieved',
            properties: {
              topicCategory: tag,
              topicId: feedId,
              projectStatus
            }
          }
        }
      }
    })
  }
}
