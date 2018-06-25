import React from 'react'
import PT from 'prop-types'

import { NavLink } from 'react-router-dom'

import styles from './GenericMenu.scss'

const GenericMenu = ({
  navLinks,
}) => (
  <nav styleName="generic-menu">
    <ul styleName="list">
      {!!navLinks && navLinks.map((item, i) => (
        <li key={i}>
          {item.hasNotifications && <i styleName="dot" />}
          {item.to
            ? <NavLink to={item.to} activeClassName={styles.active} exact>{item.label}</NavLink>
            : <span onClick={item.onClick} styleName={item.isActive ? 'active' : ''}>{item.label}</span>
          }
        </li>
      ))}
    </ul>
  </nav>
)

GenericMenu.propTypes = {
  navLinks: PT.arrayOf(PT.shape({
    hasNotifications: PT.bool,
    label: PT.string,
    to: PT.string,
    isActive: PT.bool,
    onClick: PT.func,
  }))
}

export default GenericMenu
