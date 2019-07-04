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

const enhance = spinnerWhileLoading(props => !props.values.isLoading)
const ProfileSettingsFormEnhanced = enhance(ProfileSettingsForm)
class ProfileSettingsContainer extends Component {
  componentDidMount() {
    this.props.getProfileSettings()
  }

  render() {
    const { profileSettings, saveProfileSettings, uploadProfilePhoto, user } = this.props

    return (
      <SettingsPanel
        title="My profile"
        user={user}
      >
        <ProfileSettingsFormEnhanced
          values={profileSettings}
          saveSettings={saveProfileSettings}
          uploadPhoto={uploadProfilePhoto}
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
  user: loadUser.user
})

const mapDispatchToProps = {
  getProfileSettings,
  saveProfileSettings,
  uploadProfilePhoto,
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSettingsContainerWithAuth)
