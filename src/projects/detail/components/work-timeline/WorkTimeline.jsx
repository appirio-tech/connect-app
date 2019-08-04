/**
 * WorkTimeline section
 */
import React from 'react'
import PT from 'prop-types'
import cn from 'classnames'
import { withRouter } from 'react-router-dom'

import EditIcon from  '../../../../assets/icons/icon-edit-black.svg'
import { convertTimelineMilestonesToMilestoneProgress } from  '../../../../helpers/workstreams'
import './WorkTimeline.scss'

const WorkTimeline = ({ editMode, timelines, addNewMilestone, editMilestone }) => {
  const milestones = convertTimelineMilestonesToMilestoneProgress(timelines[0])
  for(const milestone of milestones) {
    if (milestone.progress === 0) {
      if (milestones.length === 1) {
        milestone.progress = 8
      } else {
        milestone.progress = 2
      }
      milestone.progressWidth = `${milestone.progress}%`
    }
  }
  return (
    <div styleName={cn('container', { 'can-edit': editMode })}>
      <div styleName="header">
        <span styleName="title">Work Timeline</span>
        {editMode && (
          <button
            styleName="add-timeline"
            className="tc-btn tc-btn-primary tc-btn-sm"
            onClick={() => { addNewMilestone(timelines[0].id) }}
          >Add Timeline Event</button>)}
      </div>
      {milestones.length ? (
        <div styleName="bar">
          {milestones.map((milestone, index) => (
            <div
              key={`milestone-${milestone.id}`}
              style={{ width: milestone.progressWidth }}
              styleName={cn('bar-segment', {
                'bar-segment-start': index === 0,
                'past-milestone': milestone.isPast,
                'bar-segment-end': index === (milestones.length - 1),
                'current-milestone': milestone.isCurrentMilestone,
              })}
              onClick={() => { editMilestone(timelines[0].id, milestone.id) }}
            >
              <span
                styleName={cn('bar-title', {
                  'bar-title-start': milestone.isStart,
                  'bar-title-end': milestone.isEnd && !milestone.isStart,
                })}
              >{milestone.name}</span>
              {!milestone.isCurrentMilestone && (
                <span styleName="bar-content">{milestone.startDateString}</span>
              )}
              {milestone.isEnd && !milestone.isCurrentMilestone && !milestone.isStart && (
                <span styleName="bar-content" />
              )}
              {milestone.isCurrentMilestone && (
                <span styleName="bar-content">{milestone.daysRemaining}</span>
              )}
              {milestone.isCurrentMilestone && (
                <div style={{ width: milestone.currentProgressWidth }} styleName="past-days">
                  <span styleName="past-days-title">{milestone.daysRemaining}</span>
                </div>
              )}
              <i styleName="icon-edit" title="edit"><EditIcon /></i>
            </div>
          ))}
        </div>
      ) : (
        <div styleName="bar">
          <div
            style={{ flex: 1 }}
            styleName="bar-segment bar-segment-start bar-segment-end flex-h-center"
          >
            <span
              styleName={cn('bar-title', 'bar-title-start')}
            >START</span>
            <span
              styleName={cn('bar-title', 'bar-title-end')}
            >COMPLETE</span>
            <span styleName="bar-content relative">No milestone</span>
          </div>
        </div>
      )}
    </div>
  )
}

WorkTimeline.defaultProps = {
  addNewMilestone: () => {},
  editMilestone: () => {},
}

WorkTimeline.propTypes = {
  editMode: PT.bool.isRequired,
  timelines: PT.arrayOf(PT.shape({
    id: PT.number.isRequired,
    startDate: PT.string,
    milestones: PT.arrayOf(PT.shape({
      id: PT.number.isRequired,
      startDate: PT.string,
      endDate: PT.string,
      name: PT.string.isRequired,
    })),
  })).isRequired,
  addNewMilestone: PT.func,
  editMilestone: PT.func,
}

export default withRouter(WorkTimeline)
