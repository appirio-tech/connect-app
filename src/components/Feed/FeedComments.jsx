import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import Panel from '../Panel/Panel'
import AddComment from '../ActionCard/AddComment'
import Comment from '../ActionCard/Comment'
import cn from 'classnames'
import {markdownToHTML} from '../../helpers/markdownToState'
import MediaQuery from 'react-responsive'
import CommentMobile from '../ActionCard/CommentMobile'
// import { THREAD_MESSAGES_PAGE_SIZE } from '../../config/constants'

const getCommentCount = (totalComments) => {
  if (!totalComments) {
    return 'No comments yet'
  }
  if (totalComments === 1) {
    return '1 comment'
  }
  return `${totalComments} comments`
}

class FeedComments extends React.Component {
  constructor(props) {
    super(props)
    this.state = { showAll: false }
  }

  onSaveMessageChange(messageId, content, editMode) {
    this.props.onSaveMessageChange(messageId, content, editMode)
  }

  render() {
    const {
      comments, currentUser, totalComments, onLoadMoreComments, isLoadingComments, hasMoreComments, onAddNewComment,
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

    // let _comments = comments
    // let _hasMoreComments = hasMoreComments
    // if (!this.state.showAll && _comments.length > THREAD_MESSAGES_PAGE_SIZE) {
    //   _comments = _comments.slice(-THREAD_MESSAGES_PAGE_SIZE)
    //   _hasMoreComments = true
    // }

    return (
      <div>
        <Panel.Body className="comment-count-container">
          <div className="portrait" />
          <div className="object">
            <div className="card-body comment-section">
              <div className="comment-count">
                {getCommentCount(totalComments)}
              </div>
              {hasMoreComments && <div className={cn('comment-collapse', {'loading-comments': isLoadingComments})}>
                <a href="javascript:" onClick={ handleLoadMoreClick } className="comment-collapse-button">
                  {isLoadingComments ? 'Loading...' : 'View older comments'}
                </a>
              </div>}
            </div>
          </div>
        </Panel.Body>
        <MediaQuery minWidth={768}>
          {(matches) => (matches ? (
            <div>
              {comments.map((item, idx) => (
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
                >
                  <div dangerouslySetInnerHTML={{__html: markdownToHTML(item.content)}} />
                </Comment>
              ))}
              {allowComments &&
                <AddComment
                  placeholder="Write a comment"
                  onAdd={onAddNewComment}
                  onChange={onNewCommentChange}
                  avatarUrl={avatarUrl}
                  authorName={authorName}
                  isAdding={isAddingComment}
                  hasError={error}
                  allMembers={allMembers}
                />
              }
            </div>
          ) : (
            <div>
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
FeedComments.propTypes = {
  comments: PropTypes.array.isRequired
}

export default FeedComments
