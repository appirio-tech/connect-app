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
  LOAD_PROJECT_FEED_COMMENTS_PENDING,
  LOAD_PROJECT_FEED_COMMENTS_SUCCESS,
  LOAD_PROJECT_FEED_COMMENTS_FAILURE,
  CREATE_PROJECT_FEED_COMMENT_PENDING,
  CREATE_PROJECT_FEED_COMMENT_SUCCESS,
  CREATE_PROJECT_FEED_COMMENT_FAILURE
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
    if (!tag) return state
    const feed = payload
    if (!feed) {
      return update (state, {
        isCreatingFeed: { $set : false },
        error: { $set : true }
      })
    }
    feed.posts = feed.posts || []
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
    const comment = payload.comment
    // find feed index from the state
    const feedIndex = _.findIndex(state.feeds[tag].topics, feed => feed.id === feedId)
    if (feedIndex >= 0) {
      const feed = state.feeds[tag].topics[feedIndex]
      const updatedFeed = update (feed, {
        // no need to update hasMoreComments, it should maintain its prev value
        totalPosts: { $apply: n => n + 1},
        retrievedPosts: { $apply: n => n+1 },
        postIds: { $push: [comment.id] },
        posts: { $push : [ comment ] },
        isAddingComment : { $set : false },
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

  default:
    return state
  }
}
