import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import Select from '../../components/Select/Select'

const Filters = ({ criteria, applyFilters, projectCategories }) => {
  const types = _.map(projectCategories, category => {
    return { value: category.key, label: category.displayName }
  })

  // TODO add segments list
  // const segments = _.map([], segment => {
  //   return { value: segment.id, label: segment.value }
  // })

  return (
    <div className="bar__search clearfix">
      <h2>Filters</h2>
      <div className="search-panel">
        <div className="search-select-widget">
          <label>Project Type</label>
          <div className="search-select-field">
            <Select
              multi
              value={criteria.type}
              options={types}
              placeholder="All (no filters applied)"
              onChange={(selectedOptions) => applyFilters({ type: selectedOptions })}
            />
          </div>
        </div>

        {/* <div className="search-select-widget">
          <label>Segment</label>
          <div className="search-select-field">
            <Select
              multi
              value={criteria.segment}
              options={segments}
              placeholder="All (no filters applied)"
              onChange={(selectedOptions) => applyFilters({ segment: selectedOptions })}
            />
          </div>
        </div> */}
      </div>
      <button
        className="tc-btn tc-btn-secondary"
        onClick={() => {
          applyFilters({
            type: null,
            segment: null,
            status: null,
            sort: 'updatedAt desc'
          })
        }}
      >Clear filters</button>
    </div>
  )
}

Filters.propTypes = {
  criteria: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
  projectCategories: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
  }))
}

export default Filters
