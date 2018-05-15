/**
 * Notifications "read all" footer button
 *
 * FIXME reimplement this component using general Button component from `topcoder-react-utils`
 *       after update to the latest version of `topcoder-react-utils`
 */
import React from 'react'
import { Link } from 'react-router-dom'

import './NotificationsReadAll.scss'

const NotificationsReadAll = ({ children, to, onClick }) => (
  to ? (
    <Link styleName="read-all" to={to}>{children}</Link>
  ) : (
    <button styleName="read-all" onClick={onClick}>{children}</button>
  )
)

export default NotificationsReadAll
