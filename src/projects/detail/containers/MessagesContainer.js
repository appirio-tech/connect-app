import _ from 'lodash'
import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import update from 'react-addons-update'
import MessageList from '../../../components/MessageList/MessageList'
import MessagingEmptyState from '../../../components/MessageList/MessagingEmptyState'
import MessageDetails from '../../../components/MessageDetails/MessageDetails'
import NewPost from '../../../components/Feed/NewPost'
import { laodProjectMessages, createProjectTopic, loadFeedComments, addFeedComment } from '../../actions/projectTopics'
import spinnerWhileLoading from '../../../components/LoadingSpinner'
import {FullHeightContainer} from 'appirio-tech-react-components'
import FooterV2 from '../../../components/FooterV2/FooterV2'

import {
  THREAD_MESSAGES_PAGE_SIZE,
  PROJECT_FEED_TYPE_MESSAGES,
  DISCOURSE_BOT_USERID,
  CODER_BOT_USERID,
  CODER_BOT_USER_FNAME,
  CODER_BOT_USER_LNAME,
  CONNECT_USER_FNAME,
  CONNECT_USER_LNAME
} from '../../../config/constants'

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
    window.removeEventListener('beforeunload', this.onLeave)
    if (this.state.routeLeaveHook) {
      this.state.routeLeaveHook()
    }
  }

  // Notify user if they navigate away while the form is modified.
  onLeave(e) {
    if (this.isChanged()) {
      return e.returnValue = 'You have uposted content. Are you sure you want to leave?'
    }
  }

  isChanged() {
    const { newPost } = this.state
    const hasMessage = !_.isUndefined(_.find(this.state.threads, (thread) => thread.newMessage && thread.newMessage.length))
    const hasThread = (newPost.title && !!newPost.title.trim().length) || ( newPost.content && !!newPost.content.trim().length)
    return hasThread || hasMessage
  }

  mapFeed(feed, isActive, showAll = false, resetNewMessage = false) {
    const { allMembers } = this.props
    const item = _.pick(feed, ['id', 'date', 'read', 'tag', 'title', 'totalPosts', 'userId', 'reference', 'referenceId', 'postIds', 'isAddingComment', 'isLoadingComments', 'error'])
    item.isActive = isActive
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
    // Github issue#673, Don't skip over the first post like we do in dashboard feeds
    // because here we show the first post as comment as well
    item.totalComments = feed.totalPosts
    item.messages = []
    const _toComment = (p) => {
      const author = CONNECT_USER
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
    const propsThreadId = _.get(props, 'location.state.threadId', null)
    const threadId = activeThreadId ? activeThreadId : propsThreadId
    const activeThreadIndex = threadId
      ? _.findIndex(props.threads, (thread) => thread.id === threadId )
      : 0
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
          resetNewMessage)
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
          return {...item, isActive: false, newMessage: '', messages: item.messages.map((msg) => ({...msg, unread: false}))}
        }
        if (item.id === thread.id) {
          return {...item, isActive: true, unreadCount: 0}
        }
        return item
      })
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
          return {...item, newMessage: ''}
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
    const renderRightPanel = () => {
      if (!!currentMemberRole && (isCreateNewMessage || !threads.length)) {
        return (
          <NewPost
            currentUser={currentUser}
            onPost={this.onNewThread}
            onNewPostChange={ this.onNewPostChange }
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
            onLoadMoreMessages={this.onShowAllComments.bind(this, activeThread.id)}
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
      <FullHeightContainer offset={ 80 }>
        <div className="messages-container">
            <div className="left-area">
              <MessageList
                onAdd={ this.onNewThreadClick }
                threads={threads}
                onSelect={this.onThreadSelect}
                showAddButton={ !!currentMemberRole }
                showEmptyState={ showEmptyState && !threads.length }
                scrollPosition={ scrollPosition }
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
  loadFeedComments,
  addFeedComment
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagesContainer)
