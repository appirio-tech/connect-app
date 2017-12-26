import React from 'react'
import PropTypes from 'prop-types'
import { DOMAIN } from '../../config/constants'
import UserAvatar from './UserAvatar'
require('./UserWithName.scss')

const UserWithName = ({ handle, firstName, lastName, photoURL, maxRating={rating: 0}, showLevel=false }) => {
  const url = `//www.${DOMAIN}/members/${handle}/`
  return (
    <div className="user-block">
      <a href={url} target="_blank" rel="noopener noreferrer" className="photo">
        <UserAvatar rating={maxRating.rating} showLevel={showLevel} photoURL={photoURL} />
      </a>
      <span className="txt-box">
        <a href={url} target="_blank" rel="noopener noreferrer" className="link-black">{firstName} {lastName}</a>
        <span className="txt-gray">{handle}</span>
      </span>
    </div>
  )
}

UserWithName.propTypes = {
  handle  : PropTypes.string.isRequired,
  firstName : PropTypes.string.isRequired,
  lastName  : PropTypes.string.isRequired,
  photoURL  : PropTypes.string,
  maxRating : PropTypes.object,
  showLevel : PropTypes.bool
}

export default UserWithName
