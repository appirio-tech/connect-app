/**
 * Posts View component which shows loader while post is loading
 */
import React from 'react'
import _ from 'lodash'
import { withRouter } from 'react-router-dom'

import ScrollableFeed from '../Feed/ScrollableFeed'
import spinnerWhileLoading from '../LoadingSpinner'
import { scrollToHash } from '../ScrollToAnchors'

import './PostsView.scss'

class PostsView extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    !_.isEmpty(this.props.location.hash) && this.handleUrlHash(this.props)
  }

  // when the topic is actually loaded/rendered scroll to the appropriate post depending on url hash
  handleUrlHash(props) {
    setTimeout(() => scrollToHash(props.location.hash), 100)
  }

  render() {
    return (
      <div styleName="container">
        <ScrollableFeed
          {...{
            ..._.omit(this.props, 'feed'),
            ...this.props.feed,
            id: (this.props.feed ? this.props.feed.id.toString() : '0'),
            commentId: this.props.commentId
          }}
        />
      </div>
    )
  }
}

const enhance = spinnerWhileLoading(props => !props.isLoading)
const EnhancedPostsView = enhance(withRouter(PostsView))

export default EnhancedPostsView
