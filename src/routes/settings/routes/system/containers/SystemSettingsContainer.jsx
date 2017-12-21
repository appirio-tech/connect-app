/**
 * Container for system settings
 */
import React, { PropTypes } from 'react'

import { connect } from 'react-redux'
import SettingsPanel from '../../../components/SettingsPanel'
import ChangeEmailForm from '../components/ChangeEmailForm'
import ChangePasswordForm from '../components/ChangePasswordForm'
import { checkEmailAvailability, changeEmail, changePassword } from '../../../actions'
import { requiresAuthentication } from '../../../../../components/AuthenticatedComponent'
import './SystemSettingsContainer.scss'

const SystemSettingsContainer = (props) => {
  const { systemSettings, checkEmailAvailability, changeEmail, changePassword } = props

  return (
    <SettingsPanel
      title="System"
      text="Answer just a few questions about your application.
        You can also provide the needed information in a supporting document—upload it below or add a link in the notes section."
    >
      <div className="system-settings-container">
        <div className="form">
          <ChangePasswordForm
            onSubmit={(data) => changePassword(data.password)}
            {...systemSettings}
          />
        </div>

        <div className="form">
          <ChangeEmailForm
            checkEmailAvailability={checkEmailAvailability}
            onSubmit={(data) => changeEmail(data.email)}
            {...systemSettings}
          />
        </div>

        <div className="controls">
          <button className="tc-btn tc-btn-primary">Save settings</button>
        </div>
      </div>
    </SettingsPanel>
  )
}

SystemSettingsContainer.propTypes = {
  systemSettings: PropTypes.object.isRequired
}

const SystemSettingsContainerWithAuth = requiresAuthentication(SystemSettingsContainer)

const mapStateToProps = ({ settings }) => ({
  systemSettings: settings.system
})

const mapDispatchToProps = {
  checkEmailAvailability,
  changeEmail,
  changePassword
}

export default connect(mapStateToProps, mapDispatchToProps)(SystemSettingsContainerWithAuth)
