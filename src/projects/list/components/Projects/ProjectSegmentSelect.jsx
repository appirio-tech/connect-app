import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Dropdown, DropdownItem } from 'appirio-tech-react-components'

const options = [
  { val: 'enterprise', label: 'Enterprise' },
  { val: 'self-service', label: 'Self-service' },
  { val: 'partner-project', label: 'Partner project' },
  { val: 'qaas', label: 'Wipro QAaS' },
  { val: 'emea', label: 'Wipro Digital EMEA' }
]
const setSegment = (segment) => {
  return segment
}
const ProjectSegmentSelect = ({currentSegment}) => {
  const cur = _.find(options, o => currentSegment === o.val)
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
                onItemClick={setSegment}
                currentSelection={currentSegment}
              />
            )
          }
        </ul>
        </div>
      </Dropdown>
    </div>
  )
}


ProjectSegmentSelect.propTypes = {
  currentSegment: PropTypes.string.isRequired
}
export default ProjectSegmentSelect
