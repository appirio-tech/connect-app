import React from 'react'
import PropTypes from 'prop-types'
import { DOMAIN } from '../../config/constants'
import Avatar from 'appirio-tech-react-components/components/Avatar/Avatar'
import { getAvatarResized } from '../../helpers/tcHelpers'
import './UserWithName.scss'

const UserWithName = ({ handle, firstName, lastName, photoURL, photoSize, theme, isLink }) => {
  const url = handle ? `//www.${DOMAIN}/members/${handle}/` : null
  const avatar = (
    <Avatar
      avatarUrl={getAvatarResized(photoURL, photoSize)}
      userName={firstName + ' ' + lastName}
      size={photoSize}
    />
  )

  return (
    <div styleName={`container ${theme}`}>
      {url && isLink ?
        <a styleName={`photo photo-size-${photoSize}`} href={url} target="_blank" rel="noopener noreferrer">{avatar}</a> :
        <span styleName={`photo photo-size-${photoSize}`}>{avatar}</span>
      }
      <span styleName="info">
        {url && isLink ?
          <a styleName="name" href={url} target="_blank" rel="noopener noreferrer">{firstName} {lastName}</a> :
          <span styleName="name">{firstName} {lastName}</span>
        }
        {handle && <span styleName="handle">{handle}</span>}
      </span>
    </div>
  )
}

UserWithName.defaultProps = {
  handle: null,
  isLink: false,
  photoSize: 35,
  theme: 'light'
}

UserWithName.propTypes = {
  handle: PropTypes.string,
  firstName: PropTypes.string.isRequired,
  isLink: PropTypes.bool,
  lastName: PropTypes.string.isRequired,
  photoURL: PropTypes.string,
  photoSize: PropTypes.oneOf([35, 40]),
  /*
    'dark' theme has white font color to use on dark background
    'light' theme has black font color to use on light background
  */
  theme: PropTypes.oneOf(['dark', 'light']),
}

export default UserWithName
