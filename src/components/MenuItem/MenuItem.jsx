import { NavLink, withRouter } from 'react-router-dom'
import React from 'react'
import { some } from 'lodash'
import PT from 'prop-types'
import cn from 'classnames'
import NotificationBadge from '../NotificationBadge/NotificationBadge'
import ArrowUpIcon from '../../assets/icons/arrows-16px-1_minimal-up.svg'


import styles from './MenuItem.scss'

const MenuItem = ({
  label,
  to,
  Icon,
  iconClassName,
  exact,
  isActive,
  count,
  children,
  isAccordionOpen,
  onAccordionToggle,
  match,
  wrapperClass
}) => {
  const matchedPath = match && match.path
  const isChildActive = children && some(children, c => c.to === matchedPath)

  return (
    <li className={
      cn(wrapperClass,
        styles.menuItem,
        { [styles.open]: isAccordionOpen, [styles.withChildren]: children })}
    >
      {!children && (
        <NavLink
          to={to}
          className={styles.navItem}
          activeClassName={styles.active}
          exact={exact}
          isActive={isActive}
        >
          <span styleName="left">
            {!!Icon && (
              <Icon className={cn(styles.icon, styles[iconClassName])} />
            )}
            {label}
          </span>
          <span styleName="right">
            {!!count && <NotificationBadge count={count} />}
          </span>
        </NavLink>
      )}

      {children && (
        <div>
          <div
            className={cn(styles.navItem, {
              [styles.activeParent]: isChildActive,
              [styles.active]: isChildActive
            })}
            onClick={() => onAccordionToggle(!isAccordionOpen)}
          >
            <span styleName="left">
              {!!Icon && (
                <Icon className={cn(styles.icon, styles[iconClassName])} />
              )}
              {label}
            </span>
            <span styleName="right">
              {!!count && <NotificationBadge count={count} />}
            </span>

            <ArrowUpIcon className={styles.arrowUpIcon} />
          </div>

          {isAccordionOpen &&
            <ul>
              { children.map(c => <MenuItem {...c} key={c.to} wrapperClass={styles.childNavItem} />) }
            </ul>
          }
        </div>
      )}
    </li>
  )
}

MenuItem.defaultProps = {
  exact: true
}

MenuItem.propTypes = {
  label: PT.string.isRequired,
  to: PT.string.isRequired,
  Icon: PT.func,
  iconClassName: PT.string,
  exact: PT.bool,
  isActive: PT.func,
  count: PT.number,
  children: PT.array,
  isAccordionOpen: PT.bool,
  onAccordionToggle: PT.func,
  wrapperClass: PT.string
}

export default withRouter(MenuItem)
