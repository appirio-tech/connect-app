/**
 * WorkTimelineMilestoneReviewContainer container
 * displays content of the work milestone review section
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import spinnerWhileLoading from '../../../components/LoadingSpinner'
import WorkTimelineMilestoneReview from '../components/work-timeline/WorkTimelineMilestoneReview/WorkTimelineMilestoneReview'
import {
  updateWorkMilestone,
  loadWorkMilestone
} from '../../actions/workTimelines'
import './WorkTimelineMilestoneReviewContainer.scss'


// This handles showing a spinner while the state is being loaded async
const enhance = spinnerWhileLoading(props =>
  !!props.milestone &&
  !props.isLoadingMilestoneInfo
)
const MilestoneWithLoader = enhance(WorkTimelineMilestoneReview)


class WorkTimelineMilestoneReviewContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const {
      milestone,
      match: { params: { workId, timelineId, milestoneId } },
      loadWorkMilestone
    } = this.props
    if (!milestone || (milestone.id !== parseInt(milestoneId))) {
      loadWorkMilestone(parseInt(workId), parseInt(timelineId), parseInt(milestoneId))
    }
  }

  render() {
    return (
      <div styleName="container">
        <MilestoneWithLoader {...this.props} />
      </div>
    )
  }
}

const mapStateToProps = ({workTimelines}) => {
  return {
    isLoadingMilestoneInfo: workTimelines.isLoadingMilestoneInfo,
    milestone: workTimelines.milestone,
    isUpdatingMilestoneInfoWithProcessId: workTimelines.isUpdatingMilestoneInfoWithProcessId,
  }
}

const mapDispatchToProps = {
  updateWorkMilestone,
  loadWorkMilestone
}


WorkTimelineMilestoneReviewContainer.PropTypes = {
  loadWorkMilestone: PT.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(WorkTimelineMilestoneReviewContainer))
