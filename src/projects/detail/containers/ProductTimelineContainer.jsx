/**
 * Product Timeline Container
 *
 * Currently it only shows the loader when timeline is being loaded
 * and passes some props from the store.
 * Initially this container was also loaded timelines,
 * but loading was moved to projectDashboard actions,
 * as timelines data is also needed outside of timeline container.
 *
 * So now this container becomes quite trivial and may be abolished if needed.
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { connect } from 'react-redux'

import Timeline from '../components/timeline/Timeline'

import {
  createProductMilestone,
  updateProductMilestone,
  completeProductMilestone,
  completeFinalFixesMilestone,
  extendProductMilestone,
  submitFinalFixesRequest,
  submitDeliverableFinalFixesRequest,
} from '../../actions/productsTimelines'

class ProductTimelineContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      // show loader for the whole timeline even if updating only one milestone
      // here is why https://github.com/appirio-tech/connect-app/issues/2291#issuecomment-410968047

      // https://github.com/appirio-tech/connect-app/issues/2422
      // Simply return Timeline component here.
      // Move out loading indicator to Timeline so the height can be maintained in there.
      <Timeline {...this.props} />
    )
  }
}

ProductTimelineContainer.propTypes = {
  currentUser: PT.shape({
    userId: PT.number.isRequired,
  }).isRequired,
  isLoading: PT.bool,
  timeline: PT.object,
  updateProductMilestone: PT.func.isRequired,
  completeProductMilestone: PT.func.isRequired,
  extendProductMilestone: PT.func.isRequired,
}

const mapStateToProps = ({ productsTimelines, loadUser }, props) => ({
  timeline: _.get(productsTimelines[props.product.id], 'timeline'),
  isLoading: _.get(productsTimelines[props.product.id], 'isLoading', false),
  phaseId: props.product.phaseId,
  currentUser: {
    userId: parseInt(loadUser.user.id, 10),
  },
})

const mapDispatchToProps = {
  updateProductMilestone,
  createProductMilestone,
  completeProductMilestone,
  completeFinalFixesMilestone,
  extendProductMilestone,
  submitFinalFixesRequest,
  submitDeliverableFinalFixesRequest,
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductTimelineContainer)
