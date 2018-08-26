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
 * Or it may be converted to HOC component similar to PhaseFeedHOC and load timeline for the whole phase.
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { connect } from 'react-redux'

import Timeline from '../components/timeline/Timeline'

import {
  updateProductMilestone,
  completeProductMilestone,
  completeFinalFixesMilestone,
  extendProductMilestone,
  submitFinalFixesRequest,
} from '../../actions/productsTimelines'

import {
  ROLE_CONNECT_COPILOT,
  ROLE_CONNECT_MANAGER,
  ROLE_CONNECT_ADMIN,
  ROLE_ADMINISTRATOR,
} from '../../../config/constants'

/**
 * Checks if timeline has any milestone which is being updated
 *
 * @param {Object} timeline timeline
 *
 * @returns {Boolean} true if some milestone is being updated
 */
function getIsSomeMilestoneUpdating(timeline) {
  return !!timeline && _.some(timeline.milestones, 'isUpdating')
}

class ProductTimelineContainer extends React.Component {
  constructor(props) {
    super(props)

    // this will remember the current scroll position before timeline started showing loader
    this.scrollPosition
  }

  componentWillReceiveProps(nextProps) {
    const { isLoading, timeline } = this.props
    const isSomeMilestoneUpdating = getIsSomeMilestoneUpdating(timeline)
    const nextIsSomeMilestoneUpdating = getIsSomeMilestoneUpdating(nextProps.timeline)

    // remember scroll position before showing loader
    if (
      !isLoading && nextProps.isLoading ||
      !isSomeMilestoneUpdating && nextIsSomeMilestoneUpdating
    ) {
      this.scrollPosition = window.scrollY
    }
  }

  componentDidUpdate(prevProps) {
    const { isLoading, timeline } = this.props
    const isSomeMilestoneUpdating = getIsSomeMilestoneUpdating(timeline)
    const prevIsSomeMilestoneUpdating = getIsSomeMilestoneUpdating(prevProps.timeline)

    // restore scroll position after hiding loader
    if (
      !!this.scrollPosition &&
      (
        !isLoading && prevProps.isLoading ||
        !isSomeMilestoneUpdating && prevIsSomeMilestoneUpdating
      )
    ) {
      window.scrollTo(0, this.scrollPosition)
    }
  }

  render() {
    const { isLoading, timeline } = this.props
    const isSomeMilestoneUpdating = getIsSomeMilestoneUpdating(timeline)

    return (
      // show loader for the whole timeline even if updating only one milestone
      // here is why https://github.com/appirio-tech/connect-app/issues/2291#issuecomment-410968047

	  // https://github.com/appirio-tech/connect-app/issues/2422
	  // Simpy return Timeline component here.
	  // Move out loading indicator to Timeline so the height can be maintained in there.
      <Timeline {...this.props} />
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
  updateProductMilestone,
  completeProductMilestone,
  completeFinalFixesMilestone,
  extendProductMilestone,
  submitFinalFixesRequest,
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductTimelineContainer)
