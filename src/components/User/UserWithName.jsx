import React from 'react'
import PropTypes from 'prop-types'
import { DOMAIN } from '../../config/constants'
import Avatar from 'appirio-tech-react-components/components/Avatar/Avatar'
import './UserWithName.scss'

const UserWithName = ({ handle, firstName, lastName, photoURL, photoSize, theme }) => {
  const url = `//www.${DOMAIN}/members/${handle}/`

  return (
    <div styleName={`container ${theme}`}>
      <a styleName={`photo photo-size-${photoSize}`} href={url} target="_blank" rel="noopener noreferrer">
        <Avatar
          avatarUrl={photoURL}
          userName={firstName + ' ' + lastName}
          size={photoSize}
        />
      </a>
      <span styleName="info">
        <a styleName="name" href={url} target="_blank" rel="noopener noreferrer">{firstName} {lastName}</a>
        {handle && <span styleName="handle">{handle}</span>}
      </span>
    </div>
  )
}

UserWithName.defaultProps = {
  photoSize: 35,
  theme: 'light'
}

UserWithName.propTypes = {
  handle: PropTypes.string,
  firstName: PropTypes.string.isRequired,
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
