/**
 * Container for system settings
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import  _ from 'lodash'
import { connect } from 'react-redux'
import spinnerWhileLoading from '../../../../../components/LoadingSpinner'
import SettingsPanel from '../../../components/SettingsPanel'
import { checkEmailAvailability, changeEmail, changePassword, getSystemSettings, resetPassword } from '../../../actions'
import { requiresAuthentication } from '../../../../../components/AuthenticatedComponent'
import SystemSettingsForm from '../components/SystemSettingsForm'
import { ROLE_CONNECT_COPILOT, ROLE_CONNECT_MANAGER, ROLE_CONNECT_ACCOUNT_MANAGER, ROLE_CONNECT_COPILOT_MANAGER, ROLE_ADMINISTRATOR, ROLE_CONNECT_ADMIN } from '../../../../../config/constants'
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

const mapStateToProps = ({ settings, loadUser }) => {
  const powerUserRoles = [ROLE_CONNECT_COPILOT, ROLE_CONNECT_MANAGER, ROLE_CONNECT_ACCOUNT_MANAGER, ROLE_CONNECT_COPILOT_MANAGER, ROLE_ADMINISTRATOR, ROLE_CONNECT_ADMIN]
  
  return {
    systemSettings: settings.system,
    isCustomer: _.intersection(loadUser.user.roles, powerUserRoles).length === 0
  }
}

const mapDispatchToProps = {
  getSystemSettings,
  checkEmailAvailability,
  changeEmail,
  changePassword,
  resetPassword,
}

export default connect(mapStateToProps, mapDispatchToProps)(SystemSettingsContainerWithAuth)
