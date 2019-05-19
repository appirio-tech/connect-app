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
  PROJECT_FEED_TYPE_MESSAGES,
  SCREEN_BREAKPOINT_MD,
  CODER_BOT_USER_FNAME,
  CODER_BOT_USER_LNAME,
  CONNECT_USER,
} from '../../../config/constants'
import { connect } from 'react-redux'
import update from 'react-addons-update'
import NewPost from '../../../components/Feed/NewPost'

import { loadDashboardFeeds, loadProjectMessages, createProjectTopic, saveProjectTopic, deleteProjectTopic, loadFeedComments,
  addFeedComment, saveFeedComment, deleteFeedComment, getFeedComment } from '../../actions/projectTopics'
import { toggleNotificationRead } from '../../../routes/notifications/actions'
import spinnerWhileLoading from '../../../components/LoadingSpinner'
import PostsRefreshPrompt from '../components/PostsRefreshPrompt'

import MediaQuery from 'react-responsive'
import ChatButton from '../../../components/ChatButton/ChatButton'
import NewPostMobile from '../../../components/Feed/NewPostMobile'
import FullscreenFeedContainer from '../containers/FullscreenFeedContainer'
import Section from '../components/Section'
import SectionTitle from '../components/SectionTitle'
import SingleFeedContainer from './SingleFeedContainer'

