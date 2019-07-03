import { NavLink } from 'react-router-dom'
import React from 'react'
import PT from 'prop-types'

import styles from './MenuItem.scss'

const MenuItem = ({ navLink }) => {
  const Icon = navLink.Icon
  return (
    <li>
      <NavLink
        to={navLink.to}
        className={styles.navItem}
        activeClassName={styles.active}
        exact
      >
        <Icon className={styles.icon} />
        {navLink.label}
      </NavLink>
    </li>
  )
}

MenuItem.propTypes = {
  navLink: PT.shape({
    label: PT.string,
    to: PT.string,
    Icon: PT.object
  })
}

export default MenuItem
