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
          {item.hasNewItems && <i styleName="dot" />}
          <NavLink to={item.to} activeClassName={styles.active} exact>{item.label}</NavLink>
        </li>
      ))}
    </ul>
  </nav>
)

GenericMenu.propTypes = {
  navLinks: PT.arrayOf(PT.shape({
    hasNewItems: PT.bool,
    label: PT.string,
    to: PT.string,
  }))
}

export default GenericMenu