import { scrollToHash } from '../../../components/ScrollToAnchors'
import { isSystemUser } from '../../../helpers/tcHelpers'
import { checkPermission } from '../../../helpers/permissions'
import PERMISSIONS from '../../../config/permissions'

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
    this.onLeave = this.onLeave.bind(this)
    this.isChanged = this.isChanged.bind(this)
    this.onNewPostChange = this.onNewPostChange.bind(this)
    this.onEditMessage = this.onEditMessage.bind(this)
    this.onSaveMessageChange = this.onSaveMessageChange.bind(this)
    this.onSaveMessage = this.onSaveMessage.bind(this)
    this.onDeleteMessage = this.onDeleteMessage.bind(this)
    this.onSaveTopic = this.onSaveTopic.bind(this)
    this.onDeleteTopic = this.onDeleteTopic.bind(this)
    this.onEditTopic = this.onEditTopic.bind(this)
    this.onTopicChange = this.onTopicChange.bind(this)
    this.onRefreshFeeds = this.onRefreshFeeds.bind(this)
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

  componentDidMount() {
    window.addEventListener('beforeunload', this.onLeave)
  }

  componentWillMount() {
    this.init(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.init(nextProps, this.props)
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onLeave)
  }

  // Notify user if they navigate away while the form is modified.
  onLeave(e = {}) {
    if (this.isChanged()) {
      return e.returnValue = 'You haven\'t posted your message. If you leave this page, your message will not be saved. Are you sure you want to leave?'
    }
  }

  toggleNewPostMobile() {
    this.setState({ isNewPostMobileOpen: !this.state.isNewPostMobileOpen })
  }

  isChanged() {
    const { newPost } = this.state
    const hasComment = !_.isUndefined(_.find(this.state.feeds, (feed) => (feed.isSavingTopic || feed.isDeletingTopic || feed.isAddingComment)
      || (feed.newComment && feed.newComment.length)
      || (feed.newTitle && feed.newTitle.length && feed.newTitle !== feed.title)
      || (feed.topicMessage && feed.topicMessage.newContent && feed.topicMessage.newContent.length && feed.topicMessage.rawContent && feed.topicMessage.newContent !== feed.topicMessage.rawContent)
      || !_.isUndefined(_.find(feed.comments, (message) => message.isSavingComment || message.isDeletingComment || (message.newContent && message.newContent.length && message.rawContent && message.newContent !== message.rawContent)))
    ))
    const hasThread = (newPost.title && !!newPost.title.trim().length) || ( newPost.content && !!newPost.content.trim().length)
    return hasThread || hasComment
  }

  mapFeed(feed, showAll = false, resetNewComment = false, prevProps) {
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
    let prevFeed = null
    if (prevProps) {
      prevFeed = _.find(prevProps.feeds, t => feed.id === t.id)
    }
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
        author: isSystemUser(p.userId) ? SYSTEM_USER : commentAuthor,
        attachments: p.attachments || []
      }
      const prevComment = prevFeed ? _.find(prevFeed.posts, t => p.id === t.id) : null
      if (prevComment && prevComment.isSavingComment && !comment.isSavingComment && !comment.error) {
        comment.editMode = false
      } else {
        const feedFromState = _.find(this.state.feeds, t => feed.id === t.id)
        const commentFromState = feedFromState ? _.find(feedFromState.comments, t => comment.id === t.id) : null
        comment.newContent = commentFromState ? commentFromState.newContent : null
        comment.editMode = commentFromState && commentFromState.editMode
      }
      return comment
    }
    item.topicMessage = _toComment(feed.posts[0])
    if (prevFeed && prevFeed.isSavingTopic && !feed.isSavingTopic && !feed.error) {
      item.editTopicMode = false
    } else {
      const feedFromState = _.find(this.state.feeds, t => feed.id === t.id)
      item.newTitle = feedFromState ? feedFromState.newTitle : null
      item.topicMessage.newContent = feedFromState ? feedFromState.topicMessage.newContent : null
      item.editTopicMode = feedFromState && feedFromState.editTopicMode
    }

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
        return this.mapFeed(feed, this.state.showAll.indexOf(feed.id) > -1, resetNewComment, prevProps)
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
    this.setState({
      newPost: {title, content}
    })
  }

  onNewPost({title, content, isPrivate = false, attachmentIds}) {
    const { project } = this.props
    const newFeed = {
      title,
      body: content,
      tag: isPrivate ? PROJECT_FEED_TYPE_MESSAGES : PROJECT_FEED_TYPE_PRIMARY
    }
    if (attachmentIds) {
      Object.assign(newFeed, { attachmentIds })
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
    const feed = _.find(feeds, { id: feedId })
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
      this.props.loadFeedComments(feedId, feed.tag, commentIdsToRetrieve)
    } else {
      this.setState(update(this.state, {
        showAll: { $push: [feedId] },
        feeds: { $splice: [[stateFeedIdx, 1, this.mapFeed(feed, true) ]] }
      }))
    }
  }

  onAddNewComment(feedId, content, attachmentIds) {
    const { currentUser, feeds } = this.props
    const feed = _.find(feeds, { id: feedId })
    const newComment = {
      date: new Date(),
      userId: parseInt(currentUser.id),
      content,
    }
    if (attachmentIds) {
      Object.assign(newComment, { attachmentIds })
    }
    this.props.addFeedComment(feedId, feed.tag, newComment)
  }

  onSaveMessageChange(feedId, messageId, content, editMode) {
    this.setState({
      feeds: this.state.feeds.map((item) => {
        if (item.id === feedId) {
          const messageIndex = _.findIndex(item.comments, message => message.id === messageId)
          const message = item.comments[messageIndex]
          message.newContent = content
          message.editMode = editMode
          item.comments[messageIndex] = {...message}
          item.comments = _.map(item.comments, message => message)
          return {...item}
        }
        return item
      })
    })
  }

  onSaveMessage(feedId, message, content, attachmentIds) {
    const newMessage = {...message}
    const { feeds } = this.state
    const feed = _.find(feeds, { id: feedId })
    Object.assign(newMessage, {content, attachmentIds})
    this.props.saveFeedComment(feedId, feed.tag, newMessage)
  }

  onDeleteMessage(feedId, postId) {
    const { feeds } = this.state
    const feed = _.find(feeds, { id: feedId })
    this.props.deleteFeedComment(feedId, feed.tag, postId)
  }

  onEditMessage(feedId, postId) {
    const { feeds } = this.state
    const feed = _.find(feeds, { id: feedId })
    const comment = _.find(feed.comments, message => message.id === postId)
    if (!comment.rawContent) {
      this.props.getFeedComment(feedId, feed.tag, postId)
    }
    this.onSaveMessageChange(feedId, postId, null, true)
  }

  onEditTopic(feedId) {
    const { feeds } = this.state
    const feed = _.find(feeds, { id: feedId })
    const comment = feed.topicMessage
    if (!comment.rawContent) {
      this.props.getFeedComment(feedId, feed.tag, comment.id)
    }
    this.onTopicChange(feedId, comment.id, null, null, true)
  }

  onTopicChange(feedId, messageId, title, content, editTopicMode) {
    this.setState({
      feeds: this.state.feeds.map((item) => {
        if (item.id === feedId) {
          item.newTitle = title
          item.editTopicMode = editTopicMode
          item.topicMessage = {...item.topicMessage, newContent: content}
          return {...item}
        }
        return item
      })
    })
  }

  onSaveTopic(feedId, postId, title, content) {
    const { feeds } = this.state
    const feed = _.find(feeds, { id: feedId })
    const newTopic = { postId, title, content }
    this.props.saveProjectTopic(feedId, feed.tag, newTopic)
  }

  onDeleteTopic(feedId) {
    const { feeds } = this.state
    const feed = _.find(feeds, { id: feedId })
    this.props.deleteProjectTopic(feedId, feed.tag)
  }

  onRefreshFeeds() {
    const { loadDashboardFeeds, loadProjectMessages, project, canAccessPrivatePosts } = this.props
    loadDashboardFeeds(project.id)
    canAccessPrivatePosts && loadProjectMessages(project.id)
  }

  enterFullscreen(feedId) {
    this.setState({ fullscreenFeedId: feedId })
  }

  exitFullscreen() {
    this.setState({ fullscreenFeedId: null })
  }

  render () {
    const {currentUser, currentMemberRole, isCreatingFeed, error, allMembers,
      toggleNotificationRead, notifications, project, isSuperUser, projectMembers, canAccessPrivatePosts } = this.props
    const { feeds, isNewPostMobileOpen, fullscreenFeedId } = this.state
    const isChanged = this.isChanged()
    const onLeaveMessage = this.onLeave() || ''
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
            <SingleFeedContainer
              {...{
                ...fullscreenFeed,
                allowComments: fullscreenFeed.allowComments && !!currentMemberRole,
                currentUser,
                allMembers,
                projectMembers,
                onNewCommentChange: this.onNewCommentChange,
                onAddNewComment: this.onAddNewComment,
                onLoadMoreComments: this.onShowAllComments,
                onEditMessage: this.onEditMessage,
                onSaveMessageChange: this.onSaveMessageChange,
                onSaveMessage: this.onSaveMessage,
                onDeleteMessage: this.onDeleteMessage,
                onEditTopic: this.onEditTopic,
                onTopicChange: this.onTopicChange,
                onSaveTopic: this.onSaveTopic,
                onDeleteTopic: this.onDeleteTopic,
                onExitFullscreenClick: this.exitFullscreen,
                isFullScreen: true,
              }}
            />
          </FullscreenFeedContainer>
        )}

        <PostsRefreshPrompt
          preventShowing={isChanged}
          toggleNotificationRead={toggleNotificationRead}
          refreshFeeds={this.onRefreshFeeds}
          notifications={notifications}
          projectId={project.id}
        />


        <Prompt
          when={!!onLeaveMessage}
          message={onLeaveMessage}
        />

        <Section>
          <SectionTitle title="Discussions" />
          <div>
            <MediaQuery minWidth={SCREEN_BREAKPOINT_MD}>
              <NewPost
                currentUser={currentUser}
                allMembers={allMembers}
                projectMembers={projectMembers}
                onPost={this.onNewPost}
                isCreating={isCreatingFeed}
                hasError={error}
                heading="NEW STATUS POST"
                onNewPostChange={this.onNewPostChange}
                titlePlaceholder="Start a new discussion"
                expandedTitlePlaceholder="Add your discussion title"
                contentPlaceholder="Add your first post"
                canAccessPrivatePosts={canAccessPrivatePosts}
              />
            </MediaQuery>
            {feeds.map((feed) => (
              <div styleName="feed-card" key={feed.id}>
                <SingleFeedContainer
                  {...{
                    ...feed,
                    allowComments: feed.allowComments && !!currentMemberRole,
                    currentUser,
                    allMembers,
                    projectMembers,
                    onNewCommentChange: this.onNewCommentChange,
                    onAddNewComment: this.onAddNewComment,
                    onLoadMoreComments: this.onShowAllComments,
                    onEditMessage: this.onEditMessage,
                    onSaveMessageChange: this.onSaveMessageChange,
                    onSaveMessage: this.onSaveMessage,
                    onDeleteMessage: this.onDeleteMessage,
                    onEditTopic: this.onEditTopic,
                    onTopicChange: this.onTopicChange,
                    onSaveTopic: this.onSaveTopic,
                    onDeleteTopic: this.onDeleteTopic,
                    onEnterFullscreenClick: this.enterFullscreen,
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
            canAccessPrivatePosts={canAccessPrivatePosts}
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
  }

  componentWillMount() {
    // As we implemented links to the topics on the Dashboard and Plan tabs sidebars
    // we want to navigate between topics on the different tabs
    // to make navigation smooth, we don't reload feeds on the dashboard tab
    // every time we switch to the dashboard tab
    // TODO this is an experimental way, we have to think if this is good
    //      or we have reload feeds some way still keeping navigation smooth
    // this.props.loadDashboardFeeds(this.props.project.id)
  }

  render() {
    return <EnhancedFeedView {...this.props} />
  }
}

FeedContainer.PropTypes = {
  currentMemberRole: PropTypes.string,
  project: PropTypes.object.isRequired,
  canAccessPrivatePosts: PropTypes.bool.isRequired,
}

const mapStateToProps = ({ projectTopics, members, loadUser, notifications, projectState }) => {
  const project = projectState.project
  const projectMembersMap = _.keyBy(project.members, 'userId')
  const projectMembers = Object.values(members.members) 
    .filter(m => projectMembersMap.hasOwnProperty(m.userId))
    .map(m => ({
      ...m,
      role:projectMembersMap[m.userId].role
    }))
  // all feeds includes primary as well as private topics if user has access to private topics
  let allFeed = projectTopics.feeds[PROJECT_FEED_TYPE_PRIMARY].topics
  const canAccessPrivatePosts = checkPermission(PERMISSIONS.ACCESS_PRIVATE_POST)
  if (canAccessPrivatePosts) {
    allFeed = [...allFeed, ...projectTopics.feeds[PROJECT_FEED_TYPE_MESSAGES].topics]
  }
  const allFeedCount = projectTopics.feeds[PROJECT_FEED_TYPE_PRIMARY].totalCount + (canAccessPrivatePosts ? projectTopics.feeds[PROJECT_FEED_TYPE_MESSAGES].totalCount : 0)

  return {
    currentUser    : loadUser.user,
    feeds          : allFeed,
    feedTotalCount : allFeedCount,
    isLoading      : projectTopics.isLoading,
    isCreatingFeed : projectTopics.isCreatingFeed,
    error          : projectTopics.error,
    allMembers     : members.members,
    projectMembers : _.keyBy(projectMembers, 'userId'),
    notifications,
    canAccessPrivatePosts,
  }
}
const mapDispatchToProps = {
  loadDashboardFeeds,
  loadProjectMessages,
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
