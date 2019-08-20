/**
 * Active Milestone Summary
 *
 * Show milestone title, activeText and button to perform a special action for milestone like
 * inputting designs or perform design review.
 * If no special button is defined for milestone, than `Mark as complete` button is shown.
 */
import React from 'react'
import PT from 'prop-types'

import CompleteMilestoneButtonContainer from '../work-timeline/CompleteMilestoneButtonContainer'
import { MILESTONE_TYPE } from '../../../../config/constants'

import './ActiveMilestoneSummary.scss'

const ActiveMilestoneSummary = ({
  work,
  timeline,
  milestone,
  inputDesignWorks,
  startDesignReview,
}) => {
  const renderActionButton = () => {
    switch (milestone.type) {
    case MILESTONE_TYPE.DESIGN_WORK:
      return (
        <button
          className="tc-btn tc-btn-primary tc-btn-sm"
          onClick={() => inputDesignWorks(timeline.id, milestone.id)}
        >
            Input Design Works
        </button>
      )
    case MILESTONE_TYPE.CHECKPOINT_REVIEW:
    case MILESTONE_TYPE.FINAL_DESIGNS:
      return (
        <button
          className="tc-btn tc-btn-primary tc-btn-sm"
          onClick={() => startDesignReview(timeline.id, milestone.id)}
        >
            Start Design Review
        </button>
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
      <div styleName="active-text">{milestone.activeText}</div>

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
  inputDesignWorks: PT.func.isRequired,
  startDesignReview: PT.func.isRequired,
  markMilestoneAsCompleted: PT.func,
}

export default ActiveMilestoneSummary