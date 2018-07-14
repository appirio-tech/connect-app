import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { connect } from 'react-redux'

import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator'
import Timeline from '../components/timeline/Timeline'

import {
  loadProductTimelineWithMilestones,
  updateProductMilestone,
} from '../../actions/productsTimelines'

class ProductTimelineContainer extends React.Component {
  componentWillMount() {
    const {
      isLoading,
      timeline,
      loadProductTimelineWithMilestones,
      productId,
    } = this.props

    if (!isLoading && !timeline) {
      loadProductTimelineWithMilestones(productId)
    }
  }

  render() {
    const { isLoading, timeline } = this.props

    return (
      (isLoading || !timeline)
        ? <LoadingIndicator />
        : <Timeline {...this.props} />
    )
  }
}

ProductTimelineContainer.propTypes = {
  isLoading: PT.bool,
  timeline: PT.object.isRequired,
  loadProductTimelineWithMilestones: PT.func.isRequired,
  updateProductMilestone: PT.func.isRequired,
}

const mapStateToProps = ({ productsTimelines }, props) => ({
  timeline: _.get(productsTimelines[props.productId], 'timeline'),
  isLoading: _.get(productsTimelines[props.productId], 'isLoading', false),
})

const mapDispatchToProps = {
  loadProductTimelineWithMilestones,
  updateProductMilestone,
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductTimelineContainer)
