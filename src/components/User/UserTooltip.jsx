import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Tooltip from 'appirio-tech-react-components/components/Tooltip/Tooltip'
import Avatar from 'appirio-tech-react-components/components/Avatar/Avatar'
import { DOMAIN } from '../../config/constants'
import { getAvatarResized, getUserTrait } from '../../helpers/tcHelpers'
require('./UserTooltip.scss')

class UserTooltip extends Component {
  constructor(props) {
    super(props)
    this.state = {
      photoUrl: null
    }
  }

  componentWillMount() {
    const userHandle = _.get(this.props.usr, 'handle')
    this.fetchUserTrait(userHandle)
  }

  componentWillReceiveProps(nextProps) {
    const handle = _.get(this.props.usr, 'handle')
    const newHandle = _.get(nextProps.usr, 'handle')
    if (handle === newHandle) {
      return
    }
    this.fetchUserTrait(newHandle)
  }

  fetchUserTrait(handle) {
    getUserTrait(handle).then(resp => {
      if (this.props.usr.handle === handle) {
        this.setState({photoUrl: resp.photoUrl})
      }
    }).catch(() => {
      this.setState({photoUrl: null})
    })
  }

  render() {
    const { usr, id, previewAvatar, size } = this.props
    const { photoUrl } = this.state
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
                avatarUrl={photoUrl && getAvatarResized(photoUrl, size)}
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
                  avatarUrl={photoUrl && getAvatarResized(photoUrl, size)}
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
