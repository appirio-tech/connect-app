import { NavLink } from 'react-router-dom'
import React from 'react'
import PT from 'prop-types'
import cn from 'classnames'
import NotificationBadge from '../NotificationBadge/NotificationBadge'
import Tooltip from 'appirio-tech-react-components/components/Tooltip/Tooltip'
import { TOOLTIP_DEFAULT_DELAY } from '../../../config/constants'

import styles from './MenuItem.scss'

const MenuItem = ({
  label,
  to,
  Icon,
  iconClassName,
  exact,
  isActive,
  count,
  toolTipText
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
        {!!count && (
          <Tooltip theme="light" tooltipDelay={TOOLTIP_DEFAULT_DELAY}>
            <div className="tooltip-target">
              <NotificationBadge count={count} />
            </div>
            <div className="tooltip-body">
              {toolTipText}
            </div>
          </Tooltip>
        )}
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
  toolTipText: PT.string
}

export default MenuItem
