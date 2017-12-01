import _ from 'lodash'
import {Avatar} from 'appirio-tech-react-components'
import React, { PropTypes as PT } from 'react'
import './AvatarGroup.scss'

function AvatarGroup({ users }) {

  const uniqueUserList = []
  const uniqueUsers = _.filter(users, user => {
    if (!_.includes(uniqueUserList, user.userId)) {
      uniqueUserList.push(user.userId)
      return true
    }
    return false
  })

  const renderAvatar = (user, index) => {
    return (
      <Avatar
        key={ index }
        avatarUrl={ _.get(user, 'photoURL', require('../../assets/images/avatar-coder.png'))}
        userName={ user.firstName ? (user.firstName + ' ' + user.lastName) : 'Connect user'}
      />
    )
  }
  return (
    <div className="AvatarGroup">
      { uniqueUsers.map(renderAvatar) }
    </div>
  )
}

AvatarGroup.propTypes = {
  users: PT.arrayOf(PT.object).isRequired
}

export default AvatarGroup
