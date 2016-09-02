import React, {PropTypes} from 'react'
import moment from 'moment'
import cn from 'classnames'
import ActionCard from '../ActionCard/ActionCard'
import Panel from '../Panel/Panel'
import FeedComments from './FeedComments'

const Feed = (props) => {
  const {
    user, currentUser, title, date, html, totalComments, hasMoreComments, onLoadMoreComments, isLoadingMoreComments,
    allowComments, comments, unread, children, onNewCommentChange, onAddNewComment, newComment
  } = props
  return (
    <ActionCard>
      <Panel.Body className={cn({active: unread})}>
        <div className="portrait">
          <img src={user.photoURL} alt=""/>
        </div>
        <div className="object">
          <div className="card-title">
            {title}
          </div>
          <div className="card-profile">
            <div className="card-author">
              {user.firstName} {user.lastName}
            </div>
            <div className="card-time">
              {moment(date).fromNow()}
            </div>
          </div>
          <div className="card-body draftjs-post" dangerouslySetInnerHTML={{__html: html}}>
          </div>
        </div>
      </Panel.Body>
      {allowComments &&
      <FeedComments
        totalComments={totalComments}
        hasMoreComments={hasMoreComments}
        onLoadMoreComments={onLoadMoreComments}
        onChange={onNewCommentChange}
        onAdd={onAddNewComment}
        content={newComment}
        isLoadingMoreComments={isLoadingMoreComments}
        currentUser={currentUser}
        avatarUrl={currentUser.photoURL}
        comments={comments}
      />}
      {children}
    </ActionCard>
  )
}

Feed.propTypes = {
  user: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  html: PropTypes.string.isRequired,
  allowComments: PropTypes.bool.isRequired,
  hasMoreComments: PropTypes.bool,
  comments: PropTypes.array,
  children: PropTypes.any,
  onLoadMoreComments: PropTypes.func.isRequired,
  onNewCommentChange: PropTypes.func.isRequired,
  onAddNewComment: PropTypes.func.isRequired
}

export default Feed
