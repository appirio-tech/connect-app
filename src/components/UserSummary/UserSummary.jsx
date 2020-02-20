import React from 'react'
import PropTypes from 'prop-types'
import Avatar from 'appirio-tech-react-components/components/Avatar/Avatar'
import moment from 'moment'

import './UserSummary.scss'
import { getFullNameWithFallback, getAvatarResized } from '../../helpers/tcHelpers'

const UserSummary = ({user}) => {
  // TODO: Replace hardcoded values with real data
  /* const stats = {
    activeProjects: 4,
    drafts: 7,
    delivered: 5
  } */
  const userName = getFullNameWithFallback(user)
  const memberSince = moment(user.createdAt).format('MMM YYYY')
  return (
    <div styleName="container">
      <div styleName="user">
        <div styleName="avatar" >
          <Avatar avatarUrl={getAvatarResized(user.photoURL || '', 60)} userName={userName} size={60}/>
        </div>
        <div styleName="info">
          <div styleName="name">
            {userName}
          </div>
          <div styleName="handle">
            @{user.handle}
          </div>
          <div styleName="member-since">
            User since {memberSince}
          </div>
        </div>
      </div>
      {/* <div styleName="stats" >
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
      </div> */}
    </div>
  )
}

UserSummary.propTypes = {
  user: PropTypes.object.isRequired
}

export default UserSummary
