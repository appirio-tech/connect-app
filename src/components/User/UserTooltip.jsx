import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import Tooltip from 'appirio-tech-react-components/components/Tooltip/Tooltip'
import Avatar from 'appirio-tech-react-components/components/Avatar/Avatar'
import { DOMAIN } from '../../../config/constants'

require('./UserTooltip.scss')

const UserTooltip = ({ usr, id, previewAvatar, size }) => {
  const theme = `customer-data size-${size}`
  const tooltipMargin = previewAvatar ? -(100 + (id * 20)) : 0
  const userHandle = _.get(usr, 'handle')
  const userEmail = _.get(usr, 'email')
  const firstName = _.get(usr, 'firstName', '')
  const lastName = _.get(usr, 'lastName', '')
  let userFullName = `${firstName} ${lastName}`
  userFullName = userFullName.trim().length > 0 ? userFullName : 'Connect user'
  return (
    <Tooltip theme={theme} pointerWidth={20} tooltipMargin={tooltipMargin}>
      <div className="tooltip-target" id={`tt-${id}`}>
        {
          previewAvatar ? (<div className={`stack-avatar-${id}`}>
            <Avatar
              avatarUrl={_.get(usr, 'photoURL')}
              userName={userFullName}
              size={size}
            />
          </div>) :
            <span className="project-customer">{ userFullName }</span>
        }
      </div>
      <div className="tooltip-body">
        <div className="top-container">
          <div className="tt-col-avatar">
            <a href={`//www.${DOMAIN}/members/${userHandle}/`} target="_blank" rel="noopener noreferrer" className="tt-user-avatar">
              <Avatar
                avatarUrl={_.get(usr, 'photoURL')}
                userName={userFullName}
              />
            </a>
          </div>
          <div className="tt-col-user-data">
            <div className="user-name-container">
              <span>{ userFullName }</span>
            </div>
            <div className={`user-handle-container ${userEmail ? 'with-email' : ''}`}>
              <span>{ userHandle }</span>
            </div>
            <div className="user-email-container">
              <a href={`mailto:${userEmail}`}>{ userEmail }</a>
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
  previewAvatar: PropTypes.bool,
  size: PropTypes.number
}

UserTooltip.defaultProps = {
  size: 30,
  previewAvatar: false
}

export default UserTooltip
