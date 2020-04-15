import React, { Component } from 'react'
import PT from 'prop-types'
import ModalControl from '../../../components/ModalControl'
import TailLeft from '../../../assets/icons/arrows-16px-1_tail-left.svg'

import ProfileSettingsForm from '../../../routes/settings/routes/profile/components/ProfileSettingsForm'
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator'

import './UpdateUserInfo.scss'

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
      uploadProfilePhoto,
      isCustomer,
      isCopilot,
      isManager,
      isTopcoderUser,
      closeUserSettings,
    } = this.props

    if (
      profileSettings.isLoading ||
      profileSettings.pending
    ) {
      return (
        <LoadingIndicator />
      )
    }

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
          <span styleName="title-2">You have incomplete required profile information.</span>
          <span styleName="title-3">Please complete your profile information below to able to submit your project request.</span>
          <ProfileSettingsForm
            values={profileSettings}
            saveSettings={saveProfileSettings}
            uploadPhoto={uploadProfilePhoto}
            isCustomer={isCustomer}
            isCopilot={isCopilot}
            isManager={isManager}
            showTitle={!isTopcoderUser}
            showAvatar={false}
            showBusinessEmail={!isTopcoderUser}
            showBusinessPhone={!isTopcoderUser}
            showCompanyName={false}
            isRequiredTimeZone={isTopcoderUser}
            isRequiredCountry={isTopcoderUser}
            isRequiredWorkingHours={isTopcoderUser}
            isRequiredBusinessEmail={!isTopcoderUser}
            submitButton="Send my Request"
            showBackButton
            onBack={closeUserSettings}
            shouldDoValidateOnStart
            shouldShowTitle={false}
          />
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
