import React from 'react'
import MessagesContainer from './containers/MessagesContainer'


require('./Messages.scss')

const Messages = ({ location, project, currentMemberRole }) => (
  <MessagesContainer location={ location } project={ project } currentMemberRole={ currentMemberRole } />
)
export default Messages
