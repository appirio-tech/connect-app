require('./UserDropdownMenu.scss')

import React, {PropTypes} from 'react'
import classNames from 'classnames'
import { Link } from 'react-router'
import Avatar from '../Avatar/Avatar'
import Dropdown from '../Dropdown/Dropdown'


const UserDropdownMenu = ({ userName, userHandle, userImage, domain, loginUrl, registerUrl, menuItems, forReactRouter}) => {

  const userDropdownLists = [
    [
      { label: 'My Profile', link: '/profile/' + userHandle, id: 0 },
      { label: 'Dashboard', link: '/my-dashbaord', id: 1 },
      { label: 'Settings', link: '/settings/profile', id: 2 },
      { label: 'Payments', link: '//community.' + domain  + '/PactsMemberServlet?module=PaymentHistory&full_list=false', id: 3 }
    ],
    [
      { label: 'Help', link: '//help.' + domain, id: 0 }
    ],
    [
      { label: 'Log out', link: '/logout', id: 0 }
    ]
  ]

  const loginButtonClasses= classNames('tc-btn', 'tc-btn-sm', {
    // if register url is not present, we are not showing register button
    // and if register button is not there, we assume it is present somewhere on the page itself
    // and Login button should be secondary in that case
    'tc-btn-secondary' : !registerUrl,
    'tc-btn-primary': registerUrl
  })
  const publicDOM = (
    <div className="UserDropdownMenu non-logged-in">
      { registerUrl && <a className="tc-btn tc-btn-sm tc-btn-secondary" href={registerUrl} >Register</a> }
      { loginUrl && <a className={ loginButtonClasses } href={loginUrl} >Log in</a> }
    </div>
  )

  const menuList = menuItems ? menuItems : userDropdownLists
  const rendreLink = (link) => {
    return forReactRouter && !link.absolute
    ? <Link to={ link.link }>{ link.label }</Link>
    : <a href={ link.link }>{ link.label }</a>
  }
  const loggedInDOM = (
    <div className="UserDropdownMenu">
      <Dropdown pointerShadow>
        <div className="dropdown-menu-header">
          <span className="user-image"><Avatar avatarUrl={ userImage } userName={ userName } /></span>
          <span className="username">{ userHandle }</span>
          <img className="dropdown-arrow" src={ require('./arrow-small-down.svg') } />
        </div>

        <div className="dropdown-menu-list">
          {
            menuList.map((list, i) => {
              return ( <ul key={ i }>
                {
                  list.map((link, j) => {
                    return (<li className="user-menu-item transition" key={ j }>
                      { rendreLink(link) }
                    </li>)
                  })
                }
              </ul> )
            })
          }

        </div>
      </Dropdown>
    </div>
  )

  return userHandle ? loggedInDOM : publicDOM
}

UserDropdownMenu.propTypes = {
  userHandle    : PropTypes.string,
  userImage     : PropTypes.string,
  domain        : PropTypes.string.isRequired,
  loginUrl      : PropTypes.string,
  registerUrl   : PropTypes.string
}

UserDropdownMenu.defaultProps = {
  loginUrl      : '/login',
  registerUrl   : '/register'
}

export default UserDropdownMenu
