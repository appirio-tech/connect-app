/**
 * Message list for mobile devices
 */
import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import moment from 'moment'
import cn from 'classnames'
import { Link } from 'react-router-dom'
import FeedComments from './FeedComments'
import UserWithName from '../User/UserWithName'
import NewPostMobile, { NEW_POST_STEP } from './NewPostMobile'
import { POST_TIME_FORMAT } from '../../config/constants.js'

import './FeedMobile.scss'

class FeedMobile extends React.Component {
  constructor(props) {
    super(props)
    this.toggleComments = this.toggleComments.bind(this)
    this.toggleNewCommentMobile = this.toggleNewCommentMobile.bind(this)
    this.onAddNewComment = this.onAddNewComment.bind(this)
    this.onNewCommentChange = this.onNewCommentChange.bind(this)

    this.state = {
      isCommentsShown: false,
      isNewCommentMobileOpen: false
    }
  }

  componentWillReceiveProps(nextProps) {
    // if comments just has been loaded, check if have to open the thread
    if (this.props.comments && this.props.comments.length === 0 && nextProps.comments.length > 0) {
      this.openCommentFromHash(nextProps.comments)
    }
  }

  componentWillMount() {
    this.openCommentFromHash(this.props.comments)
  }

  /**
   * If there is hash in the URL referencing some comment,
   * open the comments thread by default
   *
   * @param {Array} comments list of comments
   */
  openCommentFromHash(comments) {
    const { isCommentsShown } = this.state
    const commentInHash = window.location.hash.match(/#comment-(\d+)/)
    const isCommentInTheFeed = !!(commentInHash && _.find(comments, (comment) => (comment.id.toString() === commentInHash[1])))

    if (!isCommentsShown && isCommentInTheFeed) {
      this.toggleComments()
    }
  }

  toggleComments() {
    this.setState({ isCommentsShown: !this.state.isCommentsShown })
  }

  toggleNewCommentMobile() {
    this.setState({ isNewCommentMobileOpen: !this.state.isNewCommentMobileOpen })
  }

  onAddNewComment({content}) {
    this.props.onAddNewComment(content)
  }

  onNewCommentChange(title, content) {
    this.props.onNewCommentChange(content)
  }

  render() {
    const {
      id, user, currentUser, date, totalComments, hasMoreComments, onLoadMoreComments, isLoadingComments,
      allowComments, comments, children, onNewCommentChange, onAddNewComment, isAddingComment, onSaveMessageChange,
      onEditMessage, onSaveMessage, onDeleteMessage, error, permalink, allMembers, title, topicMessage
    } = this.props
    const { isCommentsShown, isNewCommentMobileOpen } = this.state
    const commentsButtonText = isCommentsShown ?
      'Hide posts' :
      `${totalComments} ${totalComments > 1 ? 'posts' : 'post'}`

    let topicHeader = null
    if (topicMessage) {
      topicHeader = (
        <div>
          <div styleName="header">
            <UserWithName {..._.pick(user, 'firstName', 'lastName', 'photoURL')} size="40" />
            <Link styleName="date" to={permalink}>{moment(date).format(POST_TIME_FORMAT)}</Link>
          </div>
          <h4 styleName="title">{title}</h4>
        </div>
      )
    }

    const commentsToggle = totalComments > 0 ? (
      <button className="tc-btn tc-btn-link tc-btn-md" onClick={this.toggleComments}>{commentsButtonText}</button>
    ) : (
      <div styleName="no-comments">No posts yet</div>
    )

    return (
      <div styleName={cn('feed', { 'no-topic': !topicHeader })} id={`feed-${id}`}>
        {topicHeader}
        {(isCommentsShown || !topicHeader) &&
          <FeedComments
            allowComments={allowComments}
            totalComments={totalComments}
            hasMoreComments={hasMoreComments}
            onLoadMoreComments={onLoadMoreComments}
            onNewCommentChange={onNewCommentChange}
            onAddNewComment={onAddNewComment}
            isLoadingComments={isLoadingComments}
            currentUser={currentUser}
            avatarUrl={currentUser.photoURL}
            comments={comments}
            isAddingComment={isAddingComment}
            onEditMessage={onEditMessage}
            onSaveMessageChange={onSaveMessageChange}
            onSaveMessage={onSaveMessage}
            onDeleteMessage={onDeleteMessage}
            allMembers={allMembers}
          />
        }
        <div styleName="feed-actions">
          <div>{!!topicHeader && commentsToggle}</div>
          {allowComments && <button className="tc-btn tc-btn-link tc-btn-md" onClick={this.toggleNewCommentMobile}>Write a post</button>}
        </div>
        {children}
        {isNewCommentMobileOpen &&
          <NewPostMobile
            step={NEW_POST_STEP.COMMENT}
            statusTitle="NEW STATUS"
            commentTitle="WRITE POST"
            statusPlaceholder="Share the latest project updates with the team"
            commentPlaceholder="Write your post about the status here"
            submitText="Post"
            nextStepText="Add a post"
            onClose={this.toggleNewCommentMobile}
            onPost={this.onAddNewComment}
            isCreating={isAddingComment}
            hasError={error}
            onNewPostChange={this.onNewCommentChange}
          />
        }
      </div>
    )
  }
}

FeedMobile.propTypes = {
  user: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  topicMessage: PropTypes.any,
  allowComments: PropTypes.bool.isRequired,
  hasMoreComments: PropTypes.bool,
  comments: PropTypes.array,
  children: PropTypes.any,
  onLoadMoreComments: PropTypes.func.isRequired,
  onNewCommentChange: PropTypes.func,
  onAddNewComment: PropTypes.func.isRequired,
  onSaveMessageChange: PropTypes.func,
  onSaveMessage: PropTypes.func.isRequired,
  onDeleteMessage: PropTypes.func.isRequired,
  onTopicChange: PropTypes.func,
  onSaveTopic: PropTypes.func,
  onDeleteTopic: PropTypes.func,
  isAddingComment: PropTypes.bool
}

export default FeedMobile
