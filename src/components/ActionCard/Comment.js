import React, {PropTypes} from 'react'
import cn from 'classnames'
import Panel from '../Panel/Panel'

const Comment = ({avatarUrl, authorName, date, children, active, self}) => (
  <Panel.Body active={active}>
    <div className="portrait">
      <img src={avatarUrl} alt="" />
    </div>
    <div className={cn('object comment', {self})}>
      <div className="card-profile">
        <div className="card-author">
          {authorName}
        </div>
        <div className="card-time">
          {date}
        </div>
      </div>
      <div className="comment-body">
        <p>
          {children}
        </p>
      </div>
    </div>
  </Panel.Body>
)

Comment.propTypes = {
  /**
   * The user avatar url
   */
  avatarUrl: PropTypes.string.isRequired,
  /**
   * The author name
   */
  authorName: PropTypes.string.isRequired,
  /**
   * The comment date (formatted) 
   */
  date: PropTypes.string.isRequired,
  /**
   * Flag if add orange left border
   */
  active: PropTypes.bool,
  /**
   * Flag if background is blue
   */
  self: PropTypes.bool,
  /**
   * The comment text
   */
  children: PropTypes.any.isRequired
}

export default Comment
