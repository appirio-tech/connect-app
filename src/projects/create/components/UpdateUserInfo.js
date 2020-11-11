import React, { Component } from 'react'
import PT from 'prop-types'
import ModalControl from '../../../components/ModalControl'
import TailLeft from '../../../assets/icons/arrows-16px-1_tail-left.svg'
import { DOMAIN } from '../../../config/constants'
import './UpdateUserInfo.scss'
import IncompleteUserProfile from '../../../components/IncompleteUserProfile/IncompleteUserProfile'
import { hasPermission } from '../../../helpers/permissions'
import { PERMISSIONS } from '../../../config/permissions'

class UpdateUserInfo extends Component {
  constructor(props) {
    super(props)
  }

  componentDidUpdate() {
    const { isMissingUserInfo, closeUserSettings } = this.props

    if (!isMissingUserInfo) {
      closeUserSettings()
    }
  }
  render() {
    const {
      profileSettings,
      saveProfileSettings,
      closeUserSettings,
      user,
    } = this.props

    return (
      <div styleName="container">
        <ModalControl
          styleName="back-button"
          icon={<TailLeft className="icon-tail-left" />}
          label="back"
          onClick={closeUserSettings}
        />

        <div styleName="user-container">
          <span styleName="title-1">Profile Information</span>
          <span styleName="title-2">
            You have incomplete required profile information.
          </span>
          <span styleName="title-3">
            Please complete your profile information below to able to submit
            your project request.
          </span>
          <IncompleteUserProfile
            profileSettings={profileSettings}
            saveProfileSettings={saveProfileSettings}
            user={user}
            submitButton="Send My Request"
            showBackButton
            onBack={closeUserSettings}
            buttonExtraClassName="tc-btn-md"
          />
          {hasPermission(PERMISSIONS.VIEW_USER_PROFILE_AS_CUSTOMER) && (
            <p styleName="bottom-note">
              Were you looking to join Topcoder’s freelancer community and
              participate in work? <a href={`//www.${DOMAIN}`}>Click here</a>
            </p>
          )}
        </div>
      </div>
    )
  }
}

UpdateUserInfo.defaultProps = {
  closeUserSettings: () => {},
}

UpdateUserInfo.propTypes = {
  profileSettings: PT.object.isRequired,
  isMissingUserInfo: PT.bool.isRequired,
  closeUserSettings: PT.func,
}

export default UpdateUserInfo
