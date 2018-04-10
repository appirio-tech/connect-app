/**
 * Dropdown with hidden status items under "More" option
 */
import React from 'react'
import PropTypes from 'prop-types'
import Dropdown from 'appirio-tech-react-components/components/Dropdown/Dropdown'
import cn from 'classnames'

import style from './StatusFilters.scss'

const StatusFiltersDropdown = ({ statuses, onStatusClick }) => (
  <Dropdown theme="UserDropdownMenu" pointerShadow>
    <div className={cn('dropdown-menu-header', style.item)}>more</div>
    <ul className="dropdown-menu-list">
      {statuses.map((status) => (
        <li className="user-menu-item transition" key={status.val || 'null'}>
          <a href="javascript:;" onClick={() => onStatusClick(status.val)}>{status.label}</a>
        </li>
      ))}
    </ul>
  </Dropdown>
)

StatusFiltersDropdown.propTypes = {
  statuses: PropTypes.arrayOf(PropTypes.shape({
    val: PropTypes.string,
    label: PropTypes.string.isRequired
  })),
  onStatusClick: PropTypes.func.isRequired
}

export default StatusFiltersDropdown
