/**
 * Flying chat button
 */
import React from 'react'
import PT from 'prop-types'

import './ChatButton.scss'
import ChatIcon from '../../assets/icons/chat.svg'

const ChatButton = ({ onClick }) => (
  <div styleName="button" onClick={onClick}>
    <ChatIcon />
  </div>
)

ChatButton.propTypes = {
  onClick: PT.func
}

export default ChatButton
