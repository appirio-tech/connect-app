/**
 * Wrapper for the Feed of phase
 * which shows loader while feed is loading
 * and transforms properties to the shape of Feed
 */
import React from 'react'
import _ from 'lodash'
import { withRouter } from 'react-router-dom'

import ScrollableFeed from '../../../../components/Feed/ScrollableFeed'
import spinnerWhileLoading from '../../../../components/LoadingSpinner'
import { scrollToHash } from '../../../../components/ScrollToAnchors'

import './PhaseFeed.scss'

class PhaseFeedView extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    !_.isEmpty(this.props.location.hash) && this.handleUrlHash(this.props)
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props
    if (!_.isEmpty(location.hash) && location.hash !== prevProps.location.hash) {
      this.handleUrlHash(this.props)
    }
  }

  // when the phase feed is actually loaded/rendered scroll to the appropriate post depending on url hash
  handleUrlHash(props) {
    const hashParts = _.split(location.hash.substring(1), '-')
    const phaseId = hashParts[0] === 'phase' ? parseInt(hashParts[1], 10) : null
    if (phaseId === props.phaseId) {
      scrollToHash(props.location.hash)
    }
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
const EnhancedPhaseFeedView = enhance(withRouter(PhaseFeedView))

export default EnhancedPhaseFeedView
