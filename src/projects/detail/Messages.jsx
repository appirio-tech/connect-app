import React from 'react'
import MessagesContainer from './containers/MessagesContainer'


require('./Messages.scss')

const Messages = ({ location, project, currentMemberRole, route }) => (
  <MessagesContainer
    location={ location }
    project={ project }
    currentMemberRole={ currentMemberRole }
    route={ route }
  />
)
export default Messages
