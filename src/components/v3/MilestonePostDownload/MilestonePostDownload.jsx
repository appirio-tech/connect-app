import React from 'react'
import PT from 'prop-types'
import './MilestonePostDownload.scss'

const MilestonePostDownload = (props) => {
  return (
    <div styleName={'milestone-post ' 
    + (props.theme ? props.theme : '')
    }
    >
      <div styleName="label-layer">
        <span styleName="label-milestone">{props.label}</span>
        <div styleName="group-right hide-sm">
          <span styleName="download_icon" />
        </div>
      </div>
    </div>
  )
}

MilestonePostDownload.propTypes = {
  progressPercent: PT.string,
  labelDayStatus: PT.string,
  labelSpent: PT.string,
  labelStatus: PT.string,
  isCompleted: PT.bool,
  inProgress: PT.bool
}

export default MilestonePostDownload
