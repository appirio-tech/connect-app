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

const enhance = spinnerWhileLoading(props => !props.values.isLoading)
const ProfileSettingsFormEnhanced = enhance(ProfileSettingsForm)
class ProfileSettingsContainer extends Component {
  componentDidMount() {
    this.props.getProfileSettings()
  }

  render() {
    const { profileSettings, saveProfileSettings, uploadProfilePhoto } = this.props

    return (
      <SettingsPanel
        title="My profile"
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

const mapStateToProps = ({ settings }) => ({
  profileSettings: settings.profile
})

const mapDisptachToProps = {
  getProfileSettings,
  saveProfileSettings,
  uploadProfilePhoto,
}

export default connect(mapStateToProps, mapDisptachToProps)(ProfileSettingsContainerWithAuth)
