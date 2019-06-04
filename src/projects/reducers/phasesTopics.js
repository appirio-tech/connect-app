/**
 * Reducer for phasesTopics
 */
import _ from 'lodash'
import {
  LOAD_PHASE_FEED_PENDING,
  LOAD_PHASE_FEED_SUCCESS,
  LOAD_PHASE_FEED_FAILURE,
  LOAD_PHASE_FEED_MEMBERS_PENDING,
  LOAD_PHASE_FEED_MEMBERS_SUCCESS,
  LOAD_PHASE_FEED_MEMBERS_FAILURE,
  CREATE_PHASE_FEED_COMMENT_PENDING,
  CREATE_PHASE_FEED_COMMENT_SUCCESS,
  CREATE_PHASE_FEED_COMMENT_FAILURE,
  DELETE_PHASE_FEED_COMMENT_PENDING,
  DELETE_PHASE_FEED_COMMENT_SUCCESS,
  DELETE_PHASE_FEED_COMMENT_FAILURE,
  SAVE_PHASE_FEED_COMMENT_PENDING,
  SAVE_PHASE_FEED_COMMENT_SUCCESS,
  SAVE_PHASE_FEED_COMMENT_FAILURE,
} from '../../config/constants'
import update from 'react-addons-update'

const initialState = {
  /*
    State has phase.id as keys and an object as values in the next shape:

    [phase.id]: {
      isLoading: <Boolean>, // is loading phase feed
      error: <Boolean>, // if has error during loading phase feed
      topic: {
        ...
        isAddingComment: <Boolean>, // is adding some comment
        error: <Boolean>, // if has error during adding comment
        posts: [
          {
            ...
            isSavingComment: <Boolean>, // is saving this comment
            isDeletingComment: <Boolean>, // is deleting this comment
            error: <Boolean>, // if has error during saving or deleting this comment
            ...
          }
        ]
        ...
      },
    },
  */
}

