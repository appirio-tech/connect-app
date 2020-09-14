/**
 * Incomplete User Profile Form.
 */
import React from 'react'
import PT from 'prop-types'
import { PROFILE_FIELDS_CONFIG } from '../../config/constants'
import ProfileSettingsForm from '../../routes/settings/routes/profile/components/ProfileSettingsForm'
import { getDefaultTopcoderRole } from '../../helpers/permissions'

const IncompleteUserProfile = ({
  profileSettings,
  saveProfileSettings,
  isTopcoderUser,
  user,
  ...restProps
}) => {
  const fieldsConfig = isTopcoderUser ? PROFILE_FIELDS_CONFIG.TOPCODER : PROFILE_FIELDS_CONFIG.CUSTOMER
  // never show avatar
  delete fieldsConfig.avatar
  // config the form to only show required fields which doesn't have the value yet
  const missingFieldsConfig = _.reduce(fieldsConfig, (acc, isFieldRequired, fieldKey) => {
    if (isFieldRequired && !_.get(profileSettings, `settings.${fieldKey}`)) {
      acc[fieldKey] = isFieldRequired
    }
    return acc
  }, {})

  // prefill some fields of the profile
  const prefilledProfileSettings = _.cloneDeep(profileSettings)

  // if time zone is required and doesn't have a value yet,
  // then detect timezone using browser feature and prefill the form
  if (fieldsConfig.timeZone && !profileSettings.settings.timeZone) {
    prefilledProfileSettings.settings.timeZone = (new Intl.DateTimeFormat()).resolvedOptions().timeZone
  }

  if (isTopcoderUser) {
    // We don't ask Topcoder User for "Company Name" and "Title"
    // but server requires them, so if they are not yet defined, we set them automatically
    if (!profileSettings.settings.companyName) {
      prefilledProfileSettings.settings.companyName = 'Topcoder'
    }
    if (!profileSettings.settings.title) {
      prefilledProfileSettings.settings.title = getDefaultTopcoderRole(user)
    }
  } else {
    // at the moment we don't let users to update their business email, so in case it's not set, use registration email
    if (!profileSettings.settings.businessEmail) {
      prefilledProfileSettings.settings.businessEmail = user.email
    }
  }

  return (
    <ProfileSettingsForm
      {...restProps}
      values={prefilledProfileSettings}
      saveSettings={saveProfileSettings}
      fieldsConfig={missingFieldsConfig}
      shouldDoValidateOnStart
      shouldShowTitle={false}
    />
  )
}

IncompleteUserProfile.propTypes = {
  profileSettings: PT.object.isRequired,
  saveProfileSettings: PT.func.isRequired,
  isTopcoderUser: PT.bool.isRequired,
  user: PT.object.isRequired,
}

export default IncompleteUserProfile
