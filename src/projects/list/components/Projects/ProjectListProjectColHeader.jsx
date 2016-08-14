import React, { PropTypes } from 'react'
import _ from 'lodash'
import { Dropdown, DropdownItem } from 'appirio-tech-react-components'

const options = [
  { val: 'createdAt desc', label: 'Latest first' },
  { val: 'createdAt', label: 'Oldest first' },
  { val: 'name', label: 'Name A-Z' },
  { val: 'name desc', label: 'Name Z-A' }
]

const ProjectListProjectColHeader = ({currentSortField, sortHandler}) => {
  const cur = _.find(options, o => currentSortField.indexOf(o.val) > -1)
    || options[0]

  return (
    <div>
      <span className="txt txt-black">Projects</span>
      <Dropdown className="drop-down">
        <a href="javascript:;" className="dropdown-menu-header txt-link">{cur.label}</a>
        <div className="dropdown-menu-list down-layer">
        <ul>
          {
            options.map((item, i) =>
              <DropdownItem key={i} item={item}
                onItemClick={sortHandler}
                currentSelection={currentSortField}
              />
            )
          }
        </ul>
        </div>
      </Dropdown>
    </div>
  )
}


ProjectListProjectColHeader.propTypes = {
  currentSortField: PropTypes.string.isRequired,
  sortHandler: PropTypes.func.isRequired
}
export default ProjectListProjectColHeader
