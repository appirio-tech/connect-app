/**
 * Phase topics actions
 */
import _ from 'lodash'
import {
  getTopicsWithComments,
  addTopicPost,
  saveTopicPost,
  deleteTopicPost,
} from '../../api/messages'
import {
  PROJECT_FEED_TYPE_PHASE,
  LOAD_PHASE_FEED_MEMBERS,
  LOAD_PHASE_FEED,
  CREATE_PHASE_FEED_COMMENT,
  DELETE_PHASE_FEED_COMMENT,
  SAVE_PHASE_FEED_COMMENT,
  DISCOURSE_BOT_USERID,
  CODER_BOT_USERID,
  TC_SYSTEM_USERID,
} from '../../config/constants'
import { loadMembers } from '../../actions/members'
import { EventTypes } from 'redux-segment'

export function loadPhaseFeed(projectId, phaseId) {
  const tag = PROJECT_FEED_TYPE_PHASE
  return (dispatch) => {
    return dispatch({
      type: LOAD_PHASE_FEED_MEMBERS,
      payload: getPhaseTopicWithMember(dispatch, projectId, phaseId, tag),
      meta: { tag, phaseId }
    })
  }
}

const getPhaseTopicWithMember = (dispatch, projectId, phaseId, tag) => {
  return new Promise((resolve, reject) => {
    return dispatch({
      type: LOAD_PHASE_FEED,
      // TODO $PROJECT_PLAN$ remove getting topics for project 5021
      // and uncomment calling for getting topics for phase
      payload: getTopicsWithComments('project', `${projectId}`, `phase#${phaseId}`), // getTopicsWithComments('phase', phaseId, tag),
      meta: { tag, phaseId }
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

export function addPhaseFeedComment(phaseId, feedId, comment) {
  const tag = PROJECT_FEED_TYPE_PHASE

  return (dispatch, getState) => {
    const projectStatus = getState().projectState.project.status
    return dispatch({
      type: CREATE_PHASE_FEED_COMMENT,
      payload: addTopicPost(feedId, comment),
      meta: {
        phaseId,
        feedId,
        tag,
        rawContent: comment.content,
        onSuccessAnalytics: {
          eventType: EventTypes.track,
          eventPayload: {
            event: 'Phase Comment Created',
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

export function deletePhaseFeedComment(phaseId, feedId, commentId) {
  const tag = PROJECT_FEED_TYPE_PHASE

  return (dispatch, getState) => {
    const projectStatus = getState().projectState.project.status
    return dispatch({
      type: DELETE_PHASE_FEED_COMMENT,
      payload: deleteTopicPost(feedId, commentId),
      meta: {
        phaseId,
        feedId,
        tag,
        commentId,
        onSuccessAnalytics: {
          eventType: EventTypes.track,
          eventPayload: {
            event: 'Phase Comment Deleted',
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

export function savePhaseFeedComment(phaseId, feedId, comment) {
  const tag = PROJECT_FEED_TYPE_PHASE

  return (dispatch, getState) => {
    const projectStatus = getState().projectState.project.status
    return dispatch({
      type: SAVE_PHASE_FEED_COMMENT,
      payload: saveTopicPost(feedId, comment),
      meta: {
        phaseId,
        feedId,
        tag,
        commentId: comment.id,
        rawContent: comment.content,
        onSuccessAnalytics: {
          eventType: EventTypes.track,
          eventPayload: {
            event: 'Phase Comment Saved',
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
