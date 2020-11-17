/**
 * Incomplete User Profile Form.
 */
import React from 'react'
import PT from 'prop-types'
import ProfileSettingsForm from '../../routes/settings/routes/profile/components/ProfileSettingsForm'
import { getDefaultTopcoderRole, hasPermission } from '../../helpers/permissions'
import { timezones } from 'appirio-tech-react-components/constants/timezones'
import { getUserProfileFieldsConfig } from '../../helpers/tcHelpers'
import { PERMISSIONS } from '../../config/permissions'

const IncompleteUserProfile = ({
  profileSettings,
  saveProfileSettings,
  user,
  ...restProps
}) => {
  const fieldsConfig = getUserProfileFieldsConfig()
  // never show avatar
  delete fieldsConfig.avatar
  // config the form to only show required fields which doesn't have the value yet
  const missingFieldsConfig = _.reduce(fieldsConfig, (acc, isFieldRequired, fieldKey) => {
    if (isFieldRequired && _.isNil(_.get(profileSettings, `settings.${fieldKey}`))) {
      acc[fieldKey] = isFieldRequired
    }
    return acc
  }, {})

  // prefill some fields of the profile
  const prefilledProfileSettings = _.cloneDeep(profileSettings)

  // if time zone is required and doesn't have a value yet,
  // then detect timezone using browser feature and prefill the form
  if (fieldsConfig.timeZone && !profileSettings.settings.timeZone) {
    const autodetectedTimeZone = (new Intl.DateTimeFormat()).resolvedOptions().timeZone
    // only use autodetected timezone if it's on our timezone list, otherwise leave it empty
    if (_.find(timezones, { zoneName: autodetectedTimeZone})) {
      prefilledProfileSettings.settings.timeZone = autodetectedTimeZone
    }
    console.log('Auto-detected timezone', prefilledProfileSettings.settings.timeZone)
  }

  if (!hasPermission(PERMISSIONS.VIEW_USER_PROFILE_AS_CUSTOMER)) {
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
  user: PT.object.isRequired,
}

export default IncompleteUserProfile
