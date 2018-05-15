import React from 'react'
import PT from 'prop-types'
import './PostFeed.scss'

const PostFeed = (props) => {
  return (
    <div styleName="post-feed">
      <div styleName="thumb-wrap">
        <figure styleName="thumb" />
      </div>
      <div styleName="post-content">
        <header styleName="head"><h3>{props.postTitle}</h3> <span styleName="timestamp">{props.timeStamp}</span></header>
        <div styleName="post-text">{props.postContent}</div>
      </div>
    </div>
  )
}

PostFeed.propTypes = {
  thumb: PT.string,
  postTitle: PT.string,
  timeStamp: PT.string,
  postContent: PT.string
}

export default PostFeed
