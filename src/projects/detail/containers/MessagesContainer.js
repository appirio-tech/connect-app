import React from 'react'
import MessageList from '../../../components/MessageList/MessageList'
import MessageDetails from '../../../components/MessageDetails/MessageDetails'
import NewPost from '../../../components/Feed/NewPost'
import { Sticky } from 'react-sticky'

let nextMessageId = 1

const randomMsg = (christina, dayDiff) => {
  const date = new Date()
  date.setDate(date.getDate() - dayDiff)
  const content = christina ?
    'Thanks Pat! We’ll look into it with the guys and get back to you as we have our winners. Is there a requirement of how many designs we can pick?'
    :
    'Hey Christina, that’s a great question. In general you can pick 3 winners, that’s included in the package. If you want to go beyond that you’ll have to pay extra for the winners, thus this will increase the total cost. Anything after 3-rd place costs additional $400 per submission. Hope this helps!'
  const id = nextMessageId++
  return {
    id,
    date,
    author: christina ? {
      userId: 1,
      firstName: 'Christina',
      lastName: 'Underwood',
      photoURL: require('../../../assets/images/profile1.jpg')
    } : {
      userId: 2,
      firstName: 'Patrick',
      lastName: 'Monahan',
      photoURL: require('../../../assets/images/avatar-patrick.png')
    },
    content: content + '\nMessage Id: ' + id
  }
}

export default class MessagesContainer extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      currentUser: {
        userId: 1,
        firstName: 'Christina',
        lastName: 'Underwood',
        photoURL: require('../../../assets/images/profile1.jpg')
      },
      threads: [
        {
          isActive: true,
          threadId: 1,
          title: 'Project Design challenges and solutions',
          hasMoreMessages: true,
          messages: [
            randomMsg(false, 3),
            randomMsg(true, 2),
            randomMsg(false, 1)
          ]
        },
        {
          threadId: 2,
          title: 'Code & Development talk',
          unreadCount: 1,
          hasMoreMessages: true,
          messages: [
            randomMsg(false, 3),
            randomMsg(true, 2),
            randomMsg(false, 1)
          ]
        },
        {
          threadId: 3,
          title: 'Topcoder Specific procedures and advanced requirements process discussion for all',
          hasMoreMessages: false,
          messages: [
            randomMsg(false, 3),
            randomMsg(true, 2),
            randomMsg(false, 1)
          ]
        }
      ]
    }
    this.state.threads[1].messages[2].unread = true
    this.onThreadSelect = this.onThreadSelect.bind(this)
    this.onLoadMoreMessages = this.onLoadMoreMessages.bind(this)
    this.onAddNewMessage = this.onAddNewMessage.bind(this)
    this.onNewMessageChange = this.onNewMessageChange.bind(this)
    this.onNewThread = this.onNewThread.bind(this)
  }

  onThreadSelect(thread) {
    this.setState({
      isCreateNewMessage: false,
      threads: this.state.threads.map((item) => {
        if (item.isActive) {
          if (item.threadId === thread.threadId) {
            return item
          }
          return {...item, isActive: false, messages: item.messages.map((msg) => ({...msg, unread: false}))}
        }
        if (item.threadId === thread.threadId) {
          return {...item, isActive: true, unreadCount: 0}
        }
        return item
      })
    })
  }

  onNewMessageChange(content) {
    this.setState({
      threads: this.state.threads.map((item) => {
        if (item.isActive) {
          return {...item, newMessage: content}
        }
        return item
      })
    })
  }

  onLoadMoreMessages() {
    let activeThreadId
    this.setState({
      threads: this.state.threads.map((item) => {
        if (item.isActive) {
          activeThreadId = item.threadId
          return {...item, isLoading: true}
        }
        return item
      })
    })
    setTimeout(() => {
      this.setState({
        threads: this.state.threads.map((item) => {
          if (item.threadId === activeThreadId) {
            return {
              ...item,
              isLoading: false,
              messages: [
                randomMsg(true, item.messages.length + 3),
                randomMsg(false, item.messages.length + 2),
                randomMsg(true, item.messages.length + 1),
                ...item.messages
              ]
            }
          }
          return item
        })
      })
    }, 700)
  }

  onAddNewMessage() {
    this.setState({
      threads: this.state.threads.map((item) => {
        if (item.isActive) {
          return {
            ...item,
            newMessage: '',
            messages: [...item.messages, {
              id: nextMessageId++,
              date: new Date(),
              author: this.state.currentUser,
              content: item.newMessage.replace(/\n/g, '<br />')
            }]
          }
        }
        return item
      })
    })
  }

  onNewThread({title, content}) {
    const threads = this.state.threads.map((item) => ({...item, isActive: false}))
    this.setState({
      isCreateNewMessage: false,
      threads: [
        {
          isActive: true,
          threadId: new Date().getTime(),
          title,
          hasMoreMessages: false,
          messages: [{
            id: new Date().getTime(),
            date: new Date(),
            author: this.state.currentUser,
            content
          }]
        },
        ...threads
      ]
    })
  }

  render() {
    const {threads, currentUser, isCreateNewMessage} = this.state
    const activeThread = threads.filter((item) => item.isActive)[0]

    return (
      <div className="container" style={{display: 'flex', width: '1110px', margin: '50px auto'}}>
        <div style={{width: '360px', marginRight: '30px'}}>
          <Sticky>
            <MessageList
              onAdd={() => this.setState({isCreateNewMessage: true})}
              threads={threads}
              onSelect={this.onThreadSelect}
            />
          </Sticky>
        </div>
        <div style={{width: '720px'}}>
          {
            isCreateNewMessage ?
              <NewPost
                currentUser={currentUser}
                onPost={this.onNewThread}
              />
              :
              <MessageDetails
                {...activeThread}
                onLoadMoreMessages={this.onLoadMoreMessages}
                onNewMessageChange={this.onNewMessageChange}
                onAddNewMessage={this.onAddNewMessage}
                currentUser={currentUser}
              />
          }
        </div>
      </div>
    )
  }
}
