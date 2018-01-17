import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'
import { Dropdown } from 'appirio-tech-react-components'
import CarretDownActive from '../../../../assets/icons/arrow-6px-carret-down-active.svg'
import CarretDownNormal from '../../../../assets/icons/arrow-6px-carret-down-normal.svg'
import CheckDark from '../../../../assets/icons/check-dark.svg'

const options = [
  { val: 'updatedAt desc', label: 'Last Updated' },
  { val: 'createdAt', label: 'Oldest First' },
  { val: 'createdAt desc', label: 'Newest First' }
]

/**
 * @params {string} class name
 */
const IconCarretDownNormal = ({ className }) => {
  return <CarretDownNormal className={className}/>
}

IconCarretDownNormal.propTypes = {
  className: PropTypes.string.isRequired
}

/**
 * @params {string} class name
 */
const IconCarretDownActive = ({ className }) => {
  return <CarretDownActive className={className}/>
}

IconCarretDownActive.propTypes = {
  className: PropTypes.string.isRequired
}

/**
 * @params {string} class name
 */
const IconCheckDark = ({ className }) => {
  return <CheckDark className={className}/>
}

IconCheckDark.propTypes = {
  className: PropTypes.string.isRequired
}


class ProjectListTimeSortColHeader extends React.Component {

  constructor(props) {
    super(props)
    this.state = { focused:  false }
  }

  toggleFocusState() {
    this.setState({
      focused: !this.state.focused
    })
  }

  onOutsideClick(ev) {
    const currNode = ev.target

    if(typeof currNode.className === 'string' && currNode.className.indexOf('dropdown') > -1) {
      return
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
            {!this.state.focused? <IconCarretDownNormal className="icon-carret-down-normal"/> : <IconCarretDownActive className="icon-carret-down-active" />}
          </a>
          <div className="dropdown-menu-list down-layer">
          <ul>
            {
              options.map((item, i) => {
                const activeClass = cn({
                  active: item.val === currentSortField
                })
                return (<li key={i} className={activeClass} onClick={sortHandler}>
                  {activeClass? <IconCheckDark className="icon-check-dark"/>: ''}
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


ProjectListTimeSortColHeader.propTypes = {
  currentSortField: PropTypes.string.isRequired,
  sortHandler: PropTypes.func.isRequired
}
export default ProjectListTimeSortColHeader
