import React from 'react'
import { default as ReactAvatar } from 'react-avatar'

require('./Avatar.scss')

const Avatar = ({ avatarUrl, userName, size }) => {
  const s = size || 35
  const src = !avatarUrl && !userName ? require('./place-holder.svg') : avatarUrl
  return (
    <div className="Avatar">
      <ReactAvatar src={ src } name={ userName } size={ s }/>
    </div>
  )
}

export default Avatar
