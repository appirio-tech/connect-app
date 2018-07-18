/**
 * Wrapper for the Feed of phase
 * which shows loader while feed is loading
 * and transforms properties to the shape of Feed
 */
import React from 'react'
import _ from 'lodash'

import ScrollableFeed from '../ScrollableFeed'
import spinnerWhileLoading from '../../../../components/LoadingSpinner'

import './PhaseFeed.scss'

const PhaseFeedView = (props) => (
  <div styleName="container">
    <ScrollableFeed
      {...{
        ..._.omit(props, 'feed'),
        ...props.feed,
        id: (props.feed ? props.feed.id.toString() : '0'),
      }}
    />
  </div>
)

const enhance = spinnerWhileLoading(props => !props.isLoading)
const EnhancedPhaseFeedView = enhance(PhaseFeedView)

export default EnhancedPhaseFeedView
