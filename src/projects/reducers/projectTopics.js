import _ from 'lodash'
import {
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
  feeds: {},
  totalFeeds: 0
}

export const projectTopics = function (state=initialState, action) {
  const payload = action.payload

  switch (action.type) {
  case LOAD_PROJECT_FEEDS_MEMBERS_PENDING:
  case LOAD_PROJECT_FEEDS_PENDING:
    return Object.assign({}, state, {
      feeds: {}, //empty the feeds so that switching between projects doesn't show wrong feeds
      isLoading: true,
      error: false
    })
  case LOAD_PROJECT_FEEDS_SUCCESS:// DO NOT alter state until we get all members loaded
    return state
  case LOAD_PROJECT_FEEDS_MEMBERS_SUCCESS:
    return Object.assign({}, state, {
      isLoading: false,
      error: true,
      feeds: { PRIMARY : payload.topics },
      totalFeeds: payload.totalCount
    })
  case LOAD_PROJECT_FEEDS_MEMBERS_FAILURE:
  case LOAD_PROJECT_FEEDS_FAILURE:
    return Object.assign({}, state, {
      feeds: { PRIMARY : [] },
      isLoading: false,
      error: true
    })
  case CREATE_PROJECT_FEED_PENDING:
    return Object.assign({}, state, {
      isCreatingFeed: true,
      error: false
    })
  case CREATE_PROJECT_FEED_SUCCESS: {
    const feed = payload
    if (!feed) {
      return update (state, {
        isCreatingFeed: { $set : false },
        error: { $set : true }
      })
    }
    feed.posts = feed.posts || []
    return update (state, {
      isCreatingFeed: { $set : false },
      error: { $set : false },
      feeds: { PRIMARY : { $splice: [[0, 0, feed]] } }
    })
  }
  case CREATE_PROJECT_FEED_FAILURE:
    return Object.assign({}, state, {
      isCreatingFeed: false,
      error: false
    })
  case LOAD_PROJECT_FEED_COMMENTS_PENDING:
    return state
  case LOAD_PROJECT_FEED_COMMENTS_SUCCESS: {//NOT being used until we have pagination for comments
    const feedId = payload.topicId
    // find feed index from the state
    const feedIndex = _.findIndex(state.feeds['PRIMARY'], feed => feed.id === feedId)
    // if we find the feed
    if (feedIndex >= 0) {
      const feed = state.feeds['PRIMARY'][feedIndex]
      // number of posts those would be rendered after this state update
      const noOfRenderedPosts = feed.posts.length + payload.posts.length
      // updates feed, pushes the new posts into posts array of the feed
      const updatedFeed = update(feed, {
        hasMoreComments: { $set : payload.totalCount > noOfRenderedPosts },
        totalComments: { $set : payload.totalCount },
        posts: { $push : payload.posts }
      })
      // update the state
      return update (state, {
        feeds: { PRIMARY : { $splice: [[feedIndex, 1, updatedFeed]] } }
      })
    }
    return state
  }
  case LOAD_PROJECT_FEED_COMMENTS_FAILURE:
    return state
  case CREATE_PROJECT_FEED_COMMENT_PENDING: {
    const feedId = _.get(action, 'meta.feedId', null)
    if (!feedId) return state
    // find feed index from the state
    const feedIndex = _.findIndex(state.feeds['PRIMARY'], feed => feed.id === feedId)
    if (feedIndex >= 0) {
      const feed = state.feeds['PRIMARY'][feedIndex]
      const updatedFeed = update (feed, {
        isAddingComment : { $set : true }
      })
      return update (state, {
        error: { $set : false },
        feeds: { PRIMARY : { $splice: [[feedIndex, 1, updatedFeed]] } }
      })
    }
    return state
  }
  case CREATE_PROJECT_FEED_COMMENT_SUCCESS: {
    const feedId = payload.topicId
    const comment = payload.comment
    // find feed index from the state
    const feedIndex = _.findIndex(state.feeds['PRIMARY'], feed => feed.id === feedId)
    if (feedIndex >= 0) {
      const feed = state.feeds['PRIMARY'][feedIndex]
      const totalComments = feed.totalComments + 1
      const updatedFeed = update (feed, {
        // no need to update hasMoreComments, it should maintain its prev value
        totalComments: { $set : totalComments },
        posts: { $push : [ comment ] },
        isAddingComment : { $set : false }
      })
      // update the state
      return update (state, {
        feeds: { PRIMARY : { $splice: [[feedIndex, 1, updatedFeed]] } }
      })
    }
    return state
  }
  case CREATE_PROJECT_FEED_COMMENT_FAILURE: {
    const feedId = _.get(action, 'meta.feedId', null)
    if (!feedId) return state
    // find feed index from the state
    const feedIndex = _.findIndex(state.feeds['PRIMARY'], feed => feed.id === feedId)
    if (feedIndex >= 0) {
      const feed = state.feeds['PRIMARY'][feedIndex]
      const updatedFeed = update (feed, {
        isAddingComment : { $set : false }
      })
      return update (state, {
        error: { $set : false },
        feeds: { PRIMARY : { $splice: [[feedIndex, 1, updatedFeed]] } }
      })
    }
    return state
  }

  default:
    return state
  }
}
