/**
 * WorkTimelineMilestoneContainer container
 * displays content of the work milestone review section
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import WorkTimelineMilestoneReview from '../components/work-timeline/WorkTimelineMilestoneReview/WorkTimelineMilestoneReview'
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator'
import DesignWorksContainer from './DesignWorksContainer'
import {
  MILESTONE_TYPE,
} from '../../../config/constants'
import {
  updateWorkMilestone,
  loadWorkTimeline
} from '../../actions/workTimelines'
import './WorkTimelineMilestoneContainer.scss'


class WorkTimelineMilestoneContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const {
      milestone,
      match: { params: { workId } },
      loadWorkTimeline,
      timeline
    } = this.props
    if (!milestone && !timeline && workId) {
      loadWorkTimeline(workId)
    }
  }

  render() {
    const {
      milestone,
      match: { params: { projectId, workstreamId, workId, milestoneId } },
      timeline,
    } = this.props

    if (!milestone) {
      return (
        <div styleName="container">
          <LoadingIndicator />
        </div>
      )
    }

    switch (milestone.type) {
    case MILESTONE_TYPE.DESIGN_WORK:
      return (
        <DesignWorksContainer
          onBack={() => this.setState({ showDesignWorks : {timelineId: -1, milestoneId: -1} })}
          workId={parseInt(workId, 10)}
          timelineId={timeline.id}
          milestoneId={parseInt(milestoneId, 10)}
        />
      )
    case MILESTONE_TYPE.CHECKPOINT_REVIEW:
    case MILESTONE_TYPE.FINAL_DESIGNS:
      return (
        <div styleName="container">
          <WorkTimelineMilestoneReview {...this.props} />
        </div>
      )
    default:
      // return to work page because no ui for this milesstone type
      this.props.history.push(`/projects/${projectId}/workstreams/${workstreamId}/works/${workId}`)
    }
    return (
      <div styleName="container">
        <LoadingIndicator />
      </div>
    )
  }
}

const mapStateToProps = ({workTimelines}, ownProps) => {
  const {
    match: { params: { workId, milestoneId } },
  } = ownProps
  const timelinesState = workTimelines.timelines[workId]
  const timeline = _.get(timelinesState, 'timeline')
  const milestones = _.get(timeline, 'milestones')
  const milestone = _.find(milestones, { id: parseInt(milestoneId) })
  const milestoneInfo = (workTimelines.milestone && workTimelines.milestone.id === parseInt(milestoneId)) ? workTimelines.milestone : null
  return {
    milestone: milestoneInfo ? milestoneInfo : milestone,
    isUpdatingMilestoneInfoWithProcessId: workTimelines.isUpdatingMilestoneInfoWithProcessId,
    timeline,
  }
}

const mapDispatchToProps = {
  updateWorkMilestone,
  loadWorkTimeline,
}


WorkTimelineMilestoneContainer.PropTypes = {
  loadWorkTimeline: PT.func.isRequired,
  timeline: PT.shape({
    id: PT.number.isRequired,
    startDate: PT.string,
    milestones: PT.arrayOf(PT.shape({
      id: PT.number.isRequired,
      startDate: PT.string,
      endDate: PT.string,
      name: PT.string.isRequired,
    })),
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(WorkTimelineMilestoneContainer))
