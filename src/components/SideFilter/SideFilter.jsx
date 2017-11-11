/**
 * Side filter
 *
 * Visually splits filters into sections.
 */
import React, { PropTypes } from 'react'
import SideFilterSection from './SideFilterSection'
import './SideFilter.scss'

const SideFilter = (props) => (
  <div className="side-filter">
    <ul>
      {props.filterSections.map((filters, index) => (
        <SideFilterSection
          key={index}
          filters={filters}
          onFilterItemClick={props.onFilterItemClick}
          selectedFilter={props.selectedFilter}
        />
      ))}
    </ul>
    {props.children &&
      <div className="additional-content">
        {props.children}
      </div>
    }
  </div>
)

SideFilter.defaultProps = {
  filterSections: [],
  selectedFilter: ''
}

SideFilter.propTypes = {
  filterSections: PropTypes.array,
  onFilterItemClick: PropTypes.func.isRequired,
  selectedFilter: PropTypes.string
}

export default SideFilter
