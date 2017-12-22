require('./Dropdown.scss')

import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

class Dropdown extends Component {
  constructor(props) {
    super(props)

    this.state = { isHidden: true }

    this.onClickOutside = this.onClickOutside.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onClickOtherDropdown = this.onClickOtherDropdown.bind(this)
  }

  onClickOutside(evt) {
    let currNode = evt.target
    let isDropdown = false

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
      this.setState({ isHidden: true })
    }
  }

  onClick(evt) {
    const dropdownClicked = document.createEvent('Event')
    dropdownClicked.initEvent('dropdownClicked', true, false)

    document.dispatchEvent(dropdownClicked)

    this.setState({ isHidden: !this.state.isHidden })
    evt.stopPropagation()
  }

  onClickOtherDropdown() {
    this.setState({ isHidden: true })
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
    const { className, pointerShadow, noPointer, pointerLeft, noAutoclose } = this.props
    const ddClasses = classNames('dropdown-wrap', {
      [`${className}`] : true,
      [`${ this.props.theme }`] : true,
      hide : this.state.isHidden
    })
    const ndClasses = classNames('Dropdown', {
      'pointer-shadow' : pointerShadow,
      'pointer-hide'   : noPointer,
      'pointer-left'   : pointerLeft,
      'no-autoclose'   : noAutoclose
    })

    return (
      <div className={ ddClasses } onClick={ noAutoclose ? () => {} : this.onClick } ref="Dropdown">
        {
          this.props.children.map((child, index) => {
            if (child.props.className.indexOf('dropdown-menu-header') > -1)
              return noAutoclose ? React.cloneElement(child, {
                onClick: this.onClick,
                key: child.props.key || index
              }) : child
          })
        }

        <div className = {ndClasses}>
          {
            this.props.children.map((child) => {
              if (child.props.className.indexOf('dropdown-menu-list') > -1)
                return child
            })
          }
        </div>
      </div>
    )
  }
}

Dropdown.propTypes = {
  children: PropTypes.array.isRequired
}

export default Dropdown
