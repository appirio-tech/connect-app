import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import _ from 'lodash'
import AddComment from '../ActionCard/AddComment'
import Comment from '../ActionCard/Comment'
import cn from 'classnames'
import {markdownToHTML} from '../../helpers/markdownToState'
import MediaQuery from 'react-responsive'
import CommentMobile from '../ActionCard/CommentMobile'
import { SCREEN_BREAKPOINT_MD, POSTS_BUNDLE_TIME_DIFF } from '../../config/constants'

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
    const mobileBlocks = []

    const loadMoreTemplate = (
      <div styleName="load-more" key="load-more">
        <a href="javascript:" onClick={ handleLoadMoreClick } styleName="load-btn">
          {isLoadingComments ? 'Loading...' : 'load earlier posts'}
        </a>
      </div>
    )

    let bundleCreatedAt = false
    let isBundleEdited = false
    let bundleIndex = -1

    // to be able to mark the head comment in a bundle as edited if any of the comments in the bundle is edited
    comments && _.forEach(comments, (item, idx) => {
      const createdAt = moment(item.createdAt)
      const prevComment = comments[idx - 1]
      const prevCreatedAt = prevComment && moment(prevComment.createdAt)
      const isSameDay = prevCreatedAt && prevCreatedAt.isSame(createdAt, 'day')
      const isSameAuthor = prevComment && prevComment.author.userId === item.author.userId
      const isFirstUnread = prevComment && !prevComment.unread && item.unread

      const timeDiffComment = bundleCreatedAt && createdAt.diff(bundleCreatedAt)
      const shouldBundle = isSameDay && isSameAuthor && !isFirstUnread && timeDiffComment && timeDiffComment <= POSTS_BUNDLE_TIME_DIFF

      if (shouldBundle) {
        isBundleEdited = isBundleEdited || item.edited
        item.noInfo = true
      } else {
        const bundleStart = comments[bundleIndex]
        if (bundleStart) {
          bundleStart.edited = isBundleEdited
        }
        bundleIndex = idx
        isBundleEdited = item.edited
        bundleCreatedAt = createdAt
        item.noInfo = false
      }

      if (idx === (comments.length - 1)) {
        const bundleStart = comments[bundleIndex]
        if (bundleStart) {
          bundleStart.edited = isBundleEdited
        }
      }
    })

    comments && _.forEach(comments, (item, idx) => {
      const createdAt = moment(item.createdAt)
      const prevComment = comments[idx - 1]
      const prevCreatedAt = prevComment && moment(prevComment.createdAt)
      const isSameDay = prevCreatedAt && prevCreatedAt.isSame(createdAt, 'day')
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

      if (idx === 0 && hasMoreComments) {
        desktopBlocks.push(loadMoreTemplate)
        mobileBlocks.push(loadMoreTemplate)
      }

      desktopBlocks.push(
        <Comment
          key={idx}
          message={item}
          author={item.author}
          date={item.createdAt}
          edited={item.edited}
          active={item.unread}
          self={item.author && item.author.userId === currentUser.userId}
          onChange={this.onSaveMessageChange.bind(this, item.id)}
          onSave={onSaveMessage}
          onDelete={onDeleteMessage}
          isSaving={item.isSavingComment}
          hasError={item.error}
          allMembers={allMembers}
          noInfo={item.noInfo}
        >
          <div dangerouslySetInnerHTML={{__html: markdownToHTML(item.content)}} />
        </Comment>
      )

      mobileBlocks.push(
        <CommentMobile
          key={idx}
          messageId={item.id.toString()}
          author={item.author}
          date={item.createdAt}
          noInfo={item.noInfo}
        >
          <div dangerouslySetInnerHTML={{__html: markdownToHTML(item.content)}} />
        </CommentMobile>
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
              {mobileBlocks}
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