export const phasesTopics = function (state=initialState, action) {
  const payload = action.payload

  switch (action.type) {
  /*
    Loading feed
  */
  case LOAD_PHASE_FEED_MEMBERS_PENDING:
  case LOAD_PHASE_FEED_PENDING:
    // if previously feeds were not loaded for the phase
    // create a phase branch instead of updating
    if (!state[action.meta.phaseId]) {
      return {
        ...state,
        [action.meta.phaseId]: {
          isLoading: true,
          error: false,
        }
      }
    }

    return update(state, {
      [action.meta.phaseId]: {
        $merge: {
          isLoading: true,
          error: false,
        }
      }
    })

  case LOAD_PHASE_FEED_SUCCESS:
    // DO NOT alter state until we get all members loaded
    return state

  case LOAD_PHASE_FEED_MEMBERS_SUCCESS:
    return update(state, {
      [action.meta.phaseId]: {
        $merge: {
          isLoading: false,
          error: false,
          topic: payload,
        }
      }
    })

  case LOAD_PHASE_FEED_MEMBERS_FAILURE:
  case LOAD_PHASE_FEED_FAILURE:
    return update(state, {
      [action.meta.phaseId]: {
        $merge: {
          isLoading: false,
          error: true,
        }
      }
    })

  /*
    Creating comments
  */
  case CREATE_PHASE_FEED_COMMENT_PENDING:
    return update(state, {
      [action.meta.phaseId]: {
        $merge: {
          isAddingComment: true,
          error: false,
        }
      }
    })

  case CREATE_PHASE_FEED_COMMENT_SUCCESS: {
    const rawContent = _.get(action, 'meta.rawContent', null)
    const comment = payload.comment
    comment.rawContent = rawContent

    const updatedTopic = update(state[action.meta.phaseId].topic, {
      totalPosts: { $apply: n => n + 1 },
      retrievedPosts: { $apply: n => n + 1 },
      postIds: { $push: [ comment.id ] },
      posts: { $push : [ comment ] },
    })

    return update(state, {
      [action.meta.phaseId]: {
        isAddingComment: { $set: false },
        error: { $set: false },
        topic: { $merge: updatedTopic },
      }
    })
  }

  case CREATE_PHASE_FEED_COMMENT_FAILURE:
    return update(state, {
      [action.meta.phaseId]: {
        $merge: {
          isAddingComment: false,
          error: true,
        }
      }
    })

  /*
    Deleting comments
  */
  case DELETE_PHASE_FEED_COMMENT_PENDING: {
    const commentIndex = _.findIndex(
      state[action.meta.phaseId].topic.posts,
      { id: action.meta.commentId }
    )

    const updatedComment = update(state[action.meta.phaseId].topic.posts[commentIndex], {
      isDeletingComment: { $set: true },
      error: { $set: false },
    })

    return update(state, {
      [action.meta.phaseId]: {
        topic: {
          posts: { $splice: [[commentIndex, 1, updatedComment]] }
        }
      }
    })
  }

  case DELETE_PHASE_FEED_COMMENT_SUCCESS: {
    const commentIndex = _.findIndex(
      state[action.meta.phaseId].topic.posts,
      { id: action.meta.commentId }
    )

    return update(state, {
      [action.meta.phaseId]: {
        topic: {
          totalPosts: { $apply: n => n - 1 },
          retrievedPosts: { $apply: n => n - 1 },
          postIds: { $splice: [[commentIndex, 1]] },
          posts: { $splice: [[commentIndex, 1]] },
        },
      }
    })
  }

  case DELETE_PHASE_FEED_COMMENT_FAILURE: {
    const commentIndex = _.findIndex(
      state[action.meta.phaseId].topic.posts,
      { id: action.meta.commentId }
    )

    const updatedComment = update(state[action.meta.phaseId].topic.posts[commentIndex], {
      isDeletingComment: { $set: false },
      error: { $set: true },
    })

    return update(state, {
      [action.meta.phaseId]: {
        topic: {
          posts: { $splice: [[commentIndex, 1, updatedComment]] }
        }
      }
    })
  }

  /*
    Saving comments
   */
  case SAVE_PHASE_FEED_COMMENT_PENDING: {
    const commentIndex = _.findIndex(
      state[action.meta.phaseId].topic.posts,
      { id: action.meta.commentId }
    )

    const updatedComment = update(state[action.meta.phaseId].topic.posts[commentIndex], {
      isSavingComment: { $set: true },
      error: { $set: false },
    })

    return update(state, {
      [action.meta.phaseId]: {
        topic: {
          posts: { $splice: [[commentIndex, 1, updatedComment]] }
        }
      }
    })
  }

  case SAVE_PHASE_FEED_COMMENT_SUCCESS: {
    const rawContent = _.get(action, 'meta.rawContent', null)
    const savedComment = payload.comment

    const commentIndex = _.findIndex(
      state[action.meta.phaseId].topic.posts,
      { id: action.meta.commentId }
    )

    const updatedComment = update(state[action.meta.phaseId].topic.posts[commentIndex], {
      isSavingComment: { $set: false },
      error: { $set: false },
      rawContent: { $set : rawContent },
      body: { $set : savedComment.body },
      attachments: { $set : savedComment.attachments },
      updatedDate: { $set : savedComment.updatedDate },
      edited: {$set : true }
    })

    return update(state, {
      [action.meta.phaseId]: {
        topic: {
          posts: { $splice: [[commentIndex, 1, updatedComment]] }
        }
      }
    })
  }

  case SAVE_PHASE_FEED_COMMENT_FAILURE: {
    const commentIndex = _.findIndex(
      state[action.meta.phaseId].topic.posts,
      { id: action.meta.commentId }
    )

    const updatedComment = update(state[action.meta.phaseId].topic.posts[commentIndex], {
      isSavingComment: { $set: false },
      error: { $set: true },
    })

    return update(state, {
      [action.meta.phaseId]: {
        topic: {
          posts: { $splice: [[commentIndex, 1, updatedComment]] }
        }
      }
    })
  }

  default:
    return state
  }
}
