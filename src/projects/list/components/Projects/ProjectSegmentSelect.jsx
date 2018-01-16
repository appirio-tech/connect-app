import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'
import { Dropdown } from 'appirio-tech-react-components'
import SVGIcons from '../../Icons/Icons'

const options = [
  { val: 'enterprise', label: 'Enterprise' },
  { val: 'self-service', label: 'Self-service' },
  { val: 'partner-project', label: 'Partner project' },
  { val: 'qaas', label: 'Wipro QAaS' },
  { val: 'emea', label: 'Wipro Digital EMEA' }
]

class ProjectSegmentSelect extends React.Component {

  render() {
    const {currentSegment, currentSortField, sortHandler} = this.props
    const cur = _.find(options, o => currentSegment === o.val)
      || options[0]

    return (
      <div>
        <Dropdown className="project-drop-down">
          <a href="javascript:;" className="dropdown-menu-header txt-link">{cur.label}</a>
          <div className="dropdown-menu-list down-layer">
          <ul>
            {
              options.map((item, i) => {
                const activeClass = cn({
                  active: item.val === currentSortField
                })
                return (<li key={i} className={activeClass} onClick={sortHandler}>
                  {activeClass? <SVGIcons.IconCheckDark className="icon-check-dark"/>: ''}
                  <a href="javascript:;">{item.label}</a>
                </li>)
              })
            }
          </ul>
          </div>
        </Dropdown>
      </div>
    )
  }
}


ProjectSegmentSelect.propTypes = {
  currentSegment: PropTypes.string.isRequired
}
export default ProjectSegmentSelect
