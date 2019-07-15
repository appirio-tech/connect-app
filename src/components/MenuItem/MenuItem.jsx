import { NavLink } from 'react-router-dom'
import React from 'react'
import PT from 'prop-types'
import cn from 'classnames'

import styles from './MenuItem.scss'

const MenuItem = ({
  label,
  to,
  Icon,
  iconClassName,
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
      {!!Icon && <Icon className={cn(styles.icon, styles[iconClassName])} />}
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
  Icon: PT.func,
  iconClassName: PT.string,
  exact: PT.bool,
  isActive: PT.func
}

export default MenuItem
