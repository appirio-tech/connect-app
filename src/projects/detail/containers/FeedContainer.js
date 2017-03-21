import React, { PropTypes } from 'react'
import { withRouter } from 'react-router'
import _ from 'lodash'
import {
  THREAD_MESSAGES_PAGE_SIZE,
  PROJECT_STATUS_DRAFT,
  PROJECT_ROLE_CUSTOMER,
  PROJECT_ROLE_COPILOT,
  PROJECT_ROLE_MANAGER,
  PROJECT_FEED_TYPE_PRIMARY,
  DISCOURSE_BOT_USERID,
  CODER_BOT_USERID,
  CODER_BOT_USER_FNAME,
  CODER_BOT_USER_LNAME,
  CONNECT_USER_FNAME,
  CONNECT_USER_LNAME
} from '../../../config/constants'
import { connect } from 'react-redux'
import update from 'react-addons-update'
import NewPost from '../../../components/Feed/NewPost'
import Feed from '../../../components/Feed/Feed'
import ProjectSpecification from '../../../components/ProjectSpecification/ProjectSpecification'
import { loadDashboardFeeds, createProjectTopic, loadFeedComments, addFeedComment } from '../../actions/projectTopics'
import spinnerWhileLoading from '../../../components/LoadingSpinner'

const SYSTEM_USER = {
  firstName: CODER_BOT_USER_FNAME,
  lastName: CODER_BOT_USER_LNAME,
  photoURL: require('../../../assets/images/avatar-coder.png')
}
const CONNECT_USER = {
  firstName: CONNECT_USER_FNAME,
  lastName: CONNECT_USER_LNAME,
  photoURL: require('../../../assets/images/avatar-coder.png')//TODO replace icon
}
const isSystemUser = (userId) => [DISCOURSE_BOT_USERID, CODER_BOT_USERID].indexOf(userId) > -1


class FeedView extends React.Component {

  constructor(props) {
    super(props)
    this.onNewPost = this.onNewPost.bind(this)
    this.onNewCommentChange = this.onNewCommentChange.bind(this)
    this.onShowAllComments = this.onShowAllComments.bind(this)
    this.onAddNewComment = this.onAddNewComment.bind(this)
    this.onLeave = this.onLeave.bind(this)
    this.isChanged = this.isChanged.bind(this)
    this.onNewPostChange = this.onNewPostChange.bind(this)
    this.state = { feeds : [], showAll: [], newPost: {} }
  }

  componentDidMount() {
    const routeLeaveHook = this.props.router.setRouteLeaveHook(this.props.route, this.onLeave)
    window.addEventListener('beforeunload', this.onLeave)
    this.setState({ routeLeaveHook })
  }

