
import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { Link as DirectLink } from 'react-scroll'
require('./SidebarNav.scss')

const scrollProps = {
  spy: true,
  smooth: true,
  offset: -10,
  duration: 500,
  activeClass: 'active'
}

export class SidebarNavItem extends Component {
  render() {
    const renderChild = (child, idx) => {
      const { name, percentage, link } = child
      const _anchorClasses = classNames('boxes', {
        complete: percentage === 100
      })
      const _iconClasses = classNames('icons', {
        'icons-complete': percentage === 100
      })

      return (
        <li key={idx}>
          <DirectLink to={link} className={_anchorClasses} {...scrollProps} href="javascript;;">
            <span className="txt">{name}</span>
            <span className="schedule">{percentage}%</span>
            <i className={_iconClasses}></i>
          </DirectLink>
        </li>
      )
    }
    const { name, link, subItems, index} = this.props
    return (
      <div className="item">
        <DirectLink to={link} {...scrollProps} href="javascript;;">
          <h4 className="title">
            <span className="number">{index}.</span>{name}
          </h4>
        </DirectLink>
        <ul>
          {subItems.map(renderChild)}
        </ul>
      </div>
    )
  }
}

SidebarNavItem.propTypes = {
  name: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  subItems: PropTypes.arrayOf(PropTypes.object.isRequired)
}

export class SidebarNav extends Component {
  render() {
    const {items} = this.props

    const renderChild = (child, idx) => {
      const { name, link, subItems} = child
      const num = idx + 1
      return (
        <SidebarNavItem name={name} link={link} subItems={subItems} key={idx} index={num} />
      )
    }
    return (
      <div className="list-group">
        {items.map(renderChild)}
      </div>
    )
  }
}

SidebarNav.PropTypes = {
  items: PropTypes.arrayOf(PropTypes.instanceOf(SidebarNavItem))
}
