import React from 'react'
import MessagesContainer from './containers/MessagesContainer'
import spinnerWhileLoading from '../../components/LoadingSpinner'

// This handles showing a spinner while the state is being loaded async
const spinner = spinnerWhileLoading(props => !props.isLoading)

const EnhancedMessagesContainer = spinner(MessagesContainer)

const Messages = ({ project, currentMemberRole }) => (
  <EnhancedMessagesContainer project={ project } currentMemberRole={ currentMemberRole } />
)
export default Messages
