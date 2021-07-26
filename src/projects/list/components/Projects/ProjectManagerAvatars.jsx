import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import UserTooltip from '../../../../components/User/UserTooltip'

import styles from './ProjectManagerAvatars.scss'

const ProjectManagerAvatars = ({ managers, maxShownNum = 3, size = 35 }) => {
  let extM = false
  if (!managers || !managers.length)
    return <div className="user-block txt-italic">Unclaimed</div>
  const uniqManagers = _.uniqBy(managers, 'userId')
  if (uniqManagers.length > maxShownNum) {
    extM = uniqManagers.length - maxShownNum
    uniqManagers.length = maxShownNum
  }
  return (
    <div className={`user-block ${styles['container']}`} onClick={e => e.stopPropagation()}>
      {uniqManagers.map((user, i) => {
        return (
          <div className={`stack-avatar stack-avatar-${i}`} key={i}>
            <UserTooltip usr={user} id={i} size={size} previewAvatar />
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
