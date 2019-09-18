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
import { ROLE_CONNECT_COPILOT, ROLE_CONNECT_MANAGER, ROLE_CONNECT_ACCOUNT_MANAGER, ROLE_CONNECT_COPILOT_MANAGER, ROLE_ADMINISTRATOR, ROLE_CONNECT_ADMIN } from '../../../../../config/constants'

const enhance = spinnerWhileLoading(props => !props.values.isLoading)
const ProfileSettingsFormEnhanced = enhance(ProfileSettingsForm)
class ProfileSettingsContainer extends Component {
  componentDidMount() {
    this.props.getProfileSettings()
  }

  render() {
    const { profileSettings, saveProfileSettings, uploadProfilePhoto, user,
      isCustomer, isCopilot, isManager } = this.props

    return (
      <SettingsPanel
        title="My profile"
        user={user}
      >
        <ProfileSettingsFormEnhanced
          values={profileSettings}
          saveSettings={saveProfileSettings}
          uploadPhoto={uploadProfilePhoto}
          isCustomer={isCustomer}
          isCopilot={isCopilot}
          isManager={isManager}
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

const mapStateToProps = ({ settings, loadUser  }) => {
  const powerUserRoles = [ROLE_CONNECT_COPILOT, ROLE_CONNECT_MANAGER, ROLE_CONNECT_ACCOUNT_MANAGER, ROLE_CONNECT_COPILOT_MANAGER, ROLE_ADMINISTRATOR, ROLE_CONNECT_ADMIN]
  const managerRoles = [ROLE_ADMINISTRATOR, ROLE_CONNECT_ADMIN, ROLE_CONNECT_MANAGER]

  return ({
    profileSettings: {
      ...settings.profile,
      settings: formatProfileSettings(settings.profile.traits)
    },
    user: loadUser.user,
    isCustomer: _.intersection(loadUser.user.roles, powerUserRoles).length === 0,
    isManager: _.intersection(loadUser.user.roles, managerRoles).length === 0,
    isCopilot: _.some(loadUser.user.roles, role => role === ROLE_CONNECT_COPILOT)
  })
}

const mapDispatchToProps = {
  getProfileSettings,
  saveProfileSettings,
  uploadProfilePhoto,
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSettingsContainerWithAuth)
