import React, {PropTypes} from 'react'
import moment from 'moment'
import Panel from '../Panel/Panel'
import AddComment from '../ActionCard/AddComment'
import Comment from '../ActionCard/Comment'
import cn from 'classnames'
import { THREAD_MESSAGES_PAGE_SIZE } from '../../config/constants'

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

  render() {
    const {
    comments, currentUser, totalComments, /*onLoadMoreComments,*/ isLoadingComments, hasMoreComments, onAdd,
    onChange, content, avatarUrl, isAddingComment
  } = this.props
    let authorName = currentUser.firstName
    if (authorName && currentUser.lastName) {
      authorName += ' ' + currentUser.lastName
    }
    const handleLoadMoreClick = () => {
      this.setState({showAll: true})
    // TODO - handle the case when a topic has more than 20 comments
    // since those will have to retrieved from the server
    // if (!isLoadingComments) {
    //   onLoadMoreComments()
    // }
    }

    let _comments = comments
    let _hasMoreComments = hasMoreComments
    if (!this.state.showAll && _comments.length > THREAD_MESSAGES_PAGE_SIZE) {
      _comments = _comments.slice(-THREAD_MESSAGES_PAGE_SIZE)
      _hasMoreComments = true
    }

    return (
    <div>
      <Panel.Body className="comment-count-container">
        <div className="portrait" />
        <div className="object">
          <div className="card-body comment-section">
            <div className="comment-count">
              {getCommentCount(totalComments)}
            </div>
            <hr className={cn({'no-margin': !comments.length})} />
            {_hasMoreComments && <div className={cn('comment-collapse', {'loading-comments': isLoadingComments})}>
              <a href="javascript:" onClick={ handleLoadMoreClick } className="comment-collapse-button">
                {isLoadingComments ? 'Loading...' : 'View older comments'}
              </a>
            </div>}
          </div>
        </div>
      </Panel.Body>
      {_comments.map((item, idx) =>
        <Comment
          key={idx}
          avatarUrl={item.author.photoURL}
          authorName={item.author.firstName + ' ' + item.author.lastName}
          date={moment(item.date).fromNow()}
          active={item.unread}
          self={item.author.userId === currentUser.userId}
        >
          <div dangerouslySetInnerHTML={{__html: item.content}} />
        </Comment>
      )}
      <AddComment
        placeholder="Create a new comment..."
        onAdd={onAdd}
        onChange={onChange}
        content={content}
        avatarUrl={avatarUrl}
        authorName={ authorName }
        isAdding={ isAddingComment }
      />
    </div>
  )
  }
}
FeedComments.propTypes = {
  comments: PropTypes.array.isRequired
}

export default FeedComments
