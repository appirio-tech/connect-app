import React, { PropTypes } from 'react'
import UserTooltip from '../../../../components/User/UserTooltip'

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
          <div className={`stack-avatar stack-avatar-${i}`} key={i}>
            <UserTooltip usr={user} id={i} previewAvatar />
          </div>
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
