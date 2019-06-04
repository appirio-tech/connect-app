/**
 * The main purpose of this component is to bind methods which require feed.id 
 * so that we don't re-create them on every render like: 
 * onNewCommentChange: onNewCommentChange.bind(this, feed.id)
 * So inside Feed component we can use shouldComponentUpdate to compare properties 
 * and only render if properties are changed.
 * 
 * If we define methods like this
 * onNewCommentChange: onNewCommentChange.bind(this, feed.id)
 * then such function would be recreated on every render and shouldComponentUpdate
 * will return true for every render.
 */
import React from 'react'
import _ from 'lodash'

import ScrollableFeed from '../../../components/Feed/ScrollableFeed'
import { scrollToHash } from '../../../components/ScrollToAnchors'

const bindMethods = [
  'onNewCommentChange',
  'onAddNewComment',
  'onLoadMoreComments',
  'onEditMessage',
  'onSaveMessageChange',
  'onSaveMessage',
  'onDeleteMessage',
  'onEditTopic',
  'onTopicChange',
  'onSaveTopic',
  'onDeleteTopic',
  'onEnterFullscreenClick',
]

class SingleFeedContainer extends React.Component {
  constructor(props) {
    super(props)

    bindMethods.forEach((method) => {
      // We cannot use an arrow function here, as later other component can apply .bind to these methods
      this[method] = function() {
        // we cannot use .bind here as we already bound "this" in these methods to another React component and we don't want to override it
        return this.props[method](...[this.props.id, ...arguments])
      }.bind(this)
    })
  }

  componentDidMount() {
    // we use this to just scroll to a feed block or comment in a feed block,
    // only if there is a url hash and the feed id and comment id match this feed
    const scrollTo = window.location.hash ? window.location.hash.substring(1) : null
    if (scrollTo) {
      const hashParts = _.split(scrollTo, '-')
      const hashId = parseInt(hashParts[1], 10)
      if (
        (hashParts[0] === 'feed' && hashId === this.props.id) ||
        (hashParts[0] === 'comment' && this.props.comments && _.some(this.props.comments, { id: hashId }))
      ) {
        setTimeout(() => scrollToHash(scrollTo), 100)
      }
    }
  }

  render() {
    const nonBindProps = _.omit(this.props, bindMethods)
    const bindProps = _.zipObject(bindMethods, bindMethods.map((method) => this[method]))

    return (
      <ScrollableFeed
        {...{
          ...nonBindProps,
          ...bindProps,
          id: nonBindProps.id.toString(), // convert it to string for `ScrollElement`
          topicId: nonBindProps.id,       // add topic id as a number, for `Feed`
        }}
      />
    )
  }
}

export default SingleFeedContainer