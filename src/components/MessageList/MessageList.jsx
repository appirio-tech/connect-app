import React, {PropTypes} from 'react'
import Panel from '../Panel/Panel'
import './MessageList.scss'
import cn from 'classnames'
import moment from 'moment'

const formatTime = (date) => {
  const now = moment()
  const diffSeconds = now.diff(date, 'seconds')
  if (diffSeconds < 60) {
    return diffSeconds + 's'
  }
  const diffMinutes = now.diff(date, 'minutes')
  if (diffMinutes < 60) {
    return diffMinutes + 'm'
  }
  const diffHours = now.diff(date, 'hours')
  if (diffHours < 24) {
    return diffHours + 'h'
  }
  const diffDays = now.diff(date, 'days')
  return diffDays + 'd'
}

const strip = (html) => {
  const tmp = document.createElement('DIV')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

const MessageRow = ({title, messages, isActive, unreadCount, onClick}) => {
  const lastMessage = messages[messages.length - 1]
  const excerpt = strip(lastMessage.content).split(' ').slice(0, 15).join(' ')

  return (<div className={cn('message', {active: isActive})} onClick={onClick}>
    <div className="message-body">
      <div className="message-title">
        {title}
      </div>
      <div className="message-subtitle">
        {excerpt}
      </div>
    </div>
    <div className="message-time">
      {unreadCount > 0 && <div className="badge">{unreadCount}</div>}
      {!unreadCount && formatTime(lastMessage.date)}
    </div>
  </div>)
}


const MessageList = ({threads, onSelect, onAdd}) => (
  <Panel className="message-list">
    <Panel.Title>
      Messages
      <Panel.AddBtn onClick={onAdd} />
    </Panel.Title>
    <div className="panel-messages">
      {threads.map((item) => <MessageRow key={item.threadId} onClick={(e) => onSelect(item, e) } {...item} />)}
    </div>
  </Panel>
)

MessageList.propTypes = {
  /**
   * The list of threads
   */
  threads: PropTypes.array.isRequired,

  /**
   * Callback fired when thread is selected
   *
   * function (
   *  Object thread,
   *  SyntheticEvent event?
   * )
   */
  onSelect: PropTypes.func.isRequired
}

export default MessageList
