import React from 'react'
import MessagesContainer from './containers/MessagesContainer'


require('./Messages.scss')

const Messages = ({ location, project, route, params }) => (
  <MessagesContainer
    location={ location }
    project={ project }
    route={ route }
    params={ params }
  />
)
export default Messages
