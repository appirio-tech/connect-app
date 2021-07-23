/**
 * Milestone status
 */
import React from 'react'
import PT from 'prop-types'
import { PHASE_STATUS_OPTIONS } from '../../../../../../config/constants'
import './MilestoneStatus.scss'

function MilestoneStatus({ status }) {
  const label = PHASE_STATUS_OPTIONS.find(option => option.value === status).label
  return (
    <span styleName={`milestone-status ${status}`}>
      {label}
    </span>
  )
}

MilestoneStatus.propTypes = {
  status: PT.string,
}

export default MilestoneStatus
