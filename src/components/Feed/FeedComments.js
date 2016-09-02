import React, {PropTypes} from 'react'
import moment from 'moment'
import Panel from '../Panel/Panel'
import AddComment from '../ActionCard/AddComment'
import Comment from '../ActionCard/Comment'
import cn from 'classnames'

const getCommentCount = (totalComments) => {
  if (!totalComments) {
    return 'No comments yet'
  }
  if (totalComments === 1) {
    return '1 comment'
  }
  return `${totalComments} comments`
}

const FeedComments = (props) => {
  const {
    comments, currentUser, totalComments, onLoadMoreComments, isLoadingMoreComments, hasMoreComments, onAdd,
    onChange, content, avatarUrl
  } = props
  return (
    <div>
      <Panel.Body className="comment-count-container">
        <div className="portrait">  </div>
        <div className="object">
          <div className="card-body comment-section">
            <div className="comment-count">
              {getCommentCount(totalComments)}
            </div>
            <hr className={cn({'no-margin': !comments.length})} />
            {hasMoreComments && <div className="comment-collapse">
              <a href="javascript:" onClick={onLoadMoreComments} className="comment-collapse-button">
                {isLoadingMoreComments ? 'Loading...' : 'View older comments'}
              </a>
            </div>}
          </div>
        </div>
      </Panel.Body>
      {comments.map((item) =>
        <Comment
          key={item.id}
          avatarUrl={item.author.photoURL}
          authorName={item.author.firstName + ' ' + item.author.lastName}
          date={moment(item.date).fromNow()}
          active={item.unread}
          self={item.author.userId === currentUser.userId}
        >
          {item.content}
        </Comment>
      )}
      <AddComment placeholder="Create a new comment..." onAdd={onAdd} onChange={onChange} content={content} avatarUrl={avatarUrl} />
    </div>
  )
}

FeedComments.propTypes = {
  comments: PropTypes.array.isRequired
}

export default FeedComments
