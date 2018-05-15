import React from 'react'
import PT from 'prop-types'
import './MilestonePost.scss'

const MilestonePost = (props) => {
  return (
    <div styleName={'milestone-post ' 
    + (props.theme ? props.theme : '')
    + (props.isCompleted ? 'completed' : '')
    + (props.inProgress ? 'in-progress' : '')
    }
    >
      <span styleName="dot" />
      <div styleName="label-layer">
        <span styleName="label-milestone">{props.label}</span>
        <div styleName="group-right hide-sm">
          <a href={props.milestonePostLink} styleName="milestone-text" dangerouslySetInnerHTML={{ __html: props.milestonePostLink }} />
        </div>
      </div>
    </div>
  )
}

MilestonePost.propTypes = {
  progressPercent: PT.string,
  labelDayStatus: PT.string,
  labelSpent: PT.string,
  labelStatus: PT.string,
  isCompleted: PT.bool,
  inProgress: PT.bool
}

export default MilestonePost
