import React from 'react'
import PT from 'prop-types'
import './MilestonePostFile.scss'

const MilestonePostFile = (props) => {
  return (
    <div styleName={'milestone-post ' 
    + (props.theme ? props.theme : '')
    + (props.isCompleted ? 'completed' : '')
    + (props.inProgress ? 'in-progress' : '')
    }
    >
      <div styleName="label-layer">
        <span styleName="label-milestone">{props.label}</span>
        <div styleName="group-right hide-sm">
          <a href={props.milestonePostFile}  download={props.label} styleName="milestone-text" dangerouslySetInnerHTML={{ __html: props.milestonePostFileInfo }} />
          <span styleName="download_icon" />
        </div>
      </div>
    </div>
  )
}

MilestonePostFile.propTypes = {
  progressPercent: PT.string,
  labelDayStatus: PT.string,
  labelSpent: PT.string,
  labelStatus: PT.string,
  isCompleted: PT.bool,
  inProgress: PT.bool
}

export default MilestonePostFile
