/**
 * Notification Badge
 */
import React from 'react'
import PropTypes from 'prop-types'

import Tooltip from 'appirio-tech-react-components/components/Tooltip/Tooltip'
import { TOOLTIP_DEFAULT_DELAY } from '../../../config/constants'

import './NotificationBadge.scss'

const getBadge = (number) => {
  return (<div styleName="badge">{number}</div>)
}

const NotificationBadge = ({count, text}) => {
  if (text) {
    return (
      <Tooltip theme="light" tooltipDelay={TOOLTIP_DEFAULT_DELAY}>
        <div className="tooltip-target">
          {getBadge(count)}
        </div>
        <div className="tooltip-body">
          {text}
        </div>
      </Tooltip>
    )
  } else {
    return (
      getBadge(count)
    )
  }
}

NotificationBadge.propTypes = {
  count: PropTypes.number.isRequired,
  text: PropTypes.string
}
export default NotificationBadge
  