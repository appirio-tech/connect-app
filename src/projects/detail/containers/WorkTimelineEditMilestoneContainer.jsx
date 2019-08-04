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
  deleteMilestone,
  updateMilestone,
  loadMilestone
} from '../../actions/workTimelines'
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator'
import './WorkTimelineEditMilestoneContainer.scss'

// This handles showing a spinner while the state is being loaded async
const enhance = spinnerWhileLoading(props => !props.isLoadingMilestoneInfo && !!props.milestone)
const EnhancedCreateView = enhance(WorkTimelineEditMilestone)

class WorkTimelineEditMilestoneContainer extends React.Component {
  constructor(props) {
    super(props)

    this.submitForm = this.submitForm.bind(this)
  }

  componentWillMount() {
    const { timelineId, milestoneId, milestone, loadMilestone } = this.props
    if (!milestone || (milestone.id !== milestoneId)) {
      loadMilestone(timelineId, milestoneId)
    }
  }

  /**
   * Call request to submit new form
   * @param {Object} model form value
   */
  submitForm(model) {
    const {
      timelineId,
      milestoneId,
      updateMilestone,
      work,
    } = this.props
    updateMilestone(work.id, timelineId, milestoneId, model)
  }

  componentWillReceiveProps(nextProps) {
    const {
      isRequestMilestoneError,
      onBack,
    } = nextProps

    // backto work view if load milestone fail
    const previosIsLoadingMilestoneInfo = _.get(this.props, 'isLoadingMilestoneInfo')
    const nextIsLoadingMilestoneInfo = _.get(nextProps, 'isLoadingMilestoneInfo')
    if (previosIsLoadingMilestoneInfo === true && nextIsLoadingMilestoneInfo === false && isRequestMilestoneError) {
      // loading milestone fail
      onBack()
    }

    // backto dashboard after delete milestone successfully
    const prevIsDeletingMilestoneInfo = _.get(this.props, 'isDeletingMilestoneInfo')
    const nextIsDeletingMilestoneInfo = _.get(nextProps, 'isDeletingMilestoneInfo')
    if (prevIsDeletingMilestoneInfo === true && nextIsDeletingMilestoneInfo === false && !isRequestMilestoneError) {
      onBack()
    }
  }

  render() {
    const {
      isUpdatingMilestoneInfo,
      isDeletingMilestoneInfo,
      milestone
    } = this.props
    return (
      <div styleName="container">
        <EnhancedCreateView
          {...this.props}
          isNewMilestone={false}
          milestone={milestone}
          submitForm={this.submitForm}
        />
        {(isUpdatingMilestoneInfo || isDeletingMilestoneInfo) && (<div styleName="loading-wrapper">
          <LoadingIndicator />
        </div>)}
      </div>
    )
  }
}

WorkTimelineEditMilestoneContainer.PropTypes = {
  timelineId: PT.number.isRequired,
  milestoneId: PT.number.isRequired,
  onBack: PT.func.isRequired,
}

const mapStateToProps = ({workTimelines, works}) => {
  return {
    timelines: workTimelines.timelines,
    isUpdatingMilestoneInfo: workTimelines.isUpdatingMilestoneInfo,
    isDeletingMilestoneInfo: workTimelines.isDeletingMilestoneInfo,
    isLoadingMilestoneInfo: workTimelines.isLoadingMilestoneInfo,
    isRequestMilestoneError: !!workTimelines.error,
    milestone: workTimelines.milestone,
    work: works.work
  }
}

const mapDispatchToProps = {
  deleteMilestone,
  updateMilestone,
  loadMilestone
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(WorkTimelineEditMilestoneContainer))
