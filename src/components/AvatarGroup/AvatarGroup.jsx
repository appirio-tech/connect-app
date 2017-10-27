import _ from 'lodash'
import {Avatar} from 'appirio-tech-react-components'
import React, { PropTypes as PT } from 'react'
import './AvatarGroup.scss'

function AvatarGroup({ users }) {
  const renderAvatar = (user, index) => {
    return (<Avatar
      avatarUrl={ _.get(user, 'photoURL', require('../../assets/images/avatar-coder.png'))}
      userName={ user.firstName ? (user.firstName + ' ' + user.lastName) : 'Connect user'}
    />)
  }
  return (
    <div className="AvatarGroup">
      { users.map(renderAvatar) }
    </div>
  )
}

AvatarGroup.propTypes = {
  users: PT.arrayOf(PT.object).isRequired
}

export default AvatarGroup
