/**
 * Mobile menu
 *
 * This menu is displayed when user clicks hamburger button
 */
import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { NavLink } from 'react-router-dom'
import UserWithName from '../User/UserWithName'
import cn from 'classnames'
import XMartIcon from '../../assets/icons/x-mark-white.svg'
import style from './MobileMenu.scss'

const MobileMenu = ({ user, onClose, menu }) => {
  const isActive = (link) => () => {
    return window.location.pathname + window.location.search === link
  }

  const renderLink = (link) => {
    const params = {}

    if (link.onClick) {
      params.onClick = (evt) => {
        link.onClick(evt)
        onClose && onClose()
      }
    } else {
      // close menu when click any link
      params.onClick = onClose
    }

    if (link.absolute) {
      return <a href={link.link} target="_blank" {...params}>{link.label}</a>
    } else {
      return <NavLink to={link.link} activeClassName={style['menu-item-active']} {...params} isActive={isActive(link.link)}>{link.label}</NavLink>
    }
  }

  return (
    <div styleName="container">
      <div styleName="header">
        <UserWithName {..._.pick(user, 'handle', 'firstName', 'lastName', 'photoURL')} photoSize={40} theme="dark" />
        <div styleName="close" onClick={onClose}><XMartIcon /></div>
      </div>
      <div styleName="body">
        {menu.map((submenu, submenuIndex) => (
          <ul styleName={cn('menu', submenu.style)} key={submenuIndex}>
            {submenu.items.map((item, itemIndex) => <li key={itemIndex}>{renderLink(item)}</li>)}
          </ul>
        ))}
      </div>
      <div styleName="footer">Topcoder &copy; 2018</div>
    </div>
  )
}

MobileMenu.propTypes = {
  user: PropTypes.any,
}

export default MobileMenu
