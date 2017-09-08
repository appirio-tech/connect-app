import _ from 'lodash'
import {
  CLEAR_LOADED_PROJECT,
  LOAD_PROJECT_PENDING,
  LOAD_PROJECT_FEEDS_PENDING,
  LOAD_PROJECT_FEEDS_SUCCESS,
  LOAD_PROJECT_FEEDS_FAILURE,
  LOAD_PROJECT_FEEDS_MEMBERS_PENDING,
  LOAD_PROJECT_FEEDS_MEMBERS_SUCCESS,
  LOAD_PROJECT_FEEDS_MEMBERS_FAILURE,
  CREATE_PROJECT_FEED_PENDING,
  CREATE_PROJECT_FEED_SUCCESS,
  CREATE_PROJECT_FEED_FAILURE,
  SAVE_PROJECT_FEED_PENDING,
  SAVE_PROJECT_FEED_SUCCESS,
  SAVE_PROJECT_FEED_FAILURE,
  DELETE_PROJECT_FEED_PENDING,
  DELETE_PROJECT_FEED_SUCCESS,
  DELETE_PROJECT_FEED_FAILURE,
  LOAD_PROJECT_FEED_COMMENTS_PENDING,
  LOAD_PROJECT_FEED_COMMENTS_SUCCESS,
  LOAD_PROJECT_FEED_COMMENTS_FAILURE,
  CREATE_PROJECT_FEED_COMMENT_PENDING,
  CREATE_PROJECT_FEED_COMMENT_SUCCESS,
  CREATE_PROJECT_FEED_COMMENT_FAILURE,
  SAVE_PROJECT_FEED_COMMENT_PENDING,
  SAVE_PROJECT_FEED_COMMENT_SUCCESS,
  SAVE_PROJECT_FEED_COMMENT_FAILURE,
  DELETE_PROJECT_FEED_COMMENT_PENDING,
  DELETE_PROJECT_FEED_COMMENT_SUCCESS,
  DELETE_PROJECT_FEED_COMMENT_FAILURE,
  GET_PROJECT_FEED_COMMENT_PENDING,
  GET_PROJECT_FEED_COMMENT_SUCCESS,
  GET_PROJECT_FEED_COMMENT_FAILURE
} from '../../config/constants'
import update from 'react-addons-update'


const initialState = {
  isLoading: true,
  isCreatingFeed: false,
  error: false,
  projectId: null,
  feeds: {
    MESSAGES: { topics: [], totalCount: 0 },
    PRIMARY: { topics: [], totalCount: 0 }
  }
}


