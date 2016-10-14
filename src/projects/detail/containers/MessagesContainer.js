import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import MessageList from '../../../components/MessageList/MessageList'
import MessagingEmptyState from '../../../components/MessageList/MessagingEmptyState'
import MessageDetails from '../../../components/MessageDetails/MessageDetails'
import NewPost from '../../../components/Feed/NewPost'
import { laodProjectMessages, createProjectTopic, loadFeedComments, addFeedComment } from '../../actions/projectTopics'
import Sticky from 'react-stickynode'
import spinnerWhileLoading from '../../../components/LoadingSpinner'

import {
  THREAD_MESSAGES_PAGE_SIZE,
  PROJECT_FEED_TYPE_MESSAGES,
  DISCOURSE_BOT_USERID,
  CODER_BOT_USERID,
  CODER_BOT_USER_FNAME,
  CODER_BOT_USER_LNAME
} from '../../../config/constants'

const SYSTEM_USER = {
  firstName: CODER_BOT_USER_FNAME,
  lastName: CODER_BOT_USER_LNAME,
  photoURL: require('../../../assets/images/avatar-coder.png')
}
const isSystemUser = (userId) => [DISCOURSE_BOT_USERID, CODER_BOT_USERID].indexOf(userId) > -1

class MessagesView extends React.Component {

  constructor(props) {
    super(props)
    this.state = { threads : [], activeThreadId : null, showEmptyState : true }
    this.onThreadSelect = this.onThreadSelect.bind(this)
    this.onLoadMoreMessages = this.onLoadMoreMessages.bind(this)
    this.onAddNewMessage = this.onAddNewMessage.bind(this)
    this.onNewMessageChange = this.onNewMessageChange.bind(this)
    this.onNewThread = this.onNewThread.bind(this)
  }

  componentWillMount() {
    this.init(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.init(nextProps)
  }

  init(props) {
    const { allMembers } = props
    const { activeThreadId } = this.state
    const activeThreadIndex = activeThreadId
      ? _.findIndex(this.state.threads, (thread) => thread.id === activeThreadId )
      : 0
    this.setState({
      threads: props.threads.map((thread, idx) => {
        const item = _.pick(thread, ['id', 'date', 'read', 'tag', 'title', 'totalPosts', 'userId', 'reference', 'referenceId', 'postIds', 'isAddingComment'])
        item.isActive = idx === activeThreadIndex
        if (isSystemUser(item.userId)) {
          item.user = SYSTEM_USER
          item.allowComments = false
        } else {
          item.user = allMembers[item.userId]
          item.allowComments = true
        }

        item.unread = !thread.read
        item.html = thread.posts[0].body
        // skip over the first post since that is the topic post
        item.totalComments = thread.totalPosts-1
        item.messages = _.map(thread.posts, (p) => {
          if (p.type === 'post') {
            return {
              content: p.body,
              unread: !p.read,
              date: p.date,
              author: isSystemUser(p.userId) ? SYSTEM_USER : allMembers[p.userId]
            }
          } else {
            item.totalComments--
          }
        }).filter(i => i)
        item.newMessage = ''
        item.hasMoreMessages = false // FIXME
        return item
      }).filter(item => item)
    })
  }

  onThreadSelect(thread) {
    this.setState({
      isCreateNewMessage: false,
      activeThreadId: thread.id,
      threads: this.state.threads.map((item) => {
        if (item.isActive) {
          if (item.id === thread.id) {
            return item
          }
          return {...item, isActive: false, messages: item.messages.map((msg) => ({...msg, unread: false}))}
        }
        if (item.id === thread.id) {
          return {...item, isActive: true, unreadCount: 0}
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

  // this method is not ready yet, however, it is not used right now because messaging
  // api is not supporting paging yet
  onLoadMoreMessages(thread) {
    const renderedMessages = thread.messages.length
    const availableMessages = thread.posts.length - 1
    if (renderedMessages < availableMessages) {
      const nextPage = thread.posts.slice(-renderedMessages-THREAD_MESSAGES_PAGE_SIZE, -renderedMessages)
      thread.messages = nextPage.concat(thread.messages)
      thread.hasMoreMessages = thread.messages.length < thread.totalComments
      this.forceUpdate()
    } else {
      if (thread.messages && thread.messages.length < thread.totalComments) {
        const commentIds = thread.postIds.slice(-renderedMessages-THREAD_MESSAGES_PAGE_SIZE, -renderedMessages)

        this.props.loadFeedComments(thread.id, PROJECT_FEED_TYPE_MESSAGES, commentIds)
      }
    }
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
    const {threads, isCreateNewMessage, showEmptyState} = this.state
    const { currentUser, isCreatingFeed, currentMemberRole, isLoading, error } = this.props
    if (isLoading)
      return <LoadingIndicator />

    const activeThread = threads.filter((item) => item.isActive)[0]
    const renderRightPanel = () => {
      if (!!currentMemberRole && (isCreateNewMessage || !threads.length)) {
        return (
          <NewPost
            currentUser={currentUser}
            onPost={this.onNewThread}
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
            allowAddingComment={ activeThread.allowComments && !!currentMemberRole }
            onLoadMoreMessages={this.onLoadMoreMessages.bind(this, activeThread)}
            onNewMessageChange={this.onNewMessageChange}
            onAddNewMessage={ this.onAddNewMessage.bind(this, activeThread.id) }
            currentUser={currentUser}
          />
        )
      } else {
        // TODO show some placeholder card
      }
    }

    return (
      <div className="messages-container">
        <div className="left-area">
          <Sticky top={80}>
            <MessageList
              onAdd={() => this.setState({isCreateNewMessage: true})}
              threads={threads}
              onSelect={this.onThreadSelect}
              showAddButton={ !!currentMemberRole }
              showEmptyState={ showEmptyState && !threads.length }
            />
          </Sticky>
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
    )
  }
}

const enhance = spinnerWhileLoading(props => !props.isLoading)
const EnhancedMessagesView = enhance(MessagesView)

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
  loadFeedComments,
  addFeedComment
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagesContainer)
