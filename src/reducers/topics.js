/**
 * Reducer for topics
 */
import _ from 'lodash'
import {
  LOAD_TOPIC_PENDING,
  LOAD_TOPIC_SUCCESS,
  LOAD_TOPIC_FAILURE,
  LOAD_TOPIC_MEMBERS_PENDING,
  LOAD_TOPIC_MEMBERS_SUCCESS,
  LOAD_TOPIC_MEMBERS_FAILURE,
  CREATE_TOPIC_POST_PENDING,
  CREATE_TOPIC_POST_SUCCESS,
  CREATE_TOPIC_POST_FAILURE,
  DELETE_TOPIC_POST_PENDING,
  DELETE_TOPIC_POST_SUCCESS,
  DELETE_TOPIC_POST_FAILURE,
  UPDATE_TOPIC_POST_PENDING,
  UPDATE_TOPIC_POST_SUCCESS,
  UPDATE_TOPIC_POST_FAILURE,
} from '../config/constants'
import update from 'react-addons-update'

const initialState = {
  /*
    State has tag as keys in format like '<topic>#<id>' and an object as values in the next shape:

    [tag]: {
      isLoading: <Boolean>, // is loading topic
      error: <Boolean>, // if has error during loading topic
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

export const topics = function (state=initialState, action) {
  const payload = action.payload

  switch (action.type) {
  /*
    Loading topic
  */
  case LOAD_TOPIC_MEMBERS_PENDING:
  case LOAD_TOPIC_PENDING:
    // if previously topics were not loaded
    // create a topic branch instead of updating
    if (!state[action.meta.tag]) {
      return {
        ...state,
        [action.meta.tag]: {
          isLoading: true,
          error: false,
        }
      }
    }

    return update(state, {
      [action.meta.tag]: {
        $merge: {
          isLoading: true,
          error: false,
        }
      }
    })

  case LOAD_TOPIC_SUCCESS:
    // DO NOT alter state until we get all members loaded
    return state

  case LOAD_TOPIC_MEMBERS_SUCCESS:
    return update(state, {
      [action.meta.tag]: {
        $merge: {
          isLoading: false,
          error: false,
          topic: payload,
        }
      }
    })

  case LOAD_TOPIC_MEMBERS_FAILURE:
  case LOAD_TOPIC_FAILURE:
    return update(state, {
      [action.meta.tag]: {
        $merge: {
          isLoading: false,
          error: true,
        }
      }
    })

  /*
    Creating posts
  */
  case CREATE_TOPIC_POST_PENDING:
    return update(state, {
      [action.meta.tag]: {
        $merge: {
          isAddingComment: true,
          error: false,
        }
      }
    })

  case CREATE_TOPIC_POST_SUCCESS: {
    const rawContent = _.get(action, 'meta.rawContent', null)
    const comment = payload.comment
    comment.rawContent = rawContent

    const updatedTopic = update(state[action.meta.tag].topic, {
      totalPosts: { $apply: n => n + 1 },
      retrievedPosts: { $apply: n => n + 1 },
      postIds: { $push: [ comment.id ] },
      posts: { $push : [ comment ] },
    })

    return update(state, {
      [action.meta.tag]: {
        isAddingComment: { $set: false },
        error: { $set: false },
        topic: { $merge: updatedTopic },
      }
    })
  }

  case CREATE_TOPIC_POST_FAILURE:
    return update(state, {
      [action.meta.tag]: {
        $merge: {
          isAddingComment: false,
          error: true,
        }
      }
    })

  /*
    Deleting posts
  */
  case DELETE_TOPIC_POST_PENDING: {
    const commentIndex = _.findIndex(
      state[action.meta.tag].topic.posts,
      { id: action.meta.commentId }
    )

    const updatedComment = update(state[action.meta.tag].topic.posts[commentIndex], {
      isDeletingComment: { $set: true },
      error: { $set: false },
    })

    return update(state, {
      [action.meta.tag]: {
        topic: {
          posts: { $splice: [[commentIndex, 1, updatedComment]] }
        }
      }
    })
  }

  case DELETE_TOPIC_POST_SUCCESS: {
    const commentIndex = _.findIndex(
      state[action.meta.tag].topic.posts,
      { id: action.meta.commentId }
    )

    return update(state, {
      [action.meta.tag]: {
        topic: {
          totalPosts: { $apply: n => n - 1 },
          retrievedPosts: { $apply: n => n - 1 },
          postIds: { $splice: [[commentIndex, 1]] },
          posts: { $splice: [[commentIndex, 1]] },
        },
      }
    })
  }

  case DELETE_TOPIC_POST_FAILURE: {
    const commentIndex = _.findIndex(
      state[action.meta.tag].topic.posts,
      { id: action.meta.commentId }
    )

    const updatedComment = update(state[action.meta.tag].topic.posts[commentIndex], {
      isDeletingComment: { $set: false },
      error: { $set: true },
    })

    return update(state, {
      [action.meta.tag]: {
        topic: {
          posts: { $splice: [[commentIndex, 1, updatedComment]] }
        }
      }
    })
  }

  /*
    Saving posts
   */
  case UPDATE_TOPIC_POST_PENDING: {
    const commentIndex = _.findIndex(
      state[action.meta.tag].topic.posts,
      { id: action.meta.commentId }
    )

    const updatedComment = update(state[action.meta.tag].topic.posts[commentIndex], {
      isSavingComment: { $set: true },
      error: { $set: false },
    })

    return update(state, {
      [action.meta.tag]: {
        topic: {
          posts: { $splice: [[commentIndex, 1, updatedComment]] }
        }
      }
    })
  }

  case UPDATE_TOPIC_POST_SUCCESS: {
    const rawContent = _.get(action, 'meta.rawContent', null)
    const savedComment = payload.comment

    const commentIndex = _.findIndex(
      state[action.meta.tag].topic.posts,
      { id: action.meta.commentId }
    )

    const updatedComment = update(state[action.meta.tag].topic.posts[commentIndex], {
      isSavingComment: { $set: false },
      error: { $set: false },
      rawContent: { $set : rawContent },
      body: { $set : savedComment.body },
      attachments: { $set : savedComment.attachments },
      updatedDate: { $set : savedComment.updatedDate },
      edited: {$set : true }
    })

    return update(state, {
      [action.meta.tag]: {
        topic: {
          posts: { $splice: [[commentIndex, 1, updatedComment]] }
        }
      }
    })
  }

  case UPDATE_TOPIC_POST_FAILURE: {
    const commentIndex = _.findIndex(
      state[action.meta.tag].topic.posts,
      { id: action.meta.commentId }
    )

    const updatedComment = update(state[action.meta.tag].topic.posts[commentIndex], {
      isSavingComment: { $set: false },
      error: { $set: true },
    })

    return update(state, {
      [action.meta.tag]: {
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
