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
import cn from 'classnames'

import UserWithName from '../User/UserWithName'
import { POST_TIME_FORMAT } from '../../config/constants.js'

import './CommentMobile.scss'

const CommentMobile = ({ messageId, author, date, children, noInfo }) => {
  const messageLink = window.location.pathname.substr(0, window.location.pathname.indexOf('#')) + `#comment-${messageId}`

  return (
    <div styleName={cn('comment', {'is-bundled' : noInfo})} id={`comment-${messageId}`}>
      {
        !noInfo &&
        <div styleName="header">
          <UserWithName {..._.pick(author, 'firstName', 'lastName', 'photoURL')} size="40" />
          <Link styleName="date" to={messageLink}>{moment(date).format(POST_TIME_FORMAT)}</Link>
        </div>
      }
      <div styleName="text">{children}</div>
    </div>
  )
}

CommentMobile.propTypes = {
  messageId: PropTypes.string.isRequired,
  author: PropTypes.any.isRequired,
  date: PropTypes.any.isRequired,
  children: PropTypes.node.isRequired,
  noInfo: PropTypes.bool
}

export default CommentMobile
