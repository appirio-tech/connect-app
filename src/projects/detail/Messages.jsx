import React from 'react'
import MessagesContainer from './containers/MessagesContainer'


require('./Messages.scss')

const Messages = ({ location, project, currentMemberRole, route, params }) => (
  <MessagesContainer
    location={ location }
    project={ project }
    currentMemberRole={ currentMemberRole }
    route={ route }
    params={ params }
  />
)
export default Messages
