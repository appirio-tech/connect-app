import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'
import Dropdown from 'appirio-tech-react-components/components/Dropdown/Dropdown'
import IconCarretDownActive from '../../../../assets/icons/arrow-6px-carret-down-active.svg'
import IconCarretDownNormal from '../../../../assets/icons/arrow-6px-carret-down-normal.svg'
import IconCheckDark from '../../../../assets/icons/check-dark.svg'

const options = [
  { val: 'updatedAt desc', label: 'Last Updated' },
  { val: 'lastActivityAt desc', label: 'Last Activity' },
  { val: 'createdAt', label: 'Oldest First' },
  { val: 'createdAt desc', label: 'Newest First' }
]


class ProjectListTimeSortColHeader extends React.Component {

  constructor(props) {
    super(props)
    this.state = { focused:  false }
    this.onOutsideClick = this.onOutsideClick.bind(this)
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

    if (this.refs.myRef) {
      this.setState({
        focused: false
      })
    }

  }

  componentDidMount() {
    document.removeEventListener('click', this.onOutsideClick)
    document.addEventListener('click', this.onOutsideClick)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onOutsideClick)
  }

  render() {
    const {currentSortField, sortHandler} = this.props
    const cur = _.find(options, o => currentSortField === o.val)
      || options[0]

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
                  return (<li key={i} className={activeClass} onClick={() => sortHandler(item.val)}>
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
