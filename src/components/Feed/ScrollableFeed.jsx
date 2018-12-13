/**
 * Feed with support of scrolling
 */
import React from 'react'
import { ScrollElement } from 'react-scroll'
import Feed from './Feed'

// we need this workaround because `ScrollElement` accepts `id` as a String
// while `Feed` accepts `id` as a Number
// so parent component passes `id` as a String for `ScrollElement`
// and `topicId` as a Number, and here we rename `topicId` back to `id` for `Feed`
const FeedWithId = ({ topicId, ...props }) => (
  <Feed {...{ ...props, id: topicId }} />
)

const ScrollableFeed = ScrollElement(FeedWithId) // eslint-disable-line new-cap

export default ScrollableFeed
