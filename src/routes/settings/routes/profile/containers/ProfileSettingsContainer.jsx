/**
 * Container for profile settings
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ProfileSettingsForm from '../components/ProfileSettingsForm'
import SettingsPanel from '../../../components/SettingsPanel'
import { requiresAuthentication } from '../../../../../components/AuthenticatedComponent'

const ProfileSettingsContainer = (props) => {
  const { profileSettings } = props

  return (
    <SettingsPanel
      title="Profile"
      text="Answer just a few questions about your application.
        You can also provide the needed information in a supporting document—upload it below or add a link in the notes section."
    >
      <ProfileSettingsForm {...profileSettings} />
    </SettingsPanel>
  )
}

ProfileSettingsContainer.propTypes = {
  profileSettings: PropTypes.object.isRequired
}

const ProfileSettingsContainerWithAuth = requiresAuthentication(ProfileSettingsContainer)

const mapStateToProps = ({ settings }) => ({
  profileSettings: settings.profile
})

export default connect(mapStateToProps)(ProfileSettingsContainerWithAuth)
