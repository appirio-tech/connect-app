import uniqBy from 'lodash/uniqBy'
import UserTooltip from '../User/UserTooltip'
import React from 'react'
import PT from 'prop-types'
import './AvatarGroup.scss'

function AvatarGroup({ users }) {
  const renderAvatar = (user, index) => {
    return (
      <UserTooltip usr={user} id={index} size={35} previewAvatar />
    )
  }
  return (
    <div className="AvatarGroup">
      { uniqBy(users, 'userId').map(renderAvatar) }
    </div>
  )
}

AvatarGroup.propTypes = {
  users: PT.arrayOf(PT.object).isRequired
}

export default AvatarGroup
