import React from 'react'
import PT from 'prop-types'
import './ProjectProgress.scss'

const ProjectProgress = (props) => {
  return (
    <div styleName={'project-progress ' 
      + (props.theme ? props.theme : '')
      + (props.isCompleted ? ' completed' : '')
      + (props.inProgress ? ' in-progress' : '')
    }
    >
      <span styleName="dot" />
      <div styleName="filled" style={{ width: props.progressPercent + '%' }} />
      <div styleName="label-layer">
        <span>{props.labelDayStatus}</span>
        <div styleName="group-right">
          <span styleName="spent">{props.labelSpent}</span>
          <span styleName="status hide-sm">{props.labelStatus}</span>
        </div>
      </div>
    </div>
  )
}

ProjectProgress.propTypes = {
  progressPercent: PT.string,
  labelDayStatus: PT.string,
  labelSpent: PT.string,
  labelStatus: PT.string,
  isCompleted: PT.bool,
  inProgress: PT.bool
}

export default ProjectProgress
