import React, {PropTypes} from 'react'
import _ from 'lodash'
import { PROJECT_STATUS } from '../../config/constants'

import './StatusFilters.scss'

const projectStatuses = [
  ...PROJECT_STATUS.sort((a, b) => a.order > b.order).map((item) => ({val: item.value, label: item.name}))
]

const StatusFilters = ({criteria, applyFilters}) => {
  const _statuses = _.map(projectStatuses, p => {
    return { val:  p.val, label: p.label }
  })
  return (
    <div className="filterContainer">
    <ul className="filterList">
      { _statuses.map((status, i) => 
        <li key={i} className={`filterItem ${status.val===criteria.status ? 'active' : ''}`} onClick={() => applyFilters({status: status.val})}>{status.label}</li>
      )}
    </ul>
    </div>
  )
}

StatusFilters.propTypes = {
  criteria: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired
}

export default StatusFilters