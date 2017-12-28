/**
 * Filter section
 */
import React from 'react'
import PropTypes from 'prop-types'
import SideFilterSectionItem from './SideFilterSectionItem'
import './SideFilterSection.scss'

const SideFilterSection = (props) => (
  <li className="side-filter-section">
    <ul>
      {props.filters.map(filter => (
        <SideFilterSectionItem
          key={filter.value}
          {...filter}
          onClick={props.onFilterItemClick}
          isSelected={props.selectedFilter === filter.value}
        />
      ))}
    </ul>
  </li>
)

SideFilterSection.defaultProps = {
  filter: [],
  selectedFilter: ''
}

SideFilterSection.propTypes = {
  filter: PropTypes.array,
  onFilterItemClick: PropTypes.func.isRequired,
  selectedFilter: PropTypes.string
}

export default SideFilterSection
