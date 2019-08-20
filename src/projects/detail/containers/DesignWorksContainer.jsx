/**
 * DesignWorksContainer container
 * displays UI for inputting design works
 */
import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import DesignWorks from '../components/workstreams/DesignWorks'

import {
  updateWorkMilestone,
} from '../../actions/workTimelines'

class DesignWorksContainer extends React.Component {
  render() {
    return (
      <DesignWorks {...this.props} />
    )
  }
}

DesignWorksContainer.PropTypes = {
  isUpdatingMilestoneInfo: PT.bool.isRequired,
  error: PT.any,
  milestone: PT.object.isRequired,
  updateWorkMilestone: PT.func.isRequired,
  onBack: PT.func.isRequired,
  workId: PT.number.isRequired,
  timelineId: PT.number.isRequired,
  milestoneId: PT.number.isRequired,
}

const mapStateToProps = ({ workTimelines }, ownProps) => {
  const timeline = _.get(workTimelines.timelines[ownProps.workId], 'timeline')
  const milestone = timeline && _.find(timeline.milestones, { id: ownProps.milestoneId })

  return {
    isUpdatingMilestoneInfo: workTimelines.isUpdatingMilestoneInfo,
    error: workTimelines.error,
    milestone,
  }
}

const mapDispatchToProps = {
  updateWorkMilestone,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DesignWorksContainer))