import _ from 'lodash'
import {Avatar} from 'appirio-tech-react-components'
import React from 'react'
import PT from 'prop-types'
import './AvatarGroup.scss'

function AvatarGroup({ users }) {
  const renderAvatar = (user, index) => {
    return (
      <Avatar
        key={ index }
        avatarUrl={ _.get(user, 'photoURL', require('../../assets/images/avatar-coder.svg'))}
        userName={ user.firstName ? (user.firstName + ' ' + user.lastName) : 'Connect user'}
      />
    )
  }
  return (
    <div className="AvatarGroup">
      { _.uniqBy(users, 'userId').map(renderAvatar) }
    </div>
  )
}

AvatarGroup.propTypes = {
  users: PT.arrayOf(PT.object).isRequired
}

export default AvatarGroup
