import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'
import { Dropdown, DropdownItem } from 'appirio-tech-react-components'
import SVGIcons from '../../../../Components/Icons/Icons'

const options = [
  { val: 'updatedAt desc', label: 'Last Updated' },
  { val: 'createdAt', label: 'Oldest First' },
  { val: 'createdAt desc', label: 'Newest First' }
]

class ProjectListTimeSortColHeader extends React.Component {

  constructor(props) {
    super(props)
    this.state = { focused:  false }
  }

  toggleFocusState(ev) {
    this.setState({
      focused: !this.state.focused
    })
  }

  onOutsideClick(ev) {
    let currNode = ev.target
    let isDropdown = false

    if(typeof currNode.className === 'string' && currNode.className.indexOf('dropdown') > -1) {
      return;
    }

    this.setState({
      focused: false
    })
  }

  componentDidMount() {
    document.addEventListener('click', ev => this.onOutsideClick(ev))
  }

  render() {
    const cur = _.find(options, o => currentSortField === o.val)
      || options[0]
    const {currentSortField, sortHandler} = this.props

    return (
      <div>
        <Dropdown className="project-drop-down" onClickOutside={this.toggleFocusState}>
          <a href="javascript:;" className="dropdown-menu-header txt-link" onClick={ev => this.toggleFocusState(ev)}>
            {cur.label}
            {!this.state.focused? <SVGIcons.IconCarretDownNormal className="icon-carret-down-normal"/> : <SVGIcons.IconCarretDownActive className="icon-carret-down-active" />}
          </a>
          <div className="dropdown-menu-list down-layer">
          <ul>
            {
              options.map((item, i) => {
                const activeClass = cn({
                  active: item.val === currentSortField
                })
                return <li key={i} className={activeClass} onClick={sortHandler}>
                  {activeClass? <SVGIcons.IconCheckDark className="icon-check-dark"/>: ""}
                  <a href="javascript:;">{item.label}</a>
                </li>
              })
            }
          </ul>
          </div>
        </Dropdown>
      </div>
    )
  }
}


ProjectListTimeSortColHeader.propTypes = {
  currentSortField: PropTypes.string.isRequired,
  sortHandler: PropTypes.func.isRequired
}
export default ProjectListTimeSortColHeader
