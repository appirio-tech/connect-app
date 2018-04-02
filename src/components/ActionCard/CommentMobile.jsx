/**
 * Comment component for mobile devices
 *
 * It's much simpler than desktop component and doesn't have edit/delete functionality
 */
import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import moment from 'moment'
import { Link } from 'react-router-dom'
import UserWithName from '../User/UserWithName'

import './CommentMobile.scss'

const CommentMobile = ({ messageId, author, date, children }) => {
  const messageLink = window.location.pathname.substr(0, window.location.pathname.indexOf('#')) + `#comment-${messageId}`

  return (
    <div styleName="comment">
      <div styleName="header">
        <UserWithName {..._.pick(author, 'firstName', 'lastName', 'photoUR')} size="40" />
        <Link styleName="date" to={messageLink}>{moment(date).fromNow()}</Link>
      </div>
      <div styleName="text">{children}</div>
    </div>
  )
}

CommentMobile.propTypes = {
  messageId: PropTypes.string.isRequired,
  author: PropTypes.any.isRequired,
  date: PropTypes.any.isRequired,
  children: PropTypes.node.isRequired
}

export default CommentMobile
