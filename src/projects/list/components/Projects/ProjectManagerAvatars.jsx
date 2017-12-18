import React, { PropTypes } from 'react'
import UserAvatar from '../../../../components/User/UserAvatar'
import { DOMAIN } from '../../../../config/constants'

require('./ProjectManagerAvatars.scss')

const ProjectManagerAvatars = ({ managers }) => {
  let extM = false
  if (!managers || !managers.length)
    return <div className="user-block txt-italic">Unclaimed</div>
  if (managers.length > 3) {
    extM = managers.length - 3
    managers.length = 3
  }
  return (
    <div className="user-block">
      {managers.map((user, i) => {
        return (
          <a href={`//www.${DOMAIN}/members/${user.handle}/`} target="_blank" rel="noopener noreferrer" className={`stack-avatar-${i}`} key={i}>
            <UserAvatar rating={0} showLevel={false} photoURL={user.photoURL} />
          </a>
        )
      })}
      {extM && <span className="plus-user">+{extM}</span>}
    </div>
  )
}

ProjectManagerAvatars.propTypes = {
  managers : PropTypes.arrayOf(PropTypes.object)
}

export default ProjectManagerAvatars
