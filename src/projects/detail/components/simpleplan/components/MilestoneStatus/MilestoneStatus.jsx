/**
 * Milestone status
 */
import React from 'react'
import PT from 'prop-types'
import * as formatHelper from '../helpers/format'

import './MilestoneStatus.scss'

function MilestoneStatus({ status }) {
  return (
    <span styleName={`milestone-status ${status}`}>
      {formatHelper.formatCapitalizedText(status)}
    </span>
  )
}

MilestoneStatus.propTypes = {
  status: PT.string,
}

export default MilestoneStatus
