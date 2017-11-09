import React, { Component, PropTypes} from 'react'
import cn from 'classnames'
import { PROJECT_STATUS } from '../../config/constants'
import './ProjectStatus.scss'

export const enhanceDropdown = (CompositeComponent) => class extends Component {
  constructor(props) {
    super(props)
    this.state = { isOpen : false }
    this.handleClick = this.handleClick.bind(this)
    this.onSelect = this.onSelect.bind(this)
    this.onClickOutside = this.onClickOutside.bind(this)
    this.onClickOtherDropdown = this.onClickOtherDropdown.bind(this)
  }

  handleClick() {
    const dropdownClicked = document.createEvent('Event')
    dropdownClicked.initEvent('dropdownClicked', true, false)

    document.dispatchEvent(dropdownClicked)

    this.setState({ isOpen : !this.state.isOpen })
  }

  onSelect(value) {
    this.handleClick()

    if (this.props.onChangeStatus) this.props.onChangeStatus(value)
  }

  onClickOutside(evt) {
    let currNode = evt.target
    let isDropdown = false
    console.log('onClickOutside')

    do {
      if(currNode.className
        && currNode.className.indexOf
        && currNode.className.indexOf('dropdown-wrap') > -1) {
        isDropdown = true
        break
      }

      currNode = currNode.parentNode

      if(!currNode)
        break
    } while(currNode.tagName)

    if(!isDropdown) {
      this.setState({ isOpen: false })
    }
  }

  onClickOtherDropdown() {
    this.setState({ isOpen: false })
  }

  componentDidMount() {
    document.removeEventListener('click', this.onClickOutside)
    document.removeEventListener('dropdownClicked', this.onClickOtherDropdown)

    document.addEventListener('click', this.onClickOutside)
    document.addEventListener('dropdownClicked', this.onClickOtherDropdown)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClickOutside)
    document.removeEventListener('dropdownClicked', this.onClickOtherDropdown)
  }

  render() {
    const { isOpen } = this.state
    return (
      <div onClick={(e) => e.stopPropagation()} className="dropdown-wrap">
        <CompositeComponent
          { ...this.props }
          isOpen={ isOpen }
          handleClick={ this.handleClick }
          onSelect={ this.onSelect }
        />
      </div>
    )
  }
}


/*eslint-enable camelcase */
const ProjectStatus = ({canEdit, isOpen, status, handleClick, onSelect, showText, withoutLabel, unifiedHeader=true }) => {
  const selected = PROJECT_STATUS.filter((opt) => opt.value === status)[0]
  return (
    <div className="ProjectStatus">
      <div className={cn('status-header', 'ps-' + selected.value, {active: isOpen, editable : canEdit, 'unified-header' : unifiedHeader })} onClick={handleClick}>
        <div className="status-icon"><i /></div>
        {showText && (<span className="status-label">{withoutLabel ? selected.fullName : selected.name}<i className="caret" /></span>) }
      </div>
      { isOpen && canEdit && <ul className="status-dropdown">
        {
          PROJECT_STATUS.map((item) =>
            <li key={item.value}>
              <a
                href="javascript:"
                className={cn('status-option', 'ps-' + item.value, {active: item.value === status})}
                onClick={(e) => {
                  onSelect(item.value, e)
                }}
              >
                <span className="status-icon"><i/></span>
                <span className="status-label">{item.name}</span>
              </a>
            </li>
          )
        }
      </ul>
      }
    </div>
  )
}

ProjectStatus.propTypes = {
  status: PropTypes.oneOf(['draft', 'active', 'in_review', 'reviewed', 'completed', 'paused', 'cancelled']).isRequired
}

ProjectStatus.defaultProps = {
}

export default enhanceDropdown(ProjectStatus)

