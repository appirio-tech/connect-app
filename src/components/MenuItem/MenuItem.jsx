import { NavLink } from 'react-router-dom'
import React from 'react'
import PT from 'prop-types'

import styles from './MenuItem.scss'

const MenuItem = ({
  label,
  to,
  Icon,
  exact,
  isActive,
}) => (
  <li>
    <NavLink
      to={to}
      className={styles.navItem}
      activeClassName={styles.active}
      exact={exact}
      isActive={isActive}
    >
      <Icon className={styles.icon} />
      {label}
    </NavLink>
  </li>
)

MenuItem.defaultProps = {
  exact: true,
}

MenuItem.propTypes = {
  label: PT.string.isRequired,
  to: PT.string.isRequired,
  Icon: PT.func.isRequired,
  exact: PT.bool,
  isActive: PT.func
}

export default MenuItem
