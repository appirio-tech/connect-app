/**
 * WorkTimelineEditMilestoneContainer container
 * displays form for updateting milestone timeline
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import spinnerWhileLoading from '../../../components/LoadingSpinner'
import WorkTimelineEditMilestone from '../components/work-timeline/WorkTimelineEditMilestone'
import {
  deleteWorkMilestone,
  updateWorkMilestone,
  loadWorkMilestone
} from '../../actions/workTimelines'
import './WorkTimelineEditMilestoneContainer.scss'

// This handles showing a spinner while the state is being loaded async
const enhance = spinnerWhileLoading(props =>
  !!props.milestone &&
  !props.isLoadingMilestoneInfo &&
  !props.isUpdatingMilestoneInfo &&
  !props.isDeletingMilestoneInfo
)
const WorkTimelineEditMilestoneWithLoader = enhance(WorkTimelineEditMilestone)

class WorkTimelineEditMilestoneContainer extends React.Component {
  constructor(props) {
    super(props)

    this.submitForm = this.submitForm.bind(this)
  }

  componentWillMount() {
    const { timelineId, milestoneId, milestone, loadWorkMilestone, work } = this.props
    if (!milestone || (milestone.id !== milestoneId)) {
      loadWorkMilestone(work.id, timelineId, milestoneId)
    }
  }

  /**
   * Call request to submit new form
   * @param {Object} model form value
   */
  submitForm(model) {
    const {
      work,
      timelineId,
      milestoneId,
      updateWorkMilestone,
    } = this.props
    updateWorkMilestone(work.id, timelineId, milestoneId, model)
  }

  componentWillReceiveProps(nextProps) {
    const {
      isRequestMilestoneError,
      onBack,
    } = nextProps

    // back to work view if load milestone fail
    const prevIsLoadingMilestoneInfo = _.get(this.props, 'isLoadingMilestoneInfo')
    const nextIsLoadingMilestoneInfo = _.get(nextProps, 'isLoadingMilestoneInfo')
    if (prevIsLoadingMilestoneInfo === true && nextIsLoadingMilestoneInfo === false && isRequestMilestoneError) {
      // loading milestone fail
      onBack()
    }

    // back to dashboard after delete milestone successfully
    const prevIsDeletingMilestoneInfo = _.get(this.props, 'isDeletingMilestoneInfo')
    const nextIsDeletingMilestoneInfo = _.get(nextProps, 'isDeletingMilestoneInfo')
    if (prevIsDeletingMilestoneInfo === true && nextIsDeletingMilestoneInfo === false && !isRequestMilestoneError) {
      onBack()
    }
  }

  render() {
    return (
      <div styleName="container">
        <WorkTimelineEditMilestoneWithLoader
          {...this.props}
          isNewMilestone={false}
          submitForm={this.submitForm}
        />
      </div>
    )
  }
}

WorkTimelineEditMilestoneContainer.PropTypes = {
  timelineId: PT.number.isRequired,
  milestoneId: PT.number.isRequired,
  onBack: PT.func.isRequired,
}

const mapStateToProps = ({workTimelines, works}, ownProps) => {
  return {
    timelineState: _.find(workTimelines.timelines, { timeline: { id: ownProps.timelineId }}),
    isUpdatingMilestoneInfo: workTimelines.isUpdatingMilestoneInfo,
    isDeletingMilestoneInfo: workTimelines.isDeletingMilestoneInfo,
    isLoadingMilestoneInfo: workTimelines.isLoadingMilestoneInfo,
    isRequestMilestoneError: !!workTimelines.error,
    milestone: workTimelines.milestone,
    work: works.work
  }
}

const mapDispatchToProps = {
  deleteWorkMilestone,
  updateWorkMilestone,
  loadWorkMilestone
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(WorkTimelineEditMilestoneContainer))
