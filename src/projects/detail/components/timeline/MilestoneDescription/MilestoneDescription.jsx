/**
 * Shows milestone description
 */
import React from 'react'
import PT from 'prop-types'

import './MilestoneDescription.scss'

const MilestoneDescription = ({ description }) => (
  <div styleName="container" dangerouslySetInnerHTML={{ __html: description }} />
)

MilestoneDescription.propTypes = {
  description: PT.string.isRequired,
}

export default MilestoneDescription
