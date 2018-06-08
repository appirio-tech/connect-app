import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import AddComment from '../ActionCard/AddComment'
import Comment from '../ActionCard/Comment'
import cn from 'classnames'
import {markdownToHTML} from '../../helpers/markdownToState'
import MediaQuery from 'react-responsive'
import CommentMobile from '../ActionCard/CommentMobile'
import { SCREEN_BREAKPOINT_MD } from '../../config/constants'

import './FeedComments.scss'

function formatCommentDate(date) {
  const today = moment()

  let formated = date.format('MMM D')

  // if another year
  if (!date.isSame(today, 'year')) {
    formated += `, ${formated.format('YYYY')}`

    // if today
  } else if (date.isSame(today, 'day')) {
    formated = 'Today'

  // if yesterday
  } else if (date.isSame(today.subtract(1, 'day'), 'day')) {
    formated = 'Yesterday'
  }

  return formated
}

class FeedComments extends React.Component {
  constructor(props) {
    super(props)
    this.state = { showAll: false }
  }

  onSaveMessageChange(messageId, content, editMode) {
    this.props.onSaveMessageChange && this.props.onSaveMessageChange(messageId, content, editMode)
  }

  render() {
    const {
      comments, currentUser, onLoadMoreComments, isLoadingComments, hasMoreComments, onAddNewComment,
      onNewCommentChange, error, avatarUrl, isAddingComment, allowComments, onSaveMessage, onDeleteMessage, allMembers
    } = this.props
    let authorName = currentUser.firstName
    if (authorName && currentUser.lastName) {
      authorName += ' ' + currentUser.lastName
    }
    const handleLoadMoreClick = () => {
      this.setState({showAll: true})
      // TODO - handle the case when a topic has more than 20 comments
      // since those will have to retrieved from the server
      if (!isLoadingComments) {
        onLoadMoreComments()
      }
    }

    const desktopBlocks = []

    if (hasMoreComments) {
      desktopBlocks.push(
        <div styleName="load-more" key="load-more">
          <a href="javascript:" onClick={ handleLoadMoreClick } styleName="load-btn">
            {isLoadingComments ? 'Loading...' : 'load earlier posts'}
          </a>
        </div>
      )
    }

    comments && comments.forEach((item, idx) => {
      const createdAt = moment(item.createdAt)
      const prevComment = comments[idx - 1]
      const isSameAuthor = prevComment && prevComment.author.userId === item.author.userId
      const isSameDay = prevComment && moment(prevComment.createdAt).isSame(createdAt, 'day')
      const isFirstUnread = prevComment && !prevComment.unread && item.unread

      if (!isSameDay) {
        desktopBlocks.push(
          <div
            key={`date-splitter-${createdAt.valueOf()}`}
            styleName={cn('date-splitter', { 'unread-splitter': isFirstUnread })}
          >
            <span styleName="date">{formatCommentDate(createdAt)}</span>
            <span styleName="unread">New posts</span>
          </div>
        )
      } else if (isFirstUnread) {
        <div styleName="unread-splitter" key="unread-splitter">
          <span styleName="unread">New posts</span>
        </div>
      }

      desktopBlocks.push(
        <Comment
          key={idx}
          message={item}
          author={item.author}
          date={moment(item.date).fromNow()}
          edited={item.edited}
          active={item.unread}
          self={item.author && item.author.userId === currentUser.userId}
          onChange={this.onSaveMessageChange.bind(this, item.id)}
          onSave={onSaveMessage}
          onDelete={onDeleteMessage}
          isSaving={item.isSavingComment}
          hasError={item.error}
          allMembers={allMembers}
          noInfo={isSameAuthor}
        >
          <div dangerouslySetInnerHTML={{__html: markdownToHTML(item.content)}} />
        </Comment>
      )
    })

    return (
      <div styleName="container">
        <MediaQuery minWidth={SCREEN_BREAKPOINT_MD}>
          {(matches) => (matches ? (
            <div>
              <div styleName="comments">
                {desktopBlocks}
              </div>
              {allowComments &&
                <div styleName="add-comment" key="add-comment">
                  <AddComment
                    placeholder="Write a post"
                    onAdd={onAddNewComment}
                    onChange={onNewCommentChange}
                    avatarUrl={avatarUrl}
                    authorName={authorName}
                    isAdding={isAddingComment}
                    hasError={error}
                    allMembers={allMembers}
                  />
                </div>
              }
            </div>
          ) : (
            <div>
              {hasMoreComments &&
                <div styleName="load-more" key="load-more">
                  <a href="javascript:" onClick={ handleLoadMoreClick } styleName="load-btn">
                    {isLoadingComments ? 'Loading...' : 'load earlier posts'}
                  </a>
                </div>
              }
              {comments.map((item, idx) => (
                <CommentMobile
                  key={idx}
                  messageId={item.id.toString()}
                  author={item.author}
                  date={item.date}
                >
                  <div dangerouslySetInnerHTML={{__html: markdownToHTML(item.content)}} />
                </CommentMobile>
              ))}
            </div>
          ))}
        </MediaQuery>
      </div>
    )
  }
}
FeedComments.defaultProps = {
  comments: []
}
FeedComments.propTypes = {
  comments: PropTypes.array
}

export default FeedComments
