/**
 * Tabs for project page: details / specification
 *
 * Displayed on mobile only
 */
import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

import style from './MobileNavigationTabs.scss'

const MobileNavigationTabs = ({ projectId }) => (
  <ul styleName="tabs">
    <li><NavLink styleName="link" activeClassName={style.active} to={`/projects/${projectId}`} exact>Dashboard</NavLink></li>
    <li><NavLink styleName="link" activeClassName={style.active} to={`/projects/${projectId}/specification`}>Specifications</NavLink></li>
  </ul>
)

MobileNavigationTabs.propTypes = {
  projectId: PropTypes.number.isRequired
}

export default MobileNavigationTabs