export const projectTopics = function (state=initialState, action) {
  const payload = action.payload

  switch (action.type) {
  case LOAD_PROJECT_PENDING:
  case CLEAR_LOADED_PROJECT:
    return Object.assign({}, initialState)

  case LOAD_PROJECT_FEEDS_MEMBERS_PENDING:
  case LOAD_PROJECT_FEEDS_PENDING:
    if (action.meta.projectId === state.projectId) {
      const feedUpdateQuery = {}
      feedUpdateQuery[action.meta.tag] = { $merge: { topics: [], totalCount: 0 } }
      return update(state, {
        feeds: feedUpdateQuery,
        isLoading: { $set: true },
        error: { $set: false }
      })
    } else {
      //empty the feeds so that switching between projects doesn't show wrong feeds
      return Object.assign({}, initialState, {
        projectId: action.meta.projectId
      })
    }
  case LOAD_PROJECT_FEEDS_SUCCESS:
    // DO NOT alter state until we get all members loaded
    return state
  case LOAD_PROJECT_FEEDS_MEMBERS_SUCCESS: {
    /**
     * Topics for specificed tag (action.meta.tag) have been retrieved
     * Sort them based on 'lastActivityAt' (latest first) and replace,
     * the topics in the current list for that tag.
     * Also, update the total count.
     */

    const topics = _.sortBy(payload.topics, (t) => {
      return new Date(t.lastActivityAt)
    }).reverse()

    const feedUpdateQuery = {}
    feedUpdateQuery[action.meta.tag] = { $merge: { topics, totalCount: payload.totalCount } }
    return update(state, {
      isLoading: {$set: false},
      error: {$set: false},
      feeds: feedUpdateQuery
    })
  }
  case LOAD_PROJECT_FEEDS_MEMBERS_FAILURE:
  case LOAD_PROJECT_FEEDS_FAILURE:
    return Object.assign({}, initialState, {
      isLoading: false,
      error: true
    })
  case CREATE_PROJECT_FEED_PENDING:
    return Object.assign({}, state, {
      isCreatingFeed: true,
      error: false
    })
  case CREATE_PROJECT_FEED_SUCCESS: {
    /**
     * New Topic was created. After handling error scenarios, insert
     * the newly created topic to the topic list for the specified tag
     * and also update total Count.
     * NOTE: we don't need to re-sort since we are inserting the new topic
     * to the beginning of the list
     */
    const tag = _.get(action, 'meta.tag', null)
    const rawContent = _.get(action, 'meta.rawContent', null)
    if (!tag) return state
    const feed = payload
    if (!feed) {
      return update (state, {
        isCreatingFeed: { $set : false },
        error: { $set : true }
      })
    }
    feed.posts = feed.posts || []
    if (feed.posts.length) {
      feed.posts[0].rawContent = rawContent
    }
    const feedUpdateQuery = {}
    feedUpdateQuery[tag] = { topics: { $unshift: [feed] }, totalCount: {$apply: (n) => n + 1} }
    return update (state, {
      isCreatingFeed: { $set : false },
      error: { $set : false },
      feeds: feedUpdateQuery
    })
  }
  case CREATE_PROJECT_FEED_FAILURE:
    return Object.assign({}, state, {
      isCreatingFeed: false,
      error: true
    })
  case LOAD_PROJECT_FEED_COMMENTS_PENDING: {
    const feedId = _.get(action, 'meta.topicId', null)
    const tag = _.get(action, 'meta.tag', null)
    // find feed index from the state
    const feedIndex = _.findIndex(state.feeds[tag].topics, feed => feed.id === feedId)
    // if we find the feed
    if (feedIndex >= 0) {
      const feed = state.feeds[tag].topics[feedIndex]
      const updatedFeed = update(feed, {
        isLoadingComments: { $set : true }
      })
      const feedUpdateQuery = {}
      feedUpdateQuery[tag] = { topics: { $splice: [[feedIndex, 1, updatedFeed]] } }
      // update the state
      return update (state, {
        feeds: feedUpdateQuery
      })
    }
    return state
  }
  case LOAD_PROJECT_FEED_COMMENTS_SUCCESS: {
    const feedId = _.get(action, 'meta.topicId', null)
    const tag = _.get(action, 'meta.tag', null)
    // find feed index from the state
    const feedIndex = _.findIndex(state.feeds[tag].topics, feed => feed.id === feedId)
    // if we find the feed
    if (feedIndex >= 0) {
      const feed = state.feeds[tag].topics[feedIndex]
      // number of posts those would be rendered after this state update
      // const noOfRenderedPosts = feed.posts.length + payload.posts.length
      // updates feed, pushes the new posts into posts array of the feed
      const updatedFeed = update(feed, {
        showAll: { $set: true },
        posts: { $push: payload.posts },
        isLoadingComments: { $set : false }
      })
      updatedFeed.posts = _.sortBy(updatedFeed.posts, ['id'])
      const feedUpdateQuery = {}
      feedUpdateQuery[tag] = { topics: { $splice: [[feedIndex, 1, updatedFeed]] } }
      // update the state
      return update (state, {
        feeds: feedUpdateQuery
      })
    }
    return state
  }
  case LOAD_PROJECT_FEED_COMMENTS_FAILURE: {
    const feedId = _.get(action, 'meta.topicId', null)
    const tag = _.get(action, 'meta.tag', null)
    // find feed index from the state
    const feedIndex = _.findIndex(state.feeds[tag].topics, feed => feed.id === feedId)
    // if we find the feed
    if (feedIndex >= 0) {
      const feed = state.feeds[tag].topics[feedIndex]
      const updatedFeed = update(feed, {
        isLoadingComments: { $set : false }
      })
      const feedUpdateQuery = {}
      feedUpdateQuery[tag] = { topics: { $splice: [[feedIndex, 1, updatedFeed]] } }
      // update the state
      return update (state, {
        feeds: feedUpdateQuery
      })
    }
    return state
  }
  case SAVE_PROJECT_FEED_PENDING: {
    const feedId = _.get(action, 'meta.feedId', null)
    const tag = _.get(action, 'meta.tag', null)
    if (!feedId) return state
    // find feed index from the state
    const feedIndex = _.findIndex(state.feeds[tag].topics, feed => feed.id === feedId)
    if (feedIndex >= 0) {
      const feed = state.feeds[tag].topics[feedIndex]
      const updatedFeed = update (feed, {
        isSavingTopic : { $set : true },
        error: { $set : false }
      })
      const feedUpdateQuery = {}
      feedUpdateQuery[tag] = { topics: { $splice: [[feedIndex, 1, updatedFeed]] } }
      return update (state, {
        error: { $set : false },
        feeds: feedUpdateQuery
      })
    }
    return state
  }
  case SAVE_PROJECT_FEED_SUCCESS: {
    const feedId = _.get(action, 'meta.feedId', null)
    const tag = _.get(action, 'meta.tag', null)
    const rawContent = _.get(action, 'meta.rawContent', null)
    const topic = payload.topic
    const topicPost = payload.post
    // find feed index from the state
    const feedIndex = _.findIndex(state.feeds[tag].topics, feed => feed.id === feedId)
    if (feedIndex >= 0) {
      const feed = state.feeds[tag].topics[feedIndex]
      const topicMessage = topicPost ? update (feed.posts[0], {
        rawContent: { $set: rawContent },
        body: { $set: topicPost.body },
        date: { $set: topicPost.date }
      }) : feed.posts[0]
      const updatedFeed = update (feed, {
        title : { $set : topic.title },
        posts: { $splice: [[0, 1, topicMessage]] },
        isSavingTopic : { $set : false },
        error: { $set: false }
      })
      const feedUpdateQuery = {}
      feedUpdateQuery[tag] = { topics: { $splice: [[feedIndex, 1, updatedFeed]] } }
      // update the state
      return update (state, {
        error: { $set : false },
        feeds: feedUpdateQuery
      })
    }
    return state
  }
  case SAVE_PROJECT_FEED_FAILURE: {
    const feedId = _.get(action, 'meta.feedId', null)
    const tag = _.get(action, 'meta.tag', null)
    if (!feedId) return state
    // find feed index from the state
    const feedIndex = _.findIndex(state.feeds[tag].topics, feed => feed.id === feedId)
    if (feedIndex >= 0) {
      const feed = state.feeds[tag].topics[feedIndex]
      const updatedFeed = update (feed, {
        isSavingTopic : { $set : false },
        error: { $set: true }
      })
      const feedUpdateQuery = {}
      feedUpdateQuery[tag] = { topics: { $splice: [[feedIndex, 1, updatedFeed]] } }
      return update (state, {
        error: { $set : false },
        feeds: feedUpdateQuery
      })
    }
    return state
  }
  case DELETE_PROJECT_FEED_PENDING: {
    const feedId = _.get(action, 'meta.feedId', null)
    const tag = _.get(action, 'meta.tag', null)
    if (!feedId) return state
    // find feed index from the state
    const feedIndex = _.findIndex(state.feeds[tag].topics, feed => feed.id === feedId)
    if (feedIndex >= 0) {
      const feed = state.feeds[tag].topics[feedIndex]
      const updatedFeed = update (feed, {
        isDeletingTopic : { $set : true }
      })
      const feedUpdateQuery = {}
      feedUpdateQuery[tag] = { topics: { $splice: [[feedIndex, 1, updatedFeed]] } }
      return update (state, {
        error: { $set : false },
        feeds: feedUpdateQuery
      })
    }
    return state
  }
  case DELETE_PROJECT_FEED_SUCCESS: {
    const feedId = _.get(action, 'meta.feedId', null)
    const tag = _.get(action, 'meta.tag', null)
    if (!feedId) return state
    const topics = _.filter(state.feeds[tag].topics, t => t.id !== feedId)
    const feedUpdateQuery = {}
    feedUpdateQuery[tag] = { topics: { $set: topics }, totalCount: {$apply: (n) => n - 1} }
    return update (state, {
      error: { $set : false },
      feeds: feedUpdateQuery
    })
  }
  case DELETE_PROJECT_FEED_FAILURE: {
    const feedId = _.get(action, 'meta.feedId', null)
    const tag = _.get(action, 'meta.tag', null)
    if (!feedId) return state
    // find feed index from the state
    const feedIndex = _.findIndex(state.feeds[tag].topics, feed => feed.id === feedId)
    if (feedIndex >= 0) {
      const feed = state.feeds[tag].topics[feedIndex]
      const updatedFeed = update (feed, {
        isDeletingTopic : { $set : false },
        error: { $set: true }
      })
      const feedUpdateQuery = {}
      feedUpdateQuery[tag] = { topics: { $splice: [[feedIndex, 1, updatedFeed]] } }
      return update (state, {
        error: { $set : false },
        feeds: feedUpdateQuery
      })
    }
    return state
  }
  case CREATE_PROJECT_FEED_COMMENT_PENDING: {
    const feedId = _.get(action, 'meta.feedId', null)
    const tag = _.get(action, 'meta.tag', null)
    if (!feedId) return state
    // find feed index from the state
    const feedIndex = _.findIndex(state.feeds[tag].topics, feed => feed.id === feedId)
    if (feedIndex >= 0) {
      const feed = state.feeds[tag].topics[feedIndex]
      const updatedFeed = update (feed, {
        isAddingComment : { $set : true }
      })
      const feedUpdateQuery = {}
      feedUpdateQuery[tag] = { topics: { $splice: [[feedIndex, 1, updatedFeed]] } }
      return update (state, {
        error: { $set : false },
        feeds: feedUpdateQuery
      })
    }
    return state
  }
  case CREATE_PROJECT_FEED_COMMENT_SUCCESS: {
    const feedId = _.get(action, 'meta.feedId', null)
    const tag = _.get(action, 'meta.tag', null)
    const rawContent = _.get(action, 'meta.rawContent', null)
    const comment = payload.comment
    comment.rawContent = rawContent
    // find feed index from the state
    const feedIndex = _.findIndex(state.feeds[tag].topics, feed => feed.id === feedId)
    if (feedIndex >= 0) {
      const feed = state.feeds[tag].topics[feedIndex]
      const commentIndex = _.findIndex(feed.postIds, id => id === comment.id)
      let updatedFeed
      if (commentIndex >= 0) {
        // The created comment already exists, it's duplicate
        updatedFeed = update (feed, {
          isAddingComment : { $set : false },
          error: { $set: false }
        })
      } else {
        updatedFeed = update (feed, {
          // no need to update hasMoreComments, it should maintain its prev value
          totalPosts: { $apply: n => n + 1},
          retrievedPosts: { $apply: n => n+1 },
          postIds: { $push: [comment.id] },
          posts: { $push : [ comment ] },
          isAddingComment : { $set : false },
          error: { $set: false }
        })
      }
      const feedUpdateQuery = {}
      feedUpdateQuery[tag] = { topics: { $splice: [[feedIndex, 1, updatedFeed]] } }
      // update the state
      return update (state, {
        feeds: feedUpdateQuery
      })
    }
    return state
  }
  case CREATE_PROJECT_FEED_COMMENT_FAILURE: {
    const feedId = _.get(action, 'meta.feedId', null)
    const tag = _.get(action, 'meta.tag', null)
    if (!feedId) return state
    // find feed index from the state
    const feedIndex = _.findIndex(state.feeds[tag].topics, feed => feed.id === feedId)
    if (feedIndex >= 0) {
      const feed = state.feeds[tag].topics[feedIndex]
      const updatedFeed = update (feed, {
        isAddingComment : { $set : false },
        error: { $set: true }
      })
      const feedUpdateQuery = {}
      feedUpdateQuery[tag] = { topics: { $splice: [[feedIndex, 1, updatedFeed]] } }
      return update (state, {
        error: { $set : false },
        feeds: feedUpdateQuery
      })
    }
    return state
  }
  case SAVE_PROJECT_FEED_COMMENT_PENDING: {
    const feedId = _.get(action, 'meta.feedId', null)
    const tag = _.get(action, 'meta.tag', null)
    const commentId = _.get(action, 'meta.commentId', null)
    if (!feedId || !commentId) return state
    // find feed index from the state
    const feedIndex = _.findIndex(state.feeds[tag].topics, feed => feed.id === feedId)
    if (feedIndex >= 0) {
      const feed = state.feeds[tag].topics[feedIndex]
      const commentIndex = _.findIndex(feed.posts, post => post.id === commentId)
      if (commentIndex < 0) {
        return state
      }
      const updatedComment = update (feed.posts[commentIndex], {
        isSavingComment : { $set : true },
        error: { $set : false }
      })

      const updatedFeed = update(feed, { posts: { $splice: [[commentIndex, 1, updatedComment]] } })

      const feedUpdateQuery = {}
      feedUpdateQuery[tag] = { topics: { $splice: [[feedIndex, 1, updatedFeed]] } }
      return update (state, {
        error: { $set : false },
        feeds: feedUpdateQuery
      })
    }
    return state
  }
  case SAVE_PROJECT_FEED_COMMENT_SUCCESS: {
    const feedId = _.get(action, 'meta.feedId', null)
    const tag = _.get(action, 'meta.tag', null)
    const commentId = _.get(action, 'meta.commentId', null)
    const rawContent = _.get(action, 'meta.rawContent', null)
    const savedComment = payload.comment
    if (!feedId || !commentId) return state
    // find feed index from the state
    const feedIndex = _.findIndex(state.feeds[tag].topics, feed => feed.id === feedId)
    if (feedIndex >= 0) {
      const feed = state.feeds[tag].topics[feedIndex]
      const commentIndex = _.findIndex(feed.posts, post => post.id === commentId)
      if (commentIndex < 0) {
        return state
      }
      const updatedComment = update(feed.posts[commentIndex], {
        isSavingComment : { $set : false },
        error: { $set : false },
        rawContent: { $set : rawContent },
        body: { $set : savedComment.body },
        date: { $set : savedComment.updatedDate },
        edited: {$set : true }
      })

      const updatedFeed = update(feed, { posts: { $splice: [[commentIndex, 1, updatedComment]] } })
      const feedUpdateQuery = {}
      feedUpdateQuery[tag] = { topics: { $splice: [[feedIndex, 1, updatedFeed]] } }
      return update (state, {
        error: { $set : false },
        feeds: feedUpdateQuery
      })
    }
    return state
  }
  case SAVE_PROJECT_FEED_COMMENT_FAILURE: {
    const feedId = _.get(action, 'meta.feedId', null)
    const tag = _.get(action, 'meta.tag', null)
    const commentId = _.get(action, 'meta.commentId', null)
    if (!feedId || !commentId) return state
    // find feed index from the state
    const feedIndex = _.findIndex(state.feeds[tag].topics, feed => feed.id === feedId)
    if (feedIndex >= 0) {
      const feed = state.feeds[tag].topics[feedIndex]
      const commentIndex = _.findIndex(feed.posts, post => post.id === commentId)
      if (commentIndex < 0) {
        return state
      }
      const updatedComment = update (feed.posts[commentIndex], {
        isSavingComment : { $set : false },
        error: { $set : true }
      })

      const updatedFeed = update(feed, { posts: { $splice: [[commentIndex, 1, updatedComment]] } })
      const feedUpdateQuery = {}
      feedUpdateQuery[tag] = { topics: { $splice: [[feedIndex, 1, updatedFeed]] } }

      return update (state, {
        error: { $set : false },
        feeds: feedUpdateQuery
      })
    }
    return state
  }
  case DELETE_PROJECT_FEED_COMMENT_PENDING: {
    const feedId = _.get(action, 'meta.feedId', null)
    const tag = _.get(action, 'meta.tag', null)
    const commentId = _.get(action, 'meta.commentId', null)
    if (!feedId || !commentId) return state
    // find feed index from the state
    const feedIndex = _.findIndex(state.feeds[tag].topics, feed => feed.id === feedId)
    if (feedIndex >= 0) {
      const feed = state.feeds[tag].topics[feedIndex]
      const commentIndex = _.findIndex(feed.posts, post => post.id === commentId)
      if (commentIndex < 0) {
        return state
      }
      const updatedComment = update (feed.posts[commentIndex], {
        isDeletingComment : { $set : true },
        error: { $set : false }
      })

      const updatedFeed = update(feed, { posts: { $splice: [[commentIndex, 1, updatedComment]] } })

      const feedUpdateQuery = {}
      feedUpdateQuery[tag] = { topics: { $splice: [[feedIndex, 1, updatedFeed]] } }
      return update (state, {
        error: { $set : false },
        feeds: feedUpdateQuery
      })
    }
    return state
  }
  case DELETE_PROJECT_FEED_COMMENT_SUCCESS: {
    const feedId = _.get(action, 'meta.feedId', null)
    const tag = _.get(action, 'meta.tag', null)
    const commentId = _.get(action, 'meta.commentId', null)
    // find feed index from the state
    const feedIndex = _.findIndex(state.feeds[tag].topics, feed => feed.id === feedId)
    if (feedIndex >= 0) {
      const feed = state.feeds[tag].topics[feedIndex]
      const postIds = _.filter(feed.postIds, p => p !== commentId)
      const posts = _.filter(feed.posts, p => p.id !== commentId)
      const updatedFeed = update (feed, {
        // no need to update hasMoreComments, it should maintain its prev value
        totalPosts: { $apply: n => n - 1},
        retrievedPosts: { $apply: n => n - 1 },
        postIds: { $set: postIds },
        posts: { $set : posts },
        error: { $set: false }
      })
      const feedUpdateQuery = {}
      feedUpdateQuery[tag] = { topics: { $splice: [[feedIndex, 1, updatedFeed]] } }
      // update the state
      return update (state, {
        feeds: feedUpdateQuery
      })
    }
    return state
  }
  case DELETE_PROJECT_FEED_COMMENT_FAILURE: {
    const feedId = _.get(action, 'meta.feedId', null)
    const tag = _.get(action, 'meta.tag', null)
    const commentId = _.get(action, 'meta.commentId', null)
    if (!feedId || !commentId) return state
    // find feed index from the state
    const feedIndex = _.findIndex(state.feeds[tag].topics, feed => feed.id === feedId)
    if (feedIndex >= 0) {
      const feed = state.feeds[tag].topics[feedIndex]
      const commentIndex = _.findIndex(feed.posts, post => post.id === commentId)
      if (commentIndex < 0) {
        return state
      }
      const updatedComment = update (feed.posts[commentIndex], {
        isDeletingComment : { $set : false },
        error: { $set : true }
      })

      const updatedFeed = update(feed, { posts: { $splice: [[commentIndex, 1, updatedComment]] } })
      const feedUpdateQuery = {}
      feedUpdateQuery[tag] = { topics: { $splice: [[feedIndex, 1, updatedFeed]] } }

      return update (state, {
        error: { $set : false },
        feeds: feedUpdateQuery
      })
    }
    return state
  }
  case GET_PROJECT_FEED_COMMENT_PENDING: {
    const feedId = _.get(action, 'meta.feedId', null)
    const tag = _.get(action, 'meta.tag', null)
    const commentId = _.get(action, 'meta.commentId', null)
    if (!feedId || !commentId) return state
    // find feed index from the state
    const feedIndex = _.findIndex(state.feeds[tag].topics, feed => feed.id === feedId)
    if (feedIndex >= 0) {
      const feed = state.feeds[tag].topics[feedIndex]
      const commentIndex = _.findIndex(feed.posts, post => post.id === commentId)
      if (commentIndex < 0) {
        return state
      }
      const updatedComment = update (feed.posts[commentIndex], {
        isGettingComment : { $set : true },
        error: { $set : false }
      })

      const updatedFeed = update(feed, { posts: { $splice: [[commentIndex, 1, updatedComment]] } })

      const feedUpdateQuery = {}
      feedUpdateQuery[tag] = { topics: { $splice: [[feedIndex, 1, updatedFeed]] } }
      return update (state, {
        error: { $set : false },
        feeds: feedUpdateQuery
      })
    }
    return state
  }
  case GET_PROJECT_FEED_COMMENT_SUCCESS: {
    const feedId = _.get(action, 'meta.feedId', null)
    const tag = _.get(action, 'meta.tag', null)
    const commentId = _.get(action, 'meta.commentId', null)
    const comment = payload.comment
    if (!feedId || !commentId) return state
    // find feed index from the state
    const feedIndex = _.findIndex(state.feeds[tag].topics, feed => feed.id === feedId)
    if (feedIndex >= 0) {
      const feed = state.feeds[tag].topics[feedIndex]
      const commentIndex = _.findIndex(feed.posts, post => post.id === commentId)
      if (commentIndex < 0) {
        return state
      }
      const updatedComment = update(feed.posts[commentIndex], {
        isGettingComment : { $set : false },
        error: { $set : false },
        body: { $set : comment.body },
        rawContent: { $set : comment.rawContent }
      })

      const updatedFeed = update(feed, { posts: { $splice: [[commentIndex, 1, updatedComment]] } })
      const feedUpdateQuery = {}
      feedUpdateQuery[tag] = { topics: { $splice: [[feedIndex, 1, updatedFeed]] } }
      return update (state, {
        error: { $set : false },
        feeds: feedUpdateQuery
      })
    }
    return state
  }
  case GET_PROJECT_FEED_COMMENT_FAILURE: {
    const feedId = _.get(action, 'meta.feedId', null)
    const tag = _.get(action, 'meta.tag', null)
    const commentId = _.get(action, 'meta.commentId', null)
    if (!feedId || !commentId) return state
    // find feed index from the state
    const feedIndex = _.findIndex(state.feeds[tag].topics, feed => feed.id === feedId)
    if (feedIndex >= 0) {
      const feed = state.feeds[tag].topics[feedIndex]
      const commentIndex = _.findIndex(feed.posts, post => post.id === commentId)
      if (commentIndex < 0) {
        return state
      }
      const updatedComment = update (feed.posts[commentIndex], {
        isGettingComment : { $set : false },
        error: { $set : true }
      })

      const updatedFeed = update(feed, { posts: { $splice: [[commentIndex, 1, updatedComment]] } })
      const feedUpdateQuery = {}
      feedUpdateQuery[tag] = { topics: { $splice: [[feedIndex, 1, updatedFeed]] } }

      return update (state, {
        error: { $set : false },
        feeds: feedUpdateQuery
      })
    }
    return state
  }

  default:
    return state
  }
}
