import React, {PropTypes} from 'react'
import moment from 'moment'
import cn from 'classnames'
import ActionCard from '../ActionCard/ActionCard'
import Panel from '../Panel/Panel'
import FeedComments from './FeedComments'
import { Avatar } from 'appirio-tech-react-components'
import {Link} from 'react-router'

const Feed = (props) => {
  const {
    user, currentUser, title, date, html, totalComments, hasMoreComments, onLoadMoreComments, isLoadingComments,
    allowComments, comments, unread, children, onNewCommentChange, onAddNewComment, newComment, isAddingComment,
    permalink
  } = props
  let authorName = user.firstName
  if (authorName && user.lastName) {
    authorName += ' ' + user.lastName
  }
  return (
    <ActionCard>
      <Panel.Body className={cn({active: unread})}>
        <div className="portrait">
          <Avatar avatarUrl={ user.photoURL } userName={ authorName } />
        </div>
        <div className="object">
          <div className="card-title">
            {title}
          </div>
          <div className="card-profile">
            <div className="card-author">
              { authorName }
            </div>
            <div className="card-time">
              <Link to={ permalink }>{moment(date).fromNow()}</Link>
            </div>
          </div>
          <div className="card-body draftjs-post" dangerouslySetInnerHTML={{__html: html}} />
        </div>
      </Panel.Body>
      <FeedComments
        allowComments={ allowComments }
        totalComments={totalComments}
        hasMoreComments={hasMoreComments}
        onLoadMoreComments={onLoadMoreComments}
        onChange={onNewCommentChange}
        onAdd={onAddNewComment}
        content={newComment}
        isLoadingComments={isLoadingComments}
        currentUser={currentUser}
        avatarUrl={currentUser.photoURL}
        comments={comments}
        isAddingComment={ isAddingComment }
      />
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
  onAddNewComment: PropTypes.func.isRequired,
  isAddingComment: PropTypes.bool
}

export default Feed
