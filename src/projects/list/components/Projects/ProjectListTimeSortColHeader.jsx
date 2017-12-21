import React, { PropTypes } from 'react'
import _ from 'lodash'
import { Dropdown, DropdownItem } from 'appirio-tech-react-components'

const options = [
  { val: 'updatedAt desc', label: 'Last Updated' },
  { val: 'createdAt', label: 'Oldest First' },
  { val: 'createdAt desc', label: 'Newest First' }
]

const ProjectListTimeSortColHeader = ({currentSortField, sortHandler}) => {
  const cur = _.find(options, o => currentSortField === o.val)
    || options[0]

  return (
    <div>
      <Dropdown className="project-drop-down">
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


ProjectListTimeSortColHeader.propTypes = {
  currentSortField: PropTypes.string.isRequired,
  sortHandler: PropTypes.func.isRequired
}
export default ProjectListTimeSortColHeader
