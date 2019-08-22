/**
 * WorkTimelineNewMilestoneContainer container
 * displays form for creating milestone timeline
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import WorkTimelineEditMilestone from '../components/work-timeline/WorkTimelineEditMilestone'
import { createWorkMilestone } from '../../actions/workTimelines'
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator'
import { getPhaseActualData } from '../../../helpers/projectHelper'
import { MILESTONE_STATUS } from '../../../config/constants'

import './WorkTimelineNewMilestoneContainer.scss'

class WorkTimelineNewMilestoneContainer extends React.Component {
  constructor(props) {
    super(props)

    this.submitForm = this.submitForm.bind(this)
  }

  /**
   * Call request to submit new form
   * @param {Object} model form value
   */
  submitForm(model) {
    const {
      timelineId,
      createWorkMilestone,
      work,
      timelineState: { timeline },
    } = this.props

    const { startDate, endDate } = getPhaseActualData(work, timeline)
    let milestoneStartDate

    // if timeline has `endDate` then start the next milestone the next day
    if (endDate) {
      milestoneStartDate = endDate.add(1, 'day')

    // if timeline doesn't have `endDate` (means no milestones) use `startDate`
    } else if (startDate) {
      milestoneStartDate = startDate
    }

    model.startDate = milestoneStartDate.format()
    model.endDate = milestoneStartDate.add(model.duration, 'days').format()
    model.status = MILESTONE_STATUS.PLANNED

    createWorkMilestone(work.id, timelineId, model)
  }

  render() {
    const { isCreatingMilestoneInfo } = this.props
    return (
      <div styleName="container">
        <WorkTimelineEditMilestone
          {...this.props}
          isNewMilestone
          milestone={{}}
          submitForm={this.submitForm}
        />
        {isCreatingMilestoneInfo && (<div styleName="loading-wrapper">
          <LoadingIndicator />
        </div>)}
      </div>
    )
  }
}

WorkTimelineNewMilestoneContainer.PropTypes = {
  timelineId: PT.number.isRequired,
  createWorkMilestone: PT.func.isRequired,
}

const mapStateToProps = ({workTimelines, works}, ownProps) => {
  return {
    timelineState: _.find(workTimelines.timelines, { timeline: { id: ownProps.timelineId }}),
    isCreatingMilestoneInfo: workTimelines.isCreatingMilestoneInfo,
    isRequestMilestoneError: workTimelines.error,
    work: works.work
  }
}

const mapDispatchToProps = {
  createWorkMilestone,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(WorkTimelineNewMilestoneContainer))
