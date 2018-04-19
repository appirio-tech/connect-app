/**
 * Message list for mobile devices
 */
import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import moment from 'moment'
import { Link } from 'react-router-dom'
import FeedComments from './FeedComments'
import UserWithName from '../User/UserWithName'
import NewPostMobile, { NEW_POST_STEP } from './NewPostMobile'
import { markdownToHTML } from '../../helpers/markdownToState'

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
      id, user, currentUser, date, topicMessage, totalComments, hasMoreComments, onLoadMoreComments, isLoadingComments,
      allowComments, comments, children, onNewCommentChange, onAddNewComment, isAddingComment, onSaveMessageChange,
      onEditMessage, onSaveMessage, onDeleteMessage, error, permalink, allMembers, title
    } = this.props
    const { isCommentsShown, isNewCommentMobileOpen } = this.state
    const commentsButtonText = isCommentsShown ?
      'Hide comments' :
      `${totalComments} ${totalComments > 1 ? 'comments' : 'comment'}`

    return (
      <div styleName="feed" id={`feed-${id}`}>
        <div styleName="header">
          <UserWithName {..._.pick(user, 'firstName', 'lastName', 'photoUR')} size="40" />
          <Link styleName="date" to={permalink}>{moment(date).fromNow()}</Link>
        </div>
        <h4 styleName="title">{title}</h4>
        <div styleName="text" dangerouslySetInnerHTML={{__html: markdownToHTML(topicMessage.content)}} />
        <div styleName="feed-actions">
          {totalComments > 0 ? (
            <button className="tc-btn tc-btn-link tc-btn-md" onClick={this.toggleComments}>{commentsButtonText}</button>
          ) : (
            <div styleName="no-comments">No comments yet</div>
          )}
          {allowComments && <button className="tc-btn tc-btn-link tc-btn-md" onClick={this.toggleNewCommentMobile}>Write a comment</button>}
        </div>
        {isCommentsShown &&
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
        {children}
        {isNewCommentMobileOpen &&
          <NewPostMobile
            step={NEW_POST_STEP.COMMENT}
            statusTitle="NEW STATUS"
            commentTitle="WRITE COMMENT"
            statusPlaceholder="Share the latest project updates with the team"
            commentPlaceholder="Write your comment about the status here"
            submitText="Post Comment"
            nextStepText="Add comment"
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
  topicMessage: PropTypes.any.isRequired,
  allowComments: PropTypes.bool.isRequired,
  hasMoreComments: PropTypes.bool,
  comments: PropTypes.array,
  children: PropTypes.any,
  onLoadMoreComments: PropTypes.func.isRequired,
  onNewCommentChange: PropTypes.func.isRequired,
  onAddNewComment: PropTypes.func.isRequired,
  onSaveMessageChange: PropTypes.func.isRequired,
  onSaveMessage: PropTypes.func.isRequired,
  onDeleteMessage: PropTypes.func.isRequired,
  onTopicChange: PropTypes.func.isRequired,
  onSaveTopic: PropTypes.func.isRequired,
  onDeleteTopic: PropTypes.func.isRequired,
  isAddingComment: PropTypes.bool
}

export default FeedMobile
