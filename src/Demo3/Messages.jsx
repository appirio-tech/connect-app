import React from 'react'
import MessagesContainer from './containers/MessagesContainer'
import './Demo3.scss'
import {Link} from 'react-router'

const Messages = () => (
  <div>
    <div>
      <Link to="/dashboard">Dashboard</Link>
      {' '}
      <Link to="/messages">Messages</Link>
    </div>
    
    <MessagesContainer />
  </div>
)
export default Messages
