import React, {PropTypes} from 'react'
import moment from 'moment'
import './MessageDetails.scss'
import ActionCard from '../ActionCard/ActionCard'
import BtnSeparator from '../ActionCard/BtnSeparator'
import Comment from '../ActionCard/Comment'
import AddComment from '../ActionCard/AddComment'

const MessageDetails = ({title, messages, onLoadMoreMessages, hasMoreMessages, newMessage, onNewMessageChange, onAddNewMessage, isLoading, currentUser}) => (
  <ActionCard className="main-messaging">
    <ActionCard.Header title={title}>
      {hasMoreMessages && <BtnSeparator onClick={onLoadMoreMessages}>
        {isLoading ? 'Loading...' : 'Load earlier messages'}
      </BtnSeparator>}
    </ActionCard.Header>
    {messages.map((item) => 
      <Comment
        key={item.id}
        avatarUrl={item.author.photoURL}
        authorName={item.author.firstName + ' ' + item.author.lastName}
        date={moment(item.date).fromNow()}
        active={item.unread}
        self={item.author.userId === currentUser.userId}
      >
        {item.content}
      </Comment>
    )}
    
    <AddComment
      className="messaging-comment-section"
      avatarUrl={currentUser.photoURL}
      onAdd={onAddNewMessage}
      onChange={onNewMessageChange}
      content={newMessage}
    />
  </ActionCard>
)

MessageDetails.propTypes = {
  /**
   * The thread title
   */
  title: PropTypes.string.isRequired,

  /**
   * The messages to display
   */
  messages: PropTypes.array.isRequired,

  /**
   * Callback fired when "Load earlier messages" is clicked
   *
   * function (
   *  SyntheticEvent event?
   * )
   */
  onLoadMoreMessages: PropTypes.func.isRequired,

  /**
   * The flag if "earlier messages" are loading
   */
  isLoading: PropTypes.bool,

  /**
   * The content of new added message
   */
  newMessage: PropTypes.string,

  /**
   * Callback fired when a new message is changed
   *
   * function (
   *  String message,
   *  SyntheticEvent event?
   * )
   */
  onNewMessageChange: PropTypes.func.isRequired,

  /**
   * Callback fired when a new message is added (confirmed)
   *
   * function (
   *  SyntheticEvent event?
   * )
   */
  onAddNewMessage: PropTypes.func.isRequired,

  /**
   * The current logged in user
   */
  currentUser: PropTypes.object.isRequired
}

export default MessageDetails
