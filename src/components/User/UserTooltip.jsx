import React, { PropTypes } from 'react'
import _ from 'lodash'
import { Tooltip } from 'appirio-tech-react-components'
import UserAvatar from './UserAvatar'
import { DOMAIN } from '../../../config/constants'

require('./UserTooltip.scss')

const UserTooltip = ({ usr, id, previewAvatar }) => {
  const rating = _.get(usr, 'maxRating.rating', 0)
  const theme = `customer-data level-${id}`
  const tooltipMargin = previewAvatar ? -(100 + (id * 20)) : 0
  return (
    <Tooltip theme={theme} pointerWidth={20} tooltipMargin={tooltipMargin}>
      <div className="tooltip-target" id={`tt-${id}`}>
        {
          previewAvatar ? (<div className={`stack-avatar-${id}`}>
            <UserAvatar rating={0} showLevel={false} photoURL={usr.photoURL} />
          </div>) :
          <span className="project-customer">{usr.firstName} {usr.lastName}</span>
        }
      </div>
      <div className="tooltip-body">
        <div className="top-container">
          <div className="tt-col-avatar">
            <a href={`//www.${DOMAIN}/members/${usr.handle}/`} target="_blank" rel="noopener noreferrer" className="tt-user-avatar">
              <UserAvatar rating={rating} showLevel={false} photoURL={usr.photoURL} />
            </a>
          </div>
          <div className="tt-col-user-data">
            <div className="user-name-container">
              <span>{usr.firstName} {usr.lastName}</span>
            </div>
            <div className={`user-handle-container ${usr.email ? 'with-email' : ''}`}>
              <span>{usr.handle}</span>
            </div>
            <div className="user-email-container">
              <a href={`mailto:${usr.email}`}>{usr.email}</a>
            </div>
          </div>
        </div>
      </div>
    </Tooltip>
  )
}

UserTooltip.propTypes = {
  usr: PropTypes.object.isRequired,
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  previewAvatar: PropTypes.bool
}

UserTooltip.defaultProps = {
  previewAvatar: false
}

export default UserTooltip
