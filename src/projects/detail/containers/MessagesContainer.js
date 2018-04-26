import _ from 'lodash'
import React from 'react'
import { Prompt, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import update from 'react-addons-update'
import MessageList from '../../../components/MessageList/MessageList'
import MessagingEmptyState from '../../../components/MessageList/MessagingEmptyState'
import MessageDetails from '../../../components/MessageDetails/MessageDetails'
import NewPost from '../../../components/Feed/NewPost'
import { laodProjectMessages, createProjectTopic, saveProjectTopic, deleteProjectTopic, loadFeedComments, addFeedComment, saveFeedComment, deleteFeedComment, getFeedComment } from '../../actions/projectTopics'
import spinnerWhileLoading from '../../../components/LoadingSpinner'
import FullHeightContainer from 'appirio-tech-react-components/components/FullHeightContainer/FullHeightContainer'
import FooterV2 from '../../../components/FooterV2/FooterV2'

import {
  THREAD_MESSAGES_PAGE_SIZE,
  PROJECT_FEED_TYPE_MESSAGES,
  DISCOURSE_BOT_USERID,
  CODER_BOT_USERID,
  CODER_BOT_USER_FNAME,
  CODER_BOT_USER_LNAME,
  TC_SYSTEM_USERID
} from '../../../config/constants'

const SYSTEM_USER = {
  firstName: CODER_BOT_USER_FNAME,
  lastName: CODER_BOT_USER_LNAME,
  photoURL: require('file-loader?../../../assets/images/avatar-coder.svg')
}
const isSystemUser = (userId) => [DISCOURSE_BOT_USERID, CODER_BOT_USERID, TC_SYSTEM_USERID].indexOf(userId) > -1

class MessagesView extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      threads : [],
      activeThreadId : null,
      showEmptyState : true,
      showAll: [],
      newPost: {}
    }
    this.onThreadSelect = this.onThreadSelect.bind(this)
    this.onShowAllComments = this.onShowAllComments.bind(this)
    this.onAddNewMessage = this.onAddNewMessage.bind(this)
    this.onNewMessageChange = this.onNewMessageChange.bind(this)
    this.onNewThread = this.onNewThread.bind(this)
    this.onLeave = this.onLeave.bind(this)
    this.isChanged = this.isChanged.bind(this)
    this.onNewPostChange = this.onNewPostChange.bind(this)
    this.changeThread = this.changeThread.bind(this)
    this.onNewThreadClick = this.onNewThreadClick.bind(this)
    this.showNewThreadForm = this.showNewThreadForm.bind(this)
    this.onEditMessage = this.onEditMessage.bind(this)
    this.onSaveMessageChange = this.onSaveMessageChange.bind(this)
    this.onEditTopic = this.onEditTopic.bind(this)
    this.onTopicChange = this.onTopicChange.bind(this)
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

  isChanged() {
    const { newPost } = this.state
    const hasMessage = !_.isUndefined(_.find(this.state.threads, (thread) => (thread.isSavingTopic || thread.isDeletingTopic || thread.isAddingComment)
      || (thread.newMessage && thread.newMessage.length)
      || (thread.newTitle && thread.newTitle.length && thread.newTitle !== thread.title)
      || (thread.topicMessage && thread.topicMessage.newContent && thread.topicMessage.newContent.length && thread.topicMessage.rawContent && thread.topicMessage.newContent !== thread.topicMessage.rawContent)
      || !_.isUndefined(_.find(thread.messages, (message) => message.isSavingComment || message.isDeletingComment || (message.newContent && message.newContent.length && message.rawContent && message.newContent !== message.rawContent)))
    ))
    const hasThread = (newPost.title && !!newPost.title.trim().length) || ( newPost.content && !!newPost.content.trim().length)
    return hasThread || hasMessage
  }

  mapFeed(feed, isActive, showAll = false, resetNewMessage = false, prevProps) {
    const { allMembers } = this.props
    const item = _.pick(feed, ['id', 'date', 'read', 'tag', 'title', 'totalPosts', 'userId', 'reference', 'referenceId', 'postIds', 'isSavingTopic', 'isDeletingTopic', 'isAddingComment', 'isLoadingComments', 'error'])
    item.isActive = isActive
    // Github issue##623, allow comments on all posts (including system posts)
    item.allowComments = true
    if (isSystemUser(item.userId)) {
      item.user = SYSTEM_USER
    } else {
      item.user = allMembers[item.userId]
    }
    item.unread = !feed.read
    // Github issue#673, Don't skip over the first post like we do in dashboard feeds
    // because here we show the first post as comment as well
    item.totalComments = feed.totalPosts
    item.messages = []
    let prevThread = null
    if (prevProps) {
      prevThread = _.find(prevProps.threads, t => feed.id === t.id)
    }
    const _toComment = (p) => {
      const date = p.updatedDate?p.updatedDate:p.date
      const edited = date !== p.date
      const comment= {
        id: p.id,
        content: p.body,
        rawContent: p.rawContent,
        isGettingComment: p.isGettingComment,
        isSavingComment: p.isSavingComment,
        isDeletingComment: p.isDeletingComment,
        error: p.error,
        unread: !p.read,
        date: p.date,
        edited,
        author: isSystemUser(p.userId) ? SYSTEM_USER : allMembers[p.userId]
      }
      const prevComment = prevThread ? _.find(prevThread.posts, t => p.id === t.id) : null
      if (prevComment && prevComment.isSavingComment && !comment.isSavingComment && !comment.error) {
        comment.editMode = false
      } else {
        const threadFromState = _.find(this.state.threads, t => feed.id === t.id)
        const commentFromState = threadFromState ? _.find(threadFromState.messages, t => comment.id === t.id) : null
        comment.newContent = commentFromState ? commentFromState.newContent : null
        comment.editMode = commentFromState && commentFromState.editMode
      }
      return comment
    }
    item.topicMessage = _toComment(feed.posts[0])
    if (prevThread && prevThread.isSavingTopic && !feed.isSavingTopic && !feed.error) {
      item.editTopicMode = false
    } else {
      const threadFromState = _.find(this.state.threads, t => feed.id === t.id)
      item.newTitle = threadFromState ? threadFromState.newTitle : null
      item.topicMessage.newContent = threadFromState ? threadFromState.topicMessage.newContent : null
      item.editTopicMode = threadFromState && threadFromState.editTopicMode
    }
    const validPost = (post) => {
      return post.type === 'post' && (post.body && post.body.trim().length || !isSystemUser(post.userId))
    }
    if (showAll) {
      // if we are showing all comments, just iterate through the entire array
      _.forEach(feed.posts, p => {
        validPost(p) ? item.messages.push(_toComment(p)) : item.totalComments--
      })
    } else {
      // otherwise iterate from right and add to the beginning of the array
      _.forEachRight(feed.posts, (p) => {
        validPost(p) ? item.messages.unshift(_toComment(p)) : item.totalComments--
        if (!feed.showAll && item.messages.length === THREAD_MESSAGES_PAGE_SIZE)
          return false
      })
    }
    item.newMessage = ''
    if (!resetNewMessage) {
      const threadFromState = _.find(this.state.threads, t => feed.id === t.id)
      item.newMessage = threadFromState ? threadFromState.newMessage : ''
    }
    item.hasMoreMessages = item.messages.length < item.totalComments
    return item
  }

  init(props, prevProps) {
    const { activeThreadId } = this.state
    const propsThreadId = _.get(props, 'params.discussionId', null)
    const threadId = activeThreadId ? activeThreadId : parseInt(propsThreadId)
    let activeThreadIndex = threadId
      ? _.findIndex(props.threads, (thread) => thread.id === threadId )
      : 0
    if (activeThreadIndex < 0) {
      activeThreadIndex = 0
    }
    props.threads.length && this.setState({activeThreadId: props.threads[activeThreadIndex].id})
    let resetNewPost = false
    if (prevProps) {
      resetNewPost = prevProps.isCreatingFeed && !props.isCreatingFeed && !props.error
    }
    this.setState({
      newPost: resetNewPost ? {} : this.state.newPost,
      scrollPosition: activeThreadIndex * 71,
      threads: props.threads.map((thread, idx) => {
        // finds the same thread from previous props, if exists
        let prevThread
        if (prevProps && prevProps.threads) {
          prevThread = _.find(prevProps.threads, t => thread.id === t.id)
        }
        // reset new message if we were adding message and there is no error in doing so
        const resetNewMessage = prevThread && prevThread.isAddingComment && !thread.isAddingComment && !thread.error
        return this.mapFeed(thread,
          idx === activeThreadIndex,
          this.state.showAll.indexOf(thread.id) > -1,
          resetNewMessage, prevProps)
      }).filter(item => item)
    })
  }


  onShowAllComments(theadId) {
    const { threads } = this.props
    const thread = _.find(threads, thread => thread.id === theadId)
    const stateFeedIdx = _.findIndex(this.state.threads, (f) => f.id === theadId)
    // in case we have already have all comments for that thread from the server,
    // just change the state to show all comments for that FeedId.
    // Otherwise load more comments from the server
    if (thread.posts.length < thread.postIds.length) {
      // load more from server
      const updatedFeed = update(this.state.threads[stateFeedIdx], {
        isLoadingComments: { $set : true }
      })
      const retrievedPostIds = _.map(thread.posts, 'id')
      const commentIdsToRetrieve = _.filter(thread.postIds, _id => retrievedPostIds.indexOf(_id) === -1 )
      this.setState(update(this.state, {
        showAll: { $push: [theadId] },
        threads: { $splice: [[stateFeedIdx, 1, updatedFeed ]] }
      }))
      this.props.loadFeedComments(theadId, PROJECT_FEED_TYPE_MESSAGES, commentIdsToRetrieve)
    } else {
      this.setState(update(this.state, {
        showAll: { $push: [theadId] },
        threads: { $splice: [[stateFeedIdx, 1, this.mapFeed(thread, true, true) ]] }
      }))
    }
  }

  onThreadSelect(thread) {
    if (!this.state.isCreateNewMessage && thread.id === this.state.activeThreadId) {
      return
    }
    const unsavedContentMsg = this.onLeave({})
    if (unsavedContentMsg) {
      const changeConfirmed = confirm(unsavedContentMsg)
      if (changeConfirmed) {
        this.changeThread(thread)
      }
    } else {
      this.changeThread(thread)
    }
  }

  changeThread(thread) {
    this.setState({
      isCreateNewMessage: false,
      newPost: {},
      activeThreadId: thread.id,
      threads: this.state.threads.map((item) => {
        if (item.isActive) {
          if (item.id === thread.id) {
            return item
          }
          return {...item, isActive: false, newMessage: '', newTitle: null, editTopicMode: false,
            topicMessage: {...item.topicMessage, newContent: null},
            messages: item.messages.map((msg) => ({...msg, newContent: null, editMode: false, unread: false}))
          }
        }
        if (item.id === thread.id) {
          return {...item, isActive: true, unreadCount: 0}
        }
        return item
      })
    }, () => {
      this.props.history.push(`/projects/${this.props.project.id}/discussions/${thread.id}`)
    })
  }

  onNewPostChange(title, content) {
    this.setState({
      newPost: {title, content}
    })
  }

  onNewThreadClick() {
    const unsavedContentMsg = this.onLeave({})
    if (unsavedContentMsg) {
      const changeConfirmed = confirm(unsavedContentMsg)
      if (changeConfirmed) {
        this.showNewThreadForm()
      }
    } else {
      this.showNewThreadForm()
    }
  }

  showNewThreadForm() {
    this.setState({
      isCreateNewMessage: true,
      threads: this.state.threads.map((item) => {
        if (item.isActive) {
          return {...item, newMessage: '', newTitle: null, editTopicMode: false,
            topicMessage: {...item.topicMessage, newContent: null},
            messages: item.messages.map((msg) => ({...msg, newContent: null, editMode: false}))
          }
        }
        return item
      })
    })
  }

  onNewMessageChange(content) {
    this.setState({
      threads: this.state.threads.map((item) => {
        if (item.isActive) {
          return {...item, newMessage: content}
        }
        return item
      })
    })
  }

  onAddNewMessage(threadId, content) {
    const { currentUser } = this.props
    const newMessage = {
      date: new Date(),
      userId: parseInt(currentUser.id),
      content
    }
    this.props.addFeedComment(threadId, PROJECT_FEED_TYPE_MESSAGES, newMessage)
  }

  onSaveMessageChange(threadId, messageId, content, editMode) {
    this.setState({
      threads: this.state.threads.map((item) => {
        if (item.id === threadId) {
          const messageIndex = _.findIndex(item.messages, message => message.id === messageId)
          const message = item.messages[messageIndex]
          message.newContent = content
          message.editMode = editMode
          item.messages[messageIndex] = {...message}
          item.messages = _.map(item.messages, message => message)
          return {...item}
        }
        return item
      })
    })
  }

  onSaveMessage(threadId, message, content) {
    const newMessage = {...message}
    newMessage.content = content
    this.props.saveFeedComment(threadId, PROJECT_FEED_TYPE_MESSAGES, newMessage)
  }

  onDeleteMessage(threadId, postId) {
    this.props.deleteFeedComment(threadId, PROJECT_FEED_TYPE_MESSAGES, postId)
  }

  onEditMessage(threadId, postId) {
    const thread = _.find(this.state.threads, t => threadId === t.id)
    const comment = _.find(thread.messages, message => message.id === postId)
    if (!comment.rawContent) {
      this.props.getFeedComment(threadId, PROJECT_FEED_TYPE_MESSAGES, postId)
    }
    this.onSaveMessageChange(threadId, postId, null, true)
  }

  onEditTopic(threadId) {
    const thread = _.find(this.state.threads, t => threadId === t.id)
    const comment = thread.topicMessage
    if (!comment.rawContent) {
      this.props.getFeedComment(threadId, PROJECT_FEED_TYPE_MESSAGES, comment.id)
    }
    this.onTopicChange(threadId, comment.id, null, null, true)
  }

  onTopicChange(threadId, messageId, title, content, editTopicMode) {
    this.setState({
      threads: this.state.threads.map((item) => {
        if (item.id === threadId) {
          item.newTitle = title
          item.editTopicMode = editTopicMode
          item.topicMessage = {...item.topicMessage, newContent: content}
          return {...item}
        }
        return item
      })
    })
  }

  onSaveTopic(threadId, postId, title, content) {
    this.props.saveProjectTopic(threadId, PROJECT_FEED_TYPE_MESSAGES, {postId, title, content})
  }

  onDeleteTopic(threadId) {
    this.props.deleteProjectTopic(threadId, PROJECT_FEED_TYPE_MESSAGES)
  }

  onNewThread({title, content}) {
    const { project } = this.props
    const newThread = {
      title,
      body: content,
      tag: PROJECT_FEED_TYPE_MESSAGES
    }
    this.props.createProjectTopic(project.id, newThread).then(() => {
      this.setState({
        isCreateNewMessage : false
      })
    })
  }

  render() {
    const {threads, isCreateNewMessage, showEmptyState, scrollPosition} = this.state
    const { currentUser, isCreatingFeed, currentMemberRole, error } = this.props
    const activeThread = threads.filter((item) => item.isActive)[0]
    const onLeaveMessage = this.onLeave() || ''
    const renderRightPanel = () => {
      if (!!currentMemberRole && (isCreateNewMessage || !threads.length)) {
        return (
          <NewPost
            currentUser={currentUser}
            onPost={this.onNewThread}
            onNewPostChange={this.onNewPostChange}
            isCreating={isCreatingFeed}
            hasError={error}
            heading="New Discussion Post"
            titlePlaceholder="Start a new discussion topic with the team"
          />
        )
      } else if (activeThread) {
        return (
          <MessageDetails
            {...activeThread}
            allowAddingComment={activeThread.allowComments && !!currentMemberRole}
            onLoadMoreMessages={this.onShowAllComments.bind(this, activeThread.id)}
            onNewMessageChange={this.onNewMessageChange}
            onAddNewMessage={this.onAddNewMessage.bind(this, activeThread.id)}
            currentUser={currentUser}
            onEditMessage={this.onEditMessage.bind(this, activeThread.id)}
            onSaveMessageChange={this.onSaveMessageChange.bind(this, activeThread.id)}
            onSaveMessage={this.onSaveMessage.bind(this, activeThread.id)}
            onDeleteMessage={this.onDeleteMessage.bind(this, activeThread.id)}
            onEditTopic={this.onEditTopic.bind(this, activeThread.id)}
            onTopicChange={this.onTopicChange.bind(this, activeThread.id)}
            onSaveTopic={this.onSaveTopic.bind(this, activeThread.id)}
            onDeleteTopic={this.onDeleteTopic.bind(this, activeThread.id)}
          />
        )
      } else {
        // TODO show some placeholder card
      }
    }

    return (
      <FullHeightContainer offset={80}>
        <Prompt
          when={!!onLeaveMessage}
          message={onLeaveMessage}
        />
        <div className="messages-container">
          <div className="left-area">
            <MessageList
              onAdd={this.onNewThreadClick}
              threads={threads}
              onSelect={this.onThreadSelect}
              showAddButton={!!currentMemberRole}
              showEmptyState={showEmptyState && !threads.length}
              scrollPosition={scrollPosition}
            />
            <FooterV2 />
          </div>
          <div className="right-area">
            { (showEmptyState && !threads.length) &&
                <MessagingEmptyState
                  currentUser={currentUser}
                  onClose={() => this.setState({showEmptyState: false})}
                />
            }
            { renderRightPanel() }
          </div>
        </div>
      </FullHeightContainer>
    )
  }
}

const enhance = spinnerWhileLoading(props => !props.isLoading)
const EnhancedMessagesView = withRouter(enhance(MessagesView))

class MessagesContainer extends React.Component {
  constructor(props) {
    super(props)
  }
  componentWillMount() {
    this.props.laodProjectMessages(this.props.project.id)
  }
  render() {
    return <EnhancedMessagesView {...this.props} />
  }
}

const mapStateToProps = ({ projectTopics, members, loadUser }) => {
  return {
    currentUser: loadUser.user,
    threads    : projectTopics.feeds[PROJECT_FEED_TYPE_MESSAGES].topics,
    threadTotalCount : projectTopics.feeds[PROJECT_FEED_TYPE_MESSAGES].totalCount,
    isCreatingFeed : projectTopics.isCreatingFeed,
    isLoading  : projectTopics.isLoading,
    error      : projectTopics.error,
    allMembers : members.members
  }
}
const mapDispatchToProps = {
  laodProjectMessages,
  createProjectTopic,
  saveProjectTopic,
  deleteProjectTopic,
  loadFeedComments,
  addFeedComment,
  saveFeedComment,
  deleteFeedComment,
  getFeedComment
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagesContainer)
