import { NavLink } from 'react-router-dom'
import React from 'react'
import PT from 'prop-types'
import cn from 'classnames'
import NotificationBadge from '../NotificationBadge/NotificationBadge'

import styles from './MenuItem.scss'

const MenuItem = ({
  label,
  to,
  Icon,
  iconClassName,
  exact,
  isActive,
  count,
}) => (
  <li>
    <NavLink
      to={to}
      className={styles.navItem}
      activeClassName={styles.active}
      exact={exact}
      isActive={isActive}
    >
      <span styleName="left">
        {!!Icon && <Icon className={cn(styles.icon, styles[iconClassName])} />}
        {label}
      </span>
      <span styleName="right">
        {!!count && <NotificationBadge count={count} />}
      </span>
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
  isActive: PT.func,
  count: PT.number,
}

export default MenuItem
