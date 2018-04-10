/**
 * List of statuses for filter
 */
import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import style from './StatusFilters.scss'

const StatusFiltersList = ({ statuses, currentStatus, onStatusClick }) => (
  <ul styleName="list">
    {statuses.map((status) => (
      <li 
        key={status.val || 'null'} 
        className={cn(style.item, { [style.active]: status.val === currentStatus })} 
        onClick={() => onStatusClick(status.val)}
      >
        {status.label}
      </li>
    ))}
  </ul>
)

StatusFiltersList.defaultProps = {
  currentStatus: null
}

StatusFiltersList.propTypes = {
  currentStatus: PropTypes.string,
  statuses: PropTypes.arrayOf(PropTypes.shape({
    val: PropTypes.string,
    label: PropTypes.string.isRequired
  })),
  onStatusClick: PropTypes.func.isRequired
}

export default StatusFiltersList
