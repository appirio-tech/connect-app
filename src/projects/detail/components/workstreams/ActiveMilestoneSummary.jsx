/**
 * Active Milestone Summary
 *
 * Show milestone title, activeText and button to perform a special action for milestone like
 * inputting designs or perform design review.
 * If no special button is defined for milestone, than `Mark as complete` button is shown.
 */
import React from 'react'
import PT from 'prop-types'
import { Link } from 'react-router-dom'

import CompleteMilestoneButtonContainer from '../work-timeline/CompleteMilestoneButtonContainer'
import { MILESTONE_TYPE } from '../../../../config/constants'

import './ActiveMilestoneSummary.scss'

const ActiveMilestoneSummary = ({
  work,
  timeline,
  milestone,
  match
}) => {
  const renderActionButton = () => {
    switch (milestone.type) {
    case MILESTONE_TYPE.DESIGN_WORK:
      return (
        <Link
          to={`/projects/${match.params.projectId}/workstreams/${match.params.workstreamId}/works/${work.id}/milestones/${milestone.id}`}
          className="tc-btn tc-btn-primary tc-btn-sm"
        >
          Input Design Works
        </Link>
      )
    case MILESTONE_TYPE.CHECKPOINT_REVIEW:
    case MILESTONE_TYPE.FINAL_DESIGNS:
      // Button for Start design review for timeline
      return (
        <Link
          to={`/projects/${match.params.projectId}/workstreams/${match.params.workstreamId}/works/${work.id}/milestones/${milestone.id}`}
          className="tc-btn tc-btn-primary tc-btn-sm"
        >
            Start Design Review
        </Link>
      )
    default:
      return (
        <CompleteMilestoneButtonContainer
          workId={work.id}
          timelineId={timeline.id}
          milestoneId={milestone.id}
        />
      )
    }
  }

  return (
    <div styleName="container">
      <div styleName="title">{milestone.name} milestone reached</div>
      <div styleName="description">{milestone.description}</div>

      <div styleName="action">
        {renderActionButton()}
      </div>
    </div>
  )
}

ActiveMilestoneSummary.propTypes = {
  work: PT.shape({
    id: PT.number,
  }),
  timeline: PT.shape({
    id: PT.number,
  }),
  milestone: PT.shape({
    id: PT.number,
    name: PT.string,
    activeText: PT.string
  }),
  markMilestoneAsCompleted: PT.func,
}

export default ActiveMilestoneSummary