import React, {PropTypes} from 'react'
import _ from 'lodash'
import Select from '../../components/Select/Select'
import { projectTypes } from '../../config/projectWizard'

const Filters = ({ criteria, applyFilters }) => {
  const types = _.map(projectTypes, projectType => {
    return { value: projectType.id, label: projectType.name }
  })

  // TODO add segments list
  const segments = _.map([], segment => {
    return { value: segment.id, label: segment.value }
  })

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

        <div className="search-select-widget">
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
        </div>
      </div>
      <button
        className="tc-btn"
        onClick={() => {
          applyFilters({
            type: null,
            segment: null,
            status: null,
            sort: 'updatedAt desc'
          })
        }}
      >Clear all</button>
    </div>
  )
}

Filters.propTypes = {
  criteria: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired
}

export default Filters
