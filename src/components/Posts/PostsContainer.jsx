/*
  Reusable posts container for a topic. Should pass tag which refers to topic.tag and postUrlTemplate is Handlebar
  template to format a link to the particular comment and includes {{postId}}
  The usage is as below where both tag and postUrlTemplate are required
  <PostsContainer tag={tag} postUrlTemplate={postUrlTemplate} />

  Example:
  <PostsContainer tag={`phase#1`} postUrlTemplate={`phase-${phase.id}-posts-{{postId}}`} />
*/
import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'

import {
  loadTopic,
  addTopicPost,
  deleteTopicPost,
  updateTopicPost,
} from '../../actions/topics'
import { isSystemUser } from '../../helpers/tcHelpers'
import {
  THREAD_MESSAGES_PAGE_SIZE,
  CODER_BOT_USER_FNAME,
  CODER_BOT_USER_LNAME,
} from '../../config/constants'

const SYSTEM_USER = {
  firstName: CODER_BOT_USER_FNAME,
  lastName: CODER_BOT_USER_LNAME,
  photoURL: require('../../assets/images/avatar-coder.svg')
}

import PostsView from './PostsView'

class PostsContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showAll: false,
    }

    this.onLoadMoreComments = this.onLoadMoreComments.bind(this)
    this.onAddNewComment = this.onAddNewComment.bind(this)
    this.onDeleteMessage = this.onDeleteMessage.bind(this)
    this.onSaveMessage = this.onSaveMessage.bind(this)
  }

  componentWillMount() {
    const { isLoading, topic, loadTopic, project, tag } = this.props
    if (!isLoading && !topic) {
      loadTopic(project.id, tag)
    }
  }

  /**
   * Transforms topic object from the store to the feed object
   * which is accepted by Feed component
   */
  prepareFeed() {
    const { topic, error, allMembers, currentMemberRole, tag } = this.props
    const { showAll } = this.state

    if (!topic || !tag) {
      return null
    }

    const feed = {
      ...topic,
      error,
      // Github issue##623, allow comments on all posts (including system posts)
      allowComments: true,
      user: isSystemUser(topic.userId) ? SYSTEM_USER : allMembers[topic.userId],
      unread: !topic.read && !!currentMemberRole,
      totalComments: topic.totalPosts,
      comments: [],
    }

    const toComment = (p) => {
      const date = p.updatedDate ? p.updatedDate : p.date
      const edited = date !== p.date
      const comment = {
        id: p.id,
        content: p.body,
        rawContent: p.rawContent,
        isSavingComment: p.isSavingComment,
        isDeletingComment: p.isDeletingComment,
        error: p.error,
        unread: !p.read && !!currentMemberRole,
        date,
        createdAt: p.date,
        edited,
        author: isSystemUser(p.userId) ? SYSTEM_USER : allMembers[p.userId],
        attachments: p.attachments || [],
      }

      return comment
    }

    const validPost = (post) => {
      return post.type === 'post' && (post.body && post.body.trim().length || !isSystemUser(post.userId))
    }

    // if we are showing all comments, just iterate through the entire array
    if (showAll) {
      _.forEach(topic.posts, p => {
        validPost(p) ? feed.comments.push(toComment(p)) : feed.totalComments--
      })

    // otherwise iterate from right and add to the beginning of the array
    } else {
      _.forEachRight(topic.posts, (p) => {
        validPost(p) ? feed.comments.unshift(toComment(p)) : feed.totalComments--

        if (feed.comments.length === THREAD_MESSAGES_PAGE_SIZE)
          return false
      })
    }

    feed.hasMoreComments = feed.comments.length !== feed.totalComments

    return feed
  }

  onLoadMoreComments() {
    this.setState({
      showAll: true,
    })
  }

  onAddNewComment(content, attachmentIds) {
    const { topic, currentUser, addTopicPost } = this.props

    const newComment = {
      date: new Date(),
      userId: parseInt(currentUser.id),
      content,
    }

    if (attachmentIds) {
      Object.assign(newComment, { attachmentIds })
    }
    addTopicPost(topic.tag, topic.id, newComment)
  }

  onDeleteMessage(postId) {
    const { topic, deleteTopicPost } = this.props

    deleteTopicPost(topic.tag, topic.id, postId)
  }

  onSaveMessage(message, content, attachmentIds) {
    const { topic, updateTopicPost } = this.props
    const updatedMessage = {...message}
    Object.assign(updatedMessage, {content, attachmentIds})

    updateTopicPost(topic.tag, topic.id, updatedMessage)
  }

  render() {
    const { isAddingComment, isLoading, tag, allMembers, projectMembers, currentUser, postUrlTemplate } = this.props
    const feed = this.prepareFeed()

    return (
      <PostsView
        user={currentUser}
        currentUser={currentUser}
        feed={feed}
        onLoadMoreComments={this.onLoadMoreComments}
        onAddNewComment={this.onAddNewComment}
        isAddingComment={isAddingComment}
        onDeleteMessage={this.onDeleteMessage}
        allMembers={allMembers}
        projectMembers={projectMembers}
        onSaveMessage={this.onSaveMessage}
        commentAnchorPrefix={postUrlTemplate}
        tag={tag}
        isLoading={isLoading}
      />

    )
  }
}

const mapStateToProps = ({ topics, loadUser, members, projectState }, props) => {
  const topicState = topics[props.tag] || {}
  const project = projectState.project
  const projectMembers = _.filter(members.members, m => _.some(project.members, pm => pm.userId === m.userId))
  return {
    ...topicState,
    project,
    currentUser: loadUser.user,
    allMembers: members.members,
    projectMembers : _.keyBy(projectMembers, 'userId')
  }
}

const mapDispatchToProps = {
  loadTopic,
  addTopicPost,
  deleteTopicPost,
  updateTopicPost,
}

export default connect(mapStateToProps, mapDispatchToProps)(PostsContainer)
