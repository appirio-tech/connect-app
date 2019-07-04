import React from 'react'
import PropTypes from 'prop-types'
import Avatar from 'appirio-tech-react-components/components/Avatar/Avatar'
import moment from 'moment'

import './UserSummary.scss'
import _ from 'lodash'
import {
  ROLE_CONNECT_COPILOT,
  ROLE_CONNECT_MANAGER,
  ROLE_ADMINISTRATOR,
  ROLE_CONNECT_ADMIN } from '../../../config/constants'


const UserSummary = ({user}) => {
  // TODO: Replace hardcoded values with real data
  const stats = {
    activeProjects: 4,
    drafts: 7,
    delivered: 5
  }
  const powerUserRoles = [ROLE_CONNECT_COPILOT, ROLE_CONNECT_MANAGER, ROLE_ADMINISTRATOR, ROLE_CONNECT_ADMIN]
  const isCustomer = _.intersection(user.roles, powerUserRoles).length === 0
  const role = isCustomer ? 'Customer' : 'Member'
  const userName = (user.firstName && user.lastName) && `${user.firstName} ${user.lastName}`
  const memberSince = moment(user.createdAt).format('MMM YYYY')
  return (
    <div styleName="container">
      <div styleName="user">
        <div styleName="avatar" >
          <Avatar avatarUrl={user.photoURL} userName={userName} size={60}/>
        </div>
        <div styleName="info">
          <div styleName="name">
            {userName}
          </div>
          <div styleName="handle">
            @{user.handle}
          </div>
          <div styleName="member-since">
            {role} since {memberSince}
          </div>
        </div>
      </div>
      <div styleName="stats" >
        <div styleName="stat" >
          <div styleName="stat-number">{stats.activeProjects}</div>
          <div styleName="stat-name">Active Projects</div>
        </div>
        <div styleName="stat" >
          <div styleName="stat-number">{stats.drafts}</div>
          <div styleName="stat-name">Drafts</div>
        </div>
        <div styleName="stat" >
          <div styleName="stat-number">{stats.delivered}</div>
          <div styleName="stat-name">Delivered</div>
        </div>
      </div>
    </div>
  )
}

UserSummary.propTypes = {
  user: PropTypes.object.isRequired
}

export default UserSummary
