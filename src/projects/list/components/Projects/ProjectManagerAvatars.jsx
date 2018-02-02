import uniqBy from 'lodash/uniqBy'
import React from 'react'
import PropTypes from 'prop-types'
import UserTooltip from '../../../../components/User/UserTooltip'

require('./ProjectManagerAvatars.scss')

const ProjectManagerAvatars = ({ managers }) => {
  let extM = false
  if (!managers || !managers.length)
    return <div className="user-block txt-italic">Unclaimed</div>
  const uniqManagers = uniqBy(managers, 'userId')
  if (uniqManagers.length > 3) {
    extM = uniqManagers.length - 3
    uniqManagers.length = 3
  }
  return (
    <div className="user-block">
      {uniqManagers.map((user, i) => {
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
