/**
 * Filter item in the filter section
 *
 * - Shows filter name and quantity if defined
 * - Has onClick callback with filter value argument
 */

import React, { PropTypes } from 'react'
import _ from 'lodash'
import './SideFilterSectionItem.scss'

const SideFilterSectionItem = (props) => (
  <li
    key={props.value}
    className={'side-filter-section-item' + (props.isSelected ? ' active' : '')}
    onClick={() => props.onClick(props.value)}
  >
    <div className="title">{props.title}</div>
    {_.isNumber(props.quantity) && <div className="quantity">{props.quantity}</div>}
  </li>
)

SideFilterSectionItem.defaultProps = {
  quantity: null,
  isSelected: false
}

SideFilterSectionItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  quantity: PropTypes.number,
  isSelected: PropTypes.bool
}

export default SideFilterSectionItem
