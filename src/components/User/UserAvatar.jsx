import React, { PropTypes } from 'react'
import LevelDesignatorIcon from '../../icons/LevelDesignatorIcon'
import { memberLevelByRating } from '../../helpers'

require('./UserAvatar.scss')

const UserAvatar = ({ showLevel, rating, photoURL }) => {
  let levelIcon

  if (showLevel) {
    levelIcon = <LevelDesignatorIcon level={memberLevelByRating(rating)} height={'17px'} width={'17px'}/>
  }

  let backgroundImageUrl = `url(${require('./default-avatar.svg')})`

  if (photoURL)
    backgroundImageUrl = `url(${photoURL}), ${backgroundImageUrl}`

  // Delete -r when taking member search back out of the angular app
  // Renamed to -r to avoid naming collisions
  return (
    <div className="user-avatar" style={{ backgroundImage: backgroundImageUrl }}>
      {levelIcon}
    </div>
  )
}


UserAvatar.propTypes = {
  showLevel: PropTypes.bool,
  rating   : PropTypes.number,
  photoURL : PropTypes.string
}

export default UserAvatar