  componentWillMount() {
    this.init(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.init(nextProps, this.props)
  }

  componentWillUnmount() {
    if (this.state.routeLeaveHook) {
      this.state.routeLeaveHook()
    }
    window.removeEventListener('beforeunload', this.onLeave)
  }

  // Notify user if they navigate away while the form is modified.
  onLeave(e) {
    if (this.isChanged()) {
      return e.returnValue = 'You have uposted content. Are you sure you want to leave?'
    }
  }

  isChanged() {
    const { newPost } = this.state
    const hasComment = !_.isUndefined(_.find(this.state.feeds, (feed) => feed.newComment && feed.newComment.length))
    const hasThread = (newPost.title && !!newPost.title.trim().length) || ( newPost.content && !!newPost.content.trim().length)
    return hasThread || hasComment
  }

  mapFeed(feed, showAll = false, resetNewComment = false) {
    const { allMembers } = this.props
    const item = _.pick(feed, ['id', 'date', 'read', 'tag', 'title', 'totalPosts', 'userId', 'reference', 'referenceId', 'postIds', 'isAddingComment', 'isLoadingComments', 'error'])
    // Github issue##623, allow comments on all posts (including system posts)
    item.allowComments = true
    if (!item.userId) {
      item.user = CONNECT_USER
    } else if (isSystemUser(item.userId)) {
      item.user = SYSTEM_USER
    } else {
      item.user = allMembers[item.userId]
    }
    item.unread = !feed.read
    // item.html = posts[feed.postIds[0]].body
    item.html = feed.posts[0].body
    // skip over the first post since that is the topic post
    item.totalComments = feed.totalPosts-1
    item.comments = []
    const _toComment = (p) => {
      let author = CONNECT_USER
      if (p.userId) {
        author = isSystemUser(p.userId) ? SYSTEM_USER : allMembers[p.userId]
      }
      return {
        id: p.id,
        content: p.body,
        unread: !p.read,
        date: p.date,
        author
      }
    }
    const validPost = (post) => {
      return post.type === 'post' && (post.body && post.body.trim().length || !isSystemUser(post.userId))
    }
    if (showAll) {
      // if we are showing all comments, just iterate through the entire array
      _.forEach(_.slice(feed.posts, 1), p => {
        validPost(p) ? item.comments.push(_toComment(p)) : item.totalComments--
      })
    } else {
      // otherwise iterate from right and add to the beginning of the array
      _.forEachRight(_.slice(feed.posts, 1), (p) => {
        validPost(p) ? item.comments.unshift(_toComment(p)) : item.totalComments--
        if (!feed.showAll && item.comments.length === THREAD_MESSAGES_PAGE_SIZE)
          return false
      })
    }
    item.newComment = ''
    if (!resetNewComment) {
      const feedFromState = _.find(this.state.feeds, f => feed.id === f.id)
      item.newComment = feedFromState ? feedFromState.newComment : ''
    }
    item.hasMoreComments = item.comments.length !== item.totalComments
    return item
  }

  init(props, prevProps) {
    const { feeds } = props
    let resetNewPost = false
    if (prevProps) {
      resetNewPost = prevProps.isCreatingFeed && !props.isCreatingFeed && !props.error
    }
    this.setState({
      newPost: resetNewPost ? {} : this.state.newPost,
      feeds: feeds.map((feed) => {
        // finds the same feed from previous props, if exists
        let prevFeed
        if (prevProps && prevProps.feeds) {
          prevFeed = _.find(prevProps.feeds, f => feed.id === f.id)
        }
        // reset new comment if we were adding comment and there is no error in doing so
        const resetNewComment = prevFeed && prevFeed.isAddingComment && !feed.isAddingComment && !feed.error
        return this.mapFeed(feed, this.state.showAll.indexOf(feed.id) > -1, resetNewComment)
      }).filter(item => item)
    })
  }

  onNewPostChange(title, content) {
    this.setState({
      newPost: {title, content}
    })
  }

  onNewPost({title, content}) {
    const { project } = this.props
    const newFeed = {
      title,
      body: content,
      tag: PROJECT_FEED_TYPE_PRIMARY
    }
    this.props.createProjectTopic(project.id, newFeed)
  }

  onNewCommentChange(feedId, content) {
    this.setState({
      feeds: this.state.feeds.map((item) => {
        if (item.id === feedId) {
          return {...item, newComment: content}
        }
        return item
      })
    })
  }

  onShowAllComments(feedId) {
    const { feeds } = this.props
    const feed = _.find(feeds, feed => feed.id === feedId)
    const stateFeedIdx = _.findIndex(this.state.feeds, (f) => f.id === feedId)
    // in case we have already have all comments for that feed from the server,
    // just change the state to show all comments for that FeedId.
    // Otherwise load more comments from the server
    if (feed.posts.length < feed.postIds.length) {
      // load more from server
      const updatedFeed = update(this.state.feeds[stateFeedIdx], {
        isLoadingComments: { $set : true }
      })
      const retrievedPostIds = _.map(feed.posts, 'id')
      const commentIdsToRetrieve = _.filter(feed.postIds, _id => retrievedPostIds.indexOf(_id) === -1 )
      this.setState(update(this.state, {
        showAll: { $push: [feedId] },
        feeds: { $splice: [[stateFeedIdx, 1, updatedFeed ]] }
      }))
      this.props.loadFeedComments(feedId, PROJECT_FEED_TYPE_PRIMARY, commentIdsToRetrieve)
    } else {
      this.setState(update(this.state, {
        showAll: { $push: [feedId] },
        feeds: { $splice: [[stateFeedIdx, 1, this.mapFeed(feed, true) ]] }
      }))
    }
  }

  onAddNewComment(feedId, content) {
    const { currentUser } = this.props
    const newComment = {
      date: new Date(),
      userId: parseInt(currentUser.id),
      content
    }
    this.props.addFeedComment(feedId, PROJECT_FEED_TYPE_PRIMARY, newComment)
  }

  render () {
    const {currentUser, project, currentMemberRole, isCreatingFeed, error } = this.props
    const { feeds } = this.state
    const showDraftSpec = project.status === PROJECT_STATUS_DRAFT && currentMemberRole === PROJECT_ROLE_CUSTOMER
    const renderComposer = currentMemberRole === PROJECT_ROLE_COPILOT || currentMemberRole === PROJECT_ROLE_MANAGER

    const renderFeed = (item) => {
      if ((item.spec || item.sendForReview) && !showDraftSpec) {
        return null
      }
      return (
        <div className="feed-action-card" key={item.id}>
          <Feed
            {...item}
            allowComments={ item.allowComments && !!currentMemberRole}
            currentUser={currentUser}
            onNewCommentChange={this.onNewCommentChange.bind(this, item.id)}
            onAddNewComment={this.onAddNewComment.bind(this, item.id)}
            onLoadMoreComments={this.onShowAllComments.bind(this, item.id)}
          >
            {item.sendForReview && <div className="panel-buttons">
              <button className="tc-btn tc-btn-primary tc-btn-md">Send for review</button>
            </div>}
          </Feed>
          {item.spec && <ProjectSpecification project={ project } currentMemberRole={ currentMemberRole } />  }
        </div>
      )
    }
    return (
      <div>
        { renderComposer &&
          <NewPost
            currentUser={currentUser}
            onPost={this.onNewPost}
            isCreating={ isCreatingFeed }
            hasError={ error }
            heading="NEW STATUS POST"
            onNewPostChange={this.onNewPostChange}
            titlePlaceholder="Share the latest project updates with the team"
          />
        }
        { feeds.map(renderFeed) }
      </div>
    )
  }
}
const enhance = spinnerWhileLoading(props => !props.isLoading)
const EnhancedFeedView = withRouter(enhance(FeedView))


class FeedContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.loadDashboardFeeds(this.props.project.id)
  }

  render() {
    return <EnhancedFeedView {...this.props} />
  }
}

FeedContainer.PropTypes = {
  currentMemberRole: PropTypes.string,
  project: PropTypes.object.isRequired
}

const mapStateToProps = ({ projectTopics, members, loadUser }) => {
  return {
    currentUser    : loadUser.user,
    feeds          : projectTopics.feeds[PROJECT_FEED_TYPE_PRIMARY].topics,
    feedTotalCount : projectTopics.feeds[PROJECT_FEED_TYPE_PRIMARY].totalCount,
    isLoading      : projectTopics.isLoading,
    isCreatingFeed : projectTopics.isCreatingFeed,
    error          : projectTopics.error,
    allMembers     : members.members
  }
}
const mapDispatchToProps = {
  loadDashboardFeeds,
  createProjectTopic,
  loadFeedComments,
  addFeedComment
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedContainer)
