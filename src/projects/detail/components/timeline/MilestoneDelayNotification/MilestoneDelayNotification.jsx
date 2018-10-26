/**
 * Shows milestone delay if delayed
 */
import React from 'react'
import PT from 'prop-types'

import DotIndicator from '../DotIndicator'
import ProjectProgress from '../../ProjectProgress'

import { getDaysLeft } from '../../../../../helpers/milestoneHelper'

import './MilestoneDelayNotification.scss'

const MilestoneDelayNotification = ({ milestone, hideDot }) => {
  const daysLeft = getDaysLeft(milestone)

  return daysLeft < 0
    ? <div styleName="top-space">
      <DotIndicator hideDot={hideDot}>
        <ProjectProgress
          labelDayStatus={`${-daysLeft} days job is delayed`}
          progressPercent={100}
          theme="warning"
        />
      </DotIndicator>
    </div>
    : null
}

MilestoneDelayNotification.defaultProps = {
  milestone: {},
  hideDot: false
}

MilestoneDelayNotification.propTypes = {
  description: PT.any,
  hideDot: PT.bool
}

export default MilestoneDelayNotification
