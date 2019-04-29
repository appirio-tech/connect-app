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
      this[method] = () => this.props[method](this.props.id)
    })
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