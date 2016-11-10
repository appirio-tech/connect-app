
import React, { Component, PropTypes } from 'react'
import { Link as DirectLink } from 'react-scroll'
import { Icons } from 'appirio-tech-react-components'

require('./SidebarNav.scss')

const scrollProps = {
  spy: true,
  smooth: true,
  offset: -70,// 60px for top bar and 10px for margin from nav bar
  duration: 500,
  activeClass: 'active'
}

/**
 * Renders subitems for navbar
 * @param  {object} child nav sub item
 * @param  {number} idx   index
 */
const renderSubNavItems = (child, idx) => {
  const { name, progress, link, required } = child
  const isComplete = progress.length && progress[0] === progress[1]
  const showProgress = progress[0] > 0
  return (
    <li key={idx}>
      <DirectLink to={link} className="boxs" {...scrollProps} href="javascript:">
        <span className="txt">{name}&nbsp;{required && <span className="required">*</span>}</span>
        <span className="schedule">{ isComplete ? <Icons.IconUICheckBold fill={'#FB7D22'} /> : showProgress && `${progress[0]} of ${progress[1]}`}</span>
      </DirectLink>
    </li>
  )
}

/**
 * Dumb component that renders NavItems
 */
const SidebarNavItem = ({ name, link, required, subItems, index}) =>
  <div className="item">
    <DirectLink to={link} {...scrollProps} href="javascript:">
      <h4 className="title">
        <span className="number">{index}.</span>{name}
          {required && <span className="required">* required</span>}
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
      const num = idx + 1
      return (
        <SidebarNavItem {...child} key={num} index={num} />
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
