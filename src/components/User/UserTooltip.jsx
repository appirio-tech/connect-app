import React, { PropTypes } from 'react'
import _ from 'lodash'
import { Tooltip } from 'appirio-tech-react-components'
import UserAvatar from './UserAvatar'
import { DOMAIN } from '../../../config/constants'

require('./UserTooltip.scss')

const UserTooltip = ({ usr, id }) => {
  const rating = _.get(usr, 'maxRating.rating', 0)

  return (
    <Tooltip theme="customer-data" pointerWidth={20}>
      <div className="tooltip-target" id={`tt-${id}`}>
        <span className="project-customer">{usr.firstName} {usr.lastName}</span>
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
            <div className="user-handle-container">
              <span>{usr.handle}</span>
            </div>
            <div className="user-email-container">
              <a href={`mailto:${usr.email}`}>{usr.email}</a>
            </div>
          </div>
        </div>
        <div className="sf-data-bottom-container">
          <div className="segment-data">
            <span>Wipro Digital Jaipur / Topgear</span>
          </div>
          <div className="segment-data">
            <span>0141-2211258</span>
          </div>
          <div className="segment-data">
            <a href="https://google.com" target="_blank" rel="noopener noreferrer" className="ext-link">SDFC Lead Page</a>
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
  ]).isRequired
}

export default UserTooltip