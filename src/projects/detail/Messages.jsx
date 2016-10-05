import React from 'react'
import MessagesContainer from './containers/MessagesContainer'


require('./Messages.scss')

const Messages = ({ project, currentMemberRole }) => (
  <MessagesContainer project={ project } currentMemberRole={ currentMemberRole } />
)
export default Messages
