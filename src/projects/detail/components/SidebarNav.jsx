
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

/**
 * Renders subitems for navbar
 * @param  {object} child nav sub item
 * @param  {number} idx   index
 */
const renderSubNavItems = (child, idx) => {
  const { name, percentage, link } = child
  const _anchorClasses = classNames('boxes', {
    complete: percentage === 100
  })
  const _iconClasses = classNames('icons', {
    'icons-complete': percentage === 100
  })
  return (
    <li key={idx}>
      <DirectLink to={link} className={_anchorClasses} {...scrollProps} href="false;">
        <span className="txt">{name}</span>
        <span className="schedule">{percentage}%</span>
        <i className={_iconClasses}></i>
      </DirectLink>
    </li>
  )
}

/**
 * Dumb component that renders NavItems
 */
const SidebarNavItem = ({ name, link, subItems, index}) =>
  <div className="item">
    <DirectLink to={link} {...scrollProps} href="false;">
      <h4 className="title">
        <span className="number">{index}.</span>{name}
      </h4>
    </DirectLink>
    <ul>
      {subItems.map(renderSubNavItems)}
    </ul>
  </div>

class SidebarNav extends Component {
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

export default SidebarNav
