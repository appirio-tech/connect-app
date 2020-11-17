/**
 * Container for profile settings
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ProfileSettingsForm from '../components/ProfileSettingsForm'
import SettingsPanel from '../../../components/SettingsPanel'
import spinnerWhileLoading from '../../../../../components/LoadingSpinner'
import { requiresAuthentication } from '../../../../../components/AuthenticatedComponent'
import { getProfileSettings, saveProfileSettings, uploadProfilePhoto } from '../../../actions/index'
import { formatProfileSettings } from '../../../helpers/settings'
import { getUserProfileFieldsConfig } from '../../../../../helpers/tcHelpers'

const enhance = spinnerWhileLoading(props => !props.values.isLoading)
const ProfileSettingsFormEnhanced = enhance(ProfileSettingsForm)
class ProfileSettingsContainer extends Component {
  componentDidMount() {
    this.props.getProfileSettings()
  }

  render() {
    const { profileSettings, saveProfileSettings, uploadProfilePhoto, user } = this.props
    const fieldsConfig = getUserProfileFieldsConfig()

    // prefill some fields of the profile
    const prefilledProfileSettings = _.cloneDeep(profileSettings)

    // at the moment we don't let users to update their business email, so in case it's not set, use registration email
    if (fieldsConfig.businessEmail && !profileSettings.settings.businessEmail) {
      prefilledProfileSettings.settings.businessEmail = user.email
    }

    return (
      <SettingsPanel
        title="My Profile"
        user={user}
      >
        <ProfileSettingsFormEnhanced
          user={user}
          values={prefilledProfileSettings}
          saveSettings={saveProfileSettings}
          uploadPhoto={uploadProfilePhoto}
          fieldsConfig={fieldsConfig}
        />
      </SettingsPanel>
    )
  }
}

ProfileSettingsContainer.propTypes = {
  profileSettings: PropTypes.object.isRequired,
  getProfileSettings: PropTypes.func.isRequired
}

const ProfileSettingsContainerWithAuth = requiresAuthentication(ProfileSettingsContainer)

const mapStateToProps = ({ settings, loadUser  }) => ({
  profileSettings: {
    ...settings.profile,
    settings: formatProfileSettings(settings.profile.traits)
  },
  user: loadUser.user,
})

const mapDispatchToProps = {
  getProfileSettings,
  saveProfileSettings,
  uploadProfilePhoto,
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSettingsContainerWithAuth)
