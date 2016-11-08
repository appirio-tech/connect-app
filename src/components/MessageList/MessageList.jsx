import React, {Component, PropTypes} from 'react'
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
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null
  const excerpt = lastMessage ? strip(lastMessage.content).split(' ').slice(0, 15).join(' ') : 'Loading...'

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
      {(!unreadCount && lastMessage && lastMessage.date) && formatTime(lastMessage.date)}
    </div>
  </div>)
}


class MessageList extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { scrollPosition } = this.props
    if (scrollPosition) {
      const panelMessages = this.refs.panelMessages
      // We use requestAnimationFrame because this function may be executed before
      // the DOM elements are actually drawn.
      // Source: http://stackoverflow.com/a/28748160
      requestAnimationFrame(() => {
        panelMessages.scrollTop += scrollPosition
      })
    }
  }

  render() {
    const {threads, onSelect, onAdd, showAddButton, showEmptyState } = this.props
    return (
      <Panel className="message-list">
        <Panel.Title>
          Discussions
          { showAddButton && <Panel.AddBtn onClick={onAdd} /> }
        </Panel.Title>
        <div className="panel-messages" ref="panelMessages">
          { showEmptyState && <MessageRow title="First discussion post" isActive messages={[{ content: ''}]} /> }
          {threads.map((item) => <MessageRow key={item.id} onClick={(e) => onSelect(item, e) } {...item} />)}
        </div>
      </Panel>
    )
  }
}

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
  onSelect: PropTypes.func.isRequired,

  /**
   * Flag to toggle the rendering of the button to add new message
   */
  showAddButton: PropTypes.bool.isRequired
}

export default MessageList
