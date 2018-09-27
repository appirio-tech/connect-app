/**
 * Container for Dashboard Posts Section
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Prompt } from 'react-router-dom'
import _ from 'lodash'
import {
  THREAD_MESSAGES_PAGE_SIZE,
  PROJECT_FEED_TYPE_PRIMARY,
  SCREEN_BREAKPOINT_MD,
  CODER_BOT_USER_FNAME,
  CODER_BOT_USER_LNAME,
  CONNECT_USER,
} from '../../../config/constants'
import { connect } from 'react-redux'
import update from 'react-addons-update'
import NewPost from '../../../components/Feed/NewPost'

import { loadDashboardFeeds, createProjectTopic, saveProjectTopic, deleteProjectTopic, loadFeedComments, addFeedComment, saveFeedComment, deleteFeedComment, getFeedComment } from '../../actions/projectTopics'
import { toggleNotificationRead } from '../../../routes/notifications/actions'
import spinnerWhileLoading from '../../../components/LoadingSpinner'
import PostsRefreshPrompt from '../components/PostsRefreshPrompt'

import MediaQuery from 'react-responsive'
import ChatButton from '../../../components/ChatButton/ChatButton'
import NewPostMobile from '../../../components/Feed/NewPostMobile'
import ScrollableFeed from '../../../components/Feed/ScrollableFeed'
import FullscreenFeedContainer from '../containers/FullscreenFeedContainer'
import Section from '../components/Section'
import SectionTitle from '../components/SectionTitle'

import { scrollToHash } from '../../../components/ScrollToAnchors'
import { isSystemUser } from '../../../helpers/tcHelpers'

import './FeedContainer.scss'

const SYSTEM_USER = {
  firstName: CODER_BOT_USER_FNAME,
  lastName: CODER_BOT_USER_LNAME,
  photoURL: require('../../../assets/images/avatar-coder.svg')
}

class FeedView extends React.Component {

  constructor(props) {
    super(props)
    this.onNewPost = this.onNewPost.bind(this)
    this.onNewCommentChange = this.onNewCommentChange.bind(this)
    this.onShowAllComments = this.onShowAllComments.bind(this)
    this.onAddNewComment = this.onAddNewComment.bind(this)
    this.onNewPostChange = this.onNewPostChange.bind(this)
    this.onEditMessage = this.onEditMessage.bind(this)
    this.onSaveMessageChange = this.onSaveMessageChange.bind(this)
    this.onEditTopic = this.onEditTopic.bind(this)
    this.onTopicChange = this.onTopicChange.bind(this)
    this.toggleNewPostMobile = this.toggleNewPostMobile.bind(this)
    this.enterFullscreen = this.enterFullscreen.bind(this)
    this.exitFullscreen = this.exitFullscreen.bind(this)
    this.state = {
      feeds : [],
      showAll: [],
      newPost: {},
      isNewPostMobileOpen: false,
      fullscreenFeedId: null,
    }
  }

  componentWillMount() {
    this.init(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.init(nextProps, this.props)
  }

  toggleNewPostMobile() {
    this.setState({ isNewPostMobileOpen: !this.state.isNewPostMobileOpen })
  }

  mapFeed(feed, showAll = false, resetNewComment = false) {
    const { allMembers, project, currentMemberRole } = this.props
    const item = _.pick(feed, ['id', 'date', 'read', 'tag', 'title', 'totalPosts', 'userId', 'reference', 'referenceId', 'postIds', 'isSavingTopic', 'isDeletingTopic', 'isAddingComment', 'isLoadingComments', 'error'])
    // Github issue##623, allow comments on all posts (including system posts)
    item.allowComments = true
    if (isSystemUser(item.userId)) {
      item.user = SYSTEM_USER
    } else {
      item.user = allMembers[item.userId]
    }
    item.unread = !feed.read && !!currentMemberRole
    item.totalComments = feed.totalPosts
    item.comments = []
    // CODE NOT NEEDED ANYMORE
    // let prevFeed = null
    // if (prevProps) {
    //   prevFeed = _.find(prevProps.feeds, t => feed.id === t.id)
    // }
    const _toComment = (p) => {
      const date = p.updatedDate?p.updatedDate:p.date
      const edited = date !== p.date
      const commentAuthor = allMembers[p.userId] ? allMembers[p.userId] : { ...CONNECT_USER, userId: p.userId }
      const comment = {
        id: p.id,
        content: p.body,
        rawContent: p.rawContent,
        isGettingComment: p.isGettingComment,
        isSavingComment: p.isSavingComment,
        isDeletingComment: p.isDeletingComment,
        error: p.error,
        unread: !p.read && !!currentMemberRole,
        date,
        createdAt: p.date,
        edited,
        author: isSystemUser(p.userId) ? SYSTEM_USER : commentAuthor
      }
      // CODE NOT NEEDED ANYMORE
      // const prevComment = prevFeed ? _.find(prevFeed.posts, t => p.id === t.id) : null
      // if (prevComment && prevComment.isSavingComment && !comment.isSavingComment && !comment.error) {
      //   comment.editMode = false
      // } else {
      //   const feedFromState = _.find(this.state.feeds, t => feed.id === t.id)
      //   const commentFromState = feedFromState ? _.find(feedFromState.comments, t => comment.id === t.id) : null
      //   comment.newContent = commentFromState ? commentFromState.newContent : null
      //   comment.editMode = commentFromState && commentFromState.editMode
      // }
      return comment
    }
    item.topicMessage = _toComment(feed.posts[0])
    // CODE NOT NEEDED ANYMORE
    // if (prevFeed && prevFeed.isSavingTopic && !feed.isSavingTopic && !feed.error) {
    //   item.editTopicMode = false
    // } else {
    //   const feedFromState = _.find(this.state.feeds, t => feed.id === t.id)
    //   item.newTitle = feedFromState ? feedFromState.newTitle : null
    //   item.topicMessage.newContent = feedFromState ? feedFromState.topicMessage.newContent : null
    //   item.editTopicMode = feedFromState && feedFromState.editTopicMode
    // }

    const validPost = (post) => {
      return post.type === 'post' && (post.body && post.body.trim().length || !isSystemUser(post.userId))
    }
    if (showAll) {
      // if we are showing all comments, just iterate through the entire array
      _.forEach(feed.posts, p => {
        validPost(p) ? item.comments.push(_toComment(p)) : item.totalComments--
      })
    } else {
      // otherwise iterate from right and add to the beginning of the array
      _.forEachRight(feed.posts, (p) => {
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
    // adds permalink for the feed
    // item.permalink = `/projects/${project.id}/status/${item.id}`
    item.permalink = `/projects/${project.id}#feed-${item.id}`
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
    }, () => {
      if (prevProps) {
        // only scroll at first time
        return
      }
      const scrollTo = window.location.hash ? window.location.hash.substring(1) : null
      if (scrollTo) {
        scrollToHash(scrollTo)
      }
    })
  }

  onNewPostChange(title, content) {
    const isChanged = !!((title && title.trim().length) || (content && content.trim().length))

    this.props.newPostChanges(isChanged)
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
    const isChanged = !!(content && content.trim().length)

    this.props.newCommentChanges(feedId, isChanged)
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

    this.props.newCommentChanges(feedId, false)
  }

  onSaveMessageChange(feedId, messageId, content) {
    const feed = _.find(this.state.feeds, { id: feedId })
    const isChanged = feed && !_.find(feed.comments, { id: messageId, content })

    this.props.messageChanges(messageId, isChanged)
  }

  onSaveMessage(feedId, message, content) {
    const newMessage = {...message}
    newMessage.content = content
    this.props.saveFeedComment(feedId, PROJECT_FEED_TYPE_PRIMARY, newMessage)

    this.props.messageChanges(message.id, false)
  }

  onDeleteMessage(feedId, postId) {
    this.props.deleteFeedComment(feedId, PROJECT_FEED_TYPE_PRIMARY, postId)
  }

  onEditMessage(feedId, postId) {
    const thread = _.find(this.state.feeds, t => feedId === t.id)
    const comment = _.find(thread.comments, message => message.id === postId)
    if (!comment.rawContent) {
      this.props.getFeedComment(feedId, PROJECT_FEED_TYPE_PRIMARY, postId)
    }
  }

  onEditTopic(feedId) {
    const thread = _.find(this.state.feeds, t => feedId === t.id)
    const comment = thread.topicMessage
    if (!comment.rawContent) {
      this.props.getFeedComment(feedId, PROJECT_FEED_TYPE_PRIMARY, comment.id)
    }
  }

  onTopicChange(feedId, messageId, title) {
    const isChanged = !_.find(this.state.feeds, { id: feedId, title })

    this.props.topicChanges(feedId, isChanged)
  }

  onSaveTopic(feedId, postId, title, content) {
    this.props.saveProjectTopic(feedId, PROJECT_FEED_TYPE_PRIMARY, {postId, title, content})

    this.props.topicChanges(feedId, false)
  }

  onDeleteTopic(feedId) {
    this.props.deleteProjectTopic(feedId, PROJECT_FEED_TYPE_PRIMARY)
  }

  enterFullscreen(feedId) {
    this.setState({ fullscreenFeedId: feedId })
  }

  exitFullscreen() {
    this.setState({ fullscreenFeedId: null })
  }

  render () {
    const {currentUser, currentMemberRole, isCreatingFeed, error, allMembers, isSuperUser } = this.props
    const { feeds, isNewPostMobileOpen, fullscreenFeedId } = this.state
    const fullscreenFeed = fullscreenFeedId && _.find(feeds, { id: fullscreenFeedId })

    return (
      <div>
        {fullscreenFeed && (
          <FullscreenFeedContainer
            currentMemberRole={currentMemberRole}
            isSuperUser={isSuperUser}
            feeds={feeds}
            onCloseClick={this.exitFullscreen}
            activeFeedId={fullscreenFeedId}
            onChannelClick={(feed) => {
              this.enterFullscreen(feed.id)
            }}
          >
            <ScrollableFeed
              {...{
                ...fullscreenFeed,
                id: fullscreenFeedId.toString(),
                allowComments: fullscreenFeed.allowComments && !!currentMemberRole,
                currentUser,
                allMembers,
                onNewCommentChange: this.onNewCommentChange.bind(this, fullscreenFeedId),
                onAddNewComment: this.onAddNewComment.bind(this, fullscreenFeedId),
                onLoadMoreComments: this.onShowAllComments.bind(this, fullscreenFeedId),
                onEditMessage: this.onEditMessage.bind(this, fullscreenFeedId),
                onSaveMessageChange: this.onSaveMessageChange.bind(this, fullscreenFeedId),
                onSaveMessage: this.onSaveMessage.bind(this, fullscreenFeedId),
                onDeleteMessage: this.onDeleteMessage.bind(this, fullscreenFeedId),
                onEditTopic: this.onEditTopic.bind(this, fullscreenFeedId),
                onTopicChange: this.onTopicChange.bind(this, fullscreenFeedId),
                onSaveTopic: this.onSaveTopic.bind(this, fullscreenFeedId),
                onDeleteTopic: this.onDeleteTopic.bind(this, fullscreenFeedId),
                onExitFullscreenClick: this.exitFullscreen,
                isFullScreen: true,
              }}
            />
          </FullscreenFeedContainer>
        )}

        <Section>
          <SectionTitle title="Discussions" />
          <div>
            <MediaQuery minWidth={SCREEN_BREAKPOINT_MD}>
              <NewPost
                currentUser={currentUser}
                allMembers={allMembers}
                onPost={this.onNewPost}
                isCreating={isCreatingFeed}
                hasError={error}
                heading="NEW STATUS POST"
                onNewPostChange={this.onNewPostChange}
                titlePlaceholder="Start a new discussion"
                expandedTitlePlaceholder="Add your discussion title"
                contentPlaceholder="Add your first post"
              />
            </MediaQuery>
            {feeds.map((feed) => (
              <div styleName="feed-card" key={feed.id.toString()}>
                <ScrollableFeed
                  {...{
                    ...feed,
                    id: feed.id.toString(),
                    allowComments: feed.allowComments && !!currentMemberRole,
                    currentUser,
                    allMembers,
                    onNewCommentChange: this.onNewCommentChange.bind(this, feed.id),
                    onAddNewComment: this.onAddNewComment.bind(this, feed.id),
                    onLoadMoreComments: this.onShowAllComments.bind(this, feed.id),
                    onEditMessage: this.onEditMessage.bind(this, feed.id),
                    onSaveMessageChange: this.onSaveMessageChange.bind(this, feed.id),
                    onSaveMessage: this.onSaveMessage.bind(this, feed.id),
                    onDeleteMessage: this.onDeleteMessage.bind(this, feed.id),
                    onEditTopic: this.onEditTopic.bind(this, feed.id),
                    onTopicChange: this.onTopicChange.bind(this, feed.id),
                    onSaveTopic: this.onSaveTopic.bind(this, feed.id),
                    onDeleteTopic: this.onDeleteTopic.bind(this, feed.id),
                    onEnterFullscreenClick: this.enterFullscreen.bind(this, feed.id),
                  }}
                />
              </div>
            ))}
          </div>
        </Section>
        { !isNewPostMobileOpen && !fullscreenFeed &&
          <MediaQuery maxWidth={SCREEN_BREAKPOINT_MD - 1}>
            <div styleName="chat-button-space">
              <ChatButton onClick={this.toggleNewPostMobile} />
            </div>
          </MediaQuery>
        }
        { isNewPostMobileOpen &&
          <NewPostMobile
            statusTitle="NEW STATUS"
            commentTitle="WRITE POST"
            statusPlaceholder="Start a new discussion"
            commentPlaceholder="Add your first post"
            submitText="Post"
            nextStepText="Add post"
            onClose={this.toggleNewPostMobile}
            allMembers={allMembers}
            currentUser={currentUser}
            onPost={this.onNewPost}
            isCreating={isCreatingFeed}
            hasError={error}
            onNewPostChange={this.onNewPostChange}
          />
        }
      </div>
    )
  }
}
const enhance = spinnerWhileLoading(props => !props.isLoading)
const EnhancedFeedView = enhance(FeedView)

class FeedContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isNewPostChanged: false,
      isNewCommentChanged: {
        feedIds: new Set(),
        isChanged: false
      },
      isMessageChanged: {
        messageIds: new Set(),
        isChanged: false
      },
      isTopicChanged: {
        feedIds: new Set(),
        isChanged: false
      }
    }

    this.onLeave = this.onLeave.bind(this)
    this.onRefreshFeeds = this.onRefreshFeeds.bind(this)
    this.newPostChanges = this.newPostChanges.bind(this)
    this.newCommentChanges = this.newCommentChanges.bind(this)
    this.messageChanges = this.messageChanges.bind(this)
    this.topicChanges = this.topicChanges.bind(this)
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.onLeave)
  }

  componentWillMount() {
    this.props.loadDashboardFeeds(this.props.project.id)
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onLeave)
  }

  shouldComponentUpdate(nextProps) {
    if (!_.isEqual(this.props, nextProps)) {
      return true
    }
    return false
  }

  getChangedState() {
    const { isNewPostChanged, isNewCommentChanged, isMessageChanged, isTopicChanged } = this.state
    return isNewPostChanged || isNewCommentChanged.isChanged || isMessageChanged.isChanged || isTopicChanged.isChanged
  }


  isChanged() {
    let isChanged = !_.isUndefined(_.find(this.props.feeds, (feed) => (feed.isSavingTopic || feed.isDeletingTopic || feed.isAddingComment)
      || !_.isUndefined(_.find(feed.comments, (message) => message.isSavingComment || message.isDeletingComment))
    ))
    isChanged = isChanged || this.getChangedState()

    return isChanged
  }

  // Notify user if they navigate away while the form is modified.
  onLeave(e = {}) {
    if (this.isChanged()) {
      return e.returnValue = 'You haven\'t posted your message. If you leave this page, your message will not be saved. Are you sure you want to leave?'
    }
  }

  onRefreshFeeds() {
    this.props.loadDashboardFeeds(this.props.project.id)
  }

  newPostChanges(value) {
    this.setState({ isNewPostChanged: value })
  }

  newCommentChanges(feedId, value) {
    this.setState((prevState) => {
      const feedIds = prevState.isNewCommentChanged.feedIds
      if (value) {
        feedIds.add(feedId)
      } else {
        feedIds.delete(feedId)
      }
      const isChanged = feedIds.size > 0

      return {
        isNewCommentChanged: { feedIds, isChanged }
      }
    })
  }

  messageChanges(messageId, value) {
    this.setState((prevState) => {
      const messageIds = prevState.isMessageChanged.messageIds
      if (value) {
        messageIds.add(messageId)
      } else {
        messageIds.delete(messageId)
      }
      const isChanged = messageIds.size > 0

      return {
        isMessageChanged: { messageIds, isChanged }
      }
    })
  }

  topicChanges(feedId, value) {
    this.setState((prevState) => {
      const feedIds = prevState.isTopicChanged.feedIds
      if (value) {
        feedIds.add(feedId)
      } else {
        feedIds.delete(feedId)
      }
      const isChanged = feedIds.size > 0

      return {
        isTopicChanged: { feedIds, isChanged }
      }
    })
  }

  render() {
    const { toggleNotificationRead, notifications, project } = this.props
    const isChanged = this.isChanged()

    return (
      <div>
        <EnhancedFeedView
          {...this.props}
          newPostChanges={this.newPostChanges}
          newCommentChanges={this.newCommentChanges}
          messageChanges={this.messageChanges}
          topicChanges={this.topicChanges}
        />

        <PostsRefreshPrompt
          preventShowing={isChanged}
          toggleNotificationRead={toggleNotificationRead}
          refreshFeeds={this.onRefreshFeeds}
          notifications={notifications}
          projectId={project.id}
        />

        <Prompt
          when={!!this.onLeave}
          message={this.onLeave}
        />
      </div>
    )
  }
}

FeedContainer.PropTypes = {
  currentMemberRole: PropTypes.string,
  project: PropTypes.object.isRequired
}

const mapStateToProps = ({ projectTopics, members, loadUser, notifications }) => {
  return {
    currentUser    : loadUser.user,
    feeds          : projectTopics.feeds[PROJECT_FEED_TYPE_PRIMARY].topics,
    feedTotalCount : projectTopics.feeds[PROJECT_FEED_TYPE_PRIMARY].totalCount,
    isLoading      : projectTopics.isLoading,
    isCreatingFeed : projectTopics.isCreatingFeed,
    error          : projectTopics.error,
    allMembers     : members.members,
    notifications,
  }
}
const mapDispatchToProps = {
  loadDashboardFeeds,
  createProjectTopic,
  saveProjectTopic,
  deleteProjectTopic,
  loadFeedComments,
  addFeedComment,
  saveFeedComment,
  deleteFeedComment,
  getFeedComment,
  toggleNotificationRead,
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedContainer)
