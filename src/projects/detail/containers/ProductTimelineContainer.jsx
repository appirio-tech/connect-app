import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { connect } from 'react-redux'

import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator'
import Timeline from '../components/timeline/Timeline'

import {
  loadProductTimelineWithMilestones,
  updateProductMilestone,
  completeProductMilestone,
  extendProductMilestone,
  submitFinalFixesRequest,
} from '../../actions/productsTimelines'

import {
  ROLE_CONNECT_COPILOT,
  ROLE_CONNECT_MANAGER,
  ROLE_CONNECT_ADMIN,
  ROLE_ADMINISTRATOR,
} from '../../../config/constants'

class ProductTimelineContainer extends React.Component {
  componentWillMount() {
    const {
      isLoading,
      timeline,
      loadProductTimelineWithMilestones,
      product,
    } = this.props

    if (!isLoading && !timeline) {
      loadProductTimelineWithMilestones(product.id)
    }
  }

  render() {
    const { isLoading, timeline } = this.props

    // show loader for the whole timeline even if updating only one milestone
    // here is why https://github.com/appirio-tech/connect-app/issues/2291#issuecomment-410968047
    const isSomeMilestoneUpdating = !!timeline && _.some(timeline.milestones, 'isUpdating')

    return (
      (isLoading || isSomeMilestoneUpdating || !timeline)
        ? <LoadingIndicator />
        : <Timeline {...this.props} />
    )
  }
}

ProductTimelineContainer.propTypes = {
  currentUser: PT.shape({
    userId: PT.number.isRequired,
    isCopilot: PT.bool.isRequired,
    isManager: PT.bool.isRequired,
    isAdmin: PT.bool.isRequired,
    isCustomer: PT.bool.isRequired,
  }).isRequired,
  isLoading: PT.bool,
  timeline: PT.object,
  loadProductTimelineWithMilestones: PT.func.isRequired,
  updateProductMilestone: PT.func.isRequired,
  completeProductMilestone: PT.func.isRequired,
  extendProductMilestone: PT.func.isRequired,
}

const mapStateToProps = ({ productsTimelines, loadUser }, props) => {
  const adminRoles = [
    ROLE_ADMINISTRATOR,
    ROLE_CONNECT_ADMIN,
  ]

  const powerUserRoles = [
    ROLE_CONNECT_COPILOT,
    ROLE_CONNECT_MANAGER,
    ROLE_ADMINISTRATOR,
    ROLE_CONNECT_ADMIN,
  ]

  return {
    timeline: _.get(productsTimelines[props.product.id], 'timeline'),
    isLoading: _.get(productsTimelines[props.product.id], 'isLoading', false),
    currentUser: {
      userId: parseInt(loadUser.user.id, 10),
      isCopilot: _.includes(loadUser.user.roles, ROLE_CONNECT_COPILOT),
      isManager: _.includes(loadUser.user.roles, ROLE_CONNECT_MANAGER),
      isAdmin: _.intersection(loadUser.user.roles, adminRoles).length > 0,
      isCustomer:  _.intersection(loadUser.user.roles, powerUserRoles).length === 0,
    },
  }
}

const mapDispatchToProps = {
  loadProductTimelineWithMilestones,
  updateProductMilestone,
  completeProductMilestone,
  extendProductMilestone,
  submitFinalFixesRequest,
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductTimelineContainer)
