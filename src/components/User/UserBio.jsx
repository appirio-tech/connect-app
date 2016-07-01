import React, { PropTypes } from 'react'
import Dotdotdot from 'react-dotdotdot'

require('./UserBio.scss')

const UserBio = ({ bio }) => {
  return (
    <div className="user-bio">
      <Dotdotdot clamp={3}>
        {bio}
      </Dotdotdot>
    </div>
  )
}

UserBio.propTypes = {
  bio: PropTypes.string.isRequired
}

export default UserBio
