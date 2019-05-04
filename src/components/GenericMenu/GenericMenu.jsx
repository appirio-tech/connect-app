import React from 'react'
import PT from 'prop-types'
import cn from 'classnames'

import { NavLink } from 'react-router-dom'
import { Transition } from 'react-transition-group'

import styles from './GenericMenu.scss'

const GenericMenu = ({
  navLinks,
}) => (
  <nav styleName="generic-menu">
    <ul styleName="list">
      {!!navLinks && navLinks.map((item, i) => (
        <li key={i}>
          {/* `timeout` should be same as `.dot` transition duration in CSS */}
          <Transition in={item.hasNotifications} timeout={1000} unmountOnExit>
            {
              state => <i className={cn(styles['dot'], styles[state])} />
            }
          </Transition>
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
