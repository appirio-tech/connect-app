/**
 * Container with HOC for Phase Feed
 */
import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'

import {
  loadPhaseFeed,
  addPhaseFeedComment,
  deletePhaseFeedComment,
  savePhaseFeedComment,
} from '../../actions/phasesTopics'
import { isSystemUser } from '../../../helpers/tcHelpers'
import {
  THREAD_MESSAGES_PAGE_SIZE,
  CODER_BOT_USER_FNAME,
  CODER_BOT_USER_LNAME,
} from '../../../config/constants'

const SYSTEM_USER = {
  firstName: CODER_BOT_USER_FNAME,
  lastName: CODER_BOT_USER_LNAME,
  photoURL: require('../../../assets/images/avatar-coder.svg')
}

const phaseFeedHOC = (Component) => {
  class PhaseFeedContainer extends React.Component {
    constructor(props) {
      super(props)

      this.state = {
        feed: null,
        isNewPostMobileOpen: false,
        showAll: false,
        isLoadingComments: false,
      }

      this.onLoadMoreComments = this.onLoadMoreComments.bind(this)
      this.onAddNewComment = this.onAddNewComment.bind(this)
      this.onDeleteMessage = this.onDeleteMessage.bind(this)
      this.onSaveMessage = this.onSaveMessage.bind(this)
    }

    componentWillMount() {
      const { isLoading, loadPhaseFeed, phase, project } = this.props

      if (!isLoading) {
        loadPhaseFeed(project.id, phase.id)
      }
    }

    /**
     * Transforms topic object from the store to the feed object
     * which is accepted by Feed component
     */
    prepareFeed() {
      const { topic, allMembers, currentMemberRole, phase } = this.props
      const { showAll } = this.state

      if (!topic) {
        return null
      }

      const feed = {
        ...topic,
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
          author: isSystemUser(p.userId) ? SYSTEM_USER : allMembers[p.userId]
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
      feed.permalink = `/projects/${phase.projectId}/phases/${phase.id}#feed-${feed.id}`

      return feed
    }

    onLoadMoreComments() {
      this.setState({
        showAll: true,
      })
    }

    onAddNewComment(content) {
      const { phase, topic, currentUser, addPhaseFeedComment } = this.props

      const newComment = {
        date: new Date(),
        userId: parseInt(currentUser.id),
        content,
      }

      addPhaseFeedComment(phase.id, topic.id, newComment)
    }

    onDeleteMessage(postId) {
      const { phase, topic, deletePhaseFeedComment } = this.props

      deletePhaseFeedComment(phase.id, topic.id, postId)
    }

    onSaveMessage(message, content) {
      const { phase, topic, savePhaseFeedComment } = this.props
      const updatedMessage = {...message}
      updatedMessage.content = content

      savePhaseFeedComment(phase.id, topic.id, updatedMessage)
    }

    render() {
      const feed = this.prepareFeed()

      return (
        <Component
          {...{
            ..._.omit(this.props, 'topic'),
            feed,
            onLoadMoreComments: this.onLoadMoreComments,
            onAddNewComment: this.onAddNewComment,
            onDeleteMessage: this.onDeleteMessage,
            onSaveMessage: this.onSaveMessage,
          }}
        />
      )
    }
  }

  const mapStateToProps = ({ phasesTopics, loadUser, members, productsTimelines }, props) => {
    const product = _.get(props.phase, 'products[0]')
    return {
      topic: _.get(phasesTopics[props.phase.id], 'topic'),
      isLoading: _.get(phasesTopics[props.phase.id], 'isLoading', false),
      isAddingComment: _.get(phasesTopics[props.phase.id], 'isAddingComment', false),
      currentUser: loadUser.user,
      allMembers: members.members,
      timeline: _.get(productsTimelines[product.id], 'timeline'),
    }
  }

  const mapDispatchToProps = {
    loadPhaseFeed,
    addPhaseFeedComment,
    deletePhaseFeedComment,
    savePhaseFeedComment,
  }

  return connect(mapStateToProps, mapDispatchToProps)(PhaseFeedContainer)
}

export { phaseFeedHOC }
