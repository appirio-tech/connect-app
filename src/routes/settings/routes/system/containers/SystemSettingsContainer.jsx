/**
 * Container for system settings
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import spinnerWhileLoading from '../../../../../components/LoadingSpinner'
import SettingsPanel from '../../../components/SettingsPanel'
import { checkEmailAvailability, changeEmail, changePassword, getSystemSettings, resetPassword } from '../../../actions'
import { requiresAuthentication } from '../../../../../components/AuthenticatedComponent'
import SystemSettingsForm from '../components/SystemSettingsForm'
import './SystemSettingsContainer.scss'

const enhance = spinnerWhileLoading(props => !props.systemSettings.isLoading)
const FormEnhanced = enhance(SystemSettingsForm)

class SystemSettingsContainer extends Component {
  componentDidMount() {
    this.props.getSystemSettings()
  }

  render() {
    return (
      <SettingsPanel
        title="Account and security"
      >
        <FormEnhanced
          {...this.props}
        />
      </SettingsPanel>
    )
  }
}

SystemSettingsContainer.propTypes = {
  systemSettings: PropTypes.object.isRequired
}

const SystemSettingsContainerWithAuth = requiresAuthentication(SystemSettingsContainer)

const mapStateToProps = ({ settings }) => ({
  systemSettings: settings.system
})

const mapDispatchToProps = {
  getSystemSettings,
  checkEmailAvailability,
  changeEmail,
  changePassword,
  resetPassword,
}

export default connect(mapStateToProps, mapDispatchToProps)(SystemSettingsContainerWithAuth)
