import React, {PropTypes} from 'react'
import _ from 'lodash'
import Dropdown from '../Dropdown/Dropdown'
import DropdownItem from '../Dropdown/DropdownItem'
import SwitchButton from '../SwitchButton/SwitchButton'
import { PROJECT_STATUS } from '../../config/constants'

const projectTypes = [
  { val: null, label: 'All Types' },
  { val: 'generic', label: 'Work Project' },
  { val: 'visual_design', label: 'Visual Design' },
  { val: 'visual_prototype', label: 'Visual Prototype' },
  { val: 'app_dev', label: 'App Development' }
]

const projectStatuses = [
  { val: 'in(draft,in_review,reviewed,active)', label: 'Open' },
  { val: null, label: 'All Statuses' },
  ...PROJECT_STATUS.map((item) => ({val: item.value, label: item.name}))
]

const Filters = ({ criteria, handleMyProjectsFilter, applyFilters }) => {

  const type = _.find(projectTypes, t => t.val === (criteria.type || null))
  const status = _.find(projectStatuses, t => t.val === (criteria.status || null))

  const _types = _.map(projectTypes, p => {
    return { val: { type: p.val }, label: p.label }
  })
  const _statuses = _.map(projectStatuses, p => {
    return { val: { status: p.val }, label: p.label }
  })

  return (
    <div className="bar__search clearfix">
      <h2>Filters</h2>
      <div className="search-panel">
        <label className="first">Project Type</label>
        <div className="search-select-widget">
          <Dropdown theme="new-theme" noPointer pointerShadow>
            <a className="dropdown-menu-header">{ type.label || 'All Types' }</a>
            <ul className="dropdown-menu-list">
              {
                _types.map((item, i) =>
                  <DropdownItem key={i} item={item} onItemClick={applyFilters}/>
                )
              }
            </ul>
          </Dropdown>
        </div>
        <label>Status</label>
        <div className="search-select-widget">
          <Dropdown theme="new-theme" noPointer pointerShadow>
            <a className="dropdown-menu-header">{ status.label || 'All Status' }</a>
            <ul className="dropdown-menu-list">
              {
                _statuses.map((item, i) =>
                  <DropdownItem key={i} item={item} onItemClick={applyFilters}/>
                )
              }
            </ul>
          </Dropdown>
        </div>
      </div>
      <div className="bar-control">
        <div className="toggle-widget">
          <div className="tc-switch clearfix">
            <SwitchButton
              onChange={ handleMyProjectsFilter }
              label="My projects"
              name="my-projects-only"
              checked={criteria.memberOnly}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

Filters.propTypes = {
  criteria: PropTypes.object.isRequired,
  handleMyProjectsFilter: PropTypes.func.isRequired,
  applyFilters: PropTypes.func.isRequired
}

export default Filters
