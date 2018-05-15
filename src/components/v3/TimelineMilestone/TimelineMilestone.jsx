import React from 'react'
import PT from 'prop-types'
import './TimelineMilestone.scss'

const TimelineMilestone = (props) => {
  return (
    <div styleName="project-progress">
      <div styleName="filled" style={{ width: props.progressPercent + '%' }} />
      <div styleName="label-layer">
        <span styleName="day-status">{props.labelDayStatus}</span>
        <div styleName="group-right">
          <span styleName="spent">{props.labelSpent}</span>
          <span styleName="status hide-sm">{props.labelStatus}</span>
        </div>
      </div>
    </div>
  )
}

TimelineMilestone.propTypes = {
  progressPercent: PT.string,
  labelDayStatus: PT.string,
  labelSpent: PT.string,
  labelStatus: PT.string
}

export default TimelineMilestone
