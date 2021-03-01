/**
 * Container for system settings
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import spinnerWhileLoading from '../../../../../components/LoadingSpinner'
import SettingsPanel from '../../../components/SettingsPanel'
import { checkEmailAvailability, changeEmail, changePassword, getSystemSettings, resetPassword } from '../../../actions'
import { getUserCredential } from '../../../../../actions/loadUser'
import { requiresAuthentication } from '../../../../../components/AuthenticatedComponent'
import SystemSettingsForm from '../components/SystemSettingsForm'
import './SystemSettingsContainer.scss'

const enhance = spinnerWhileLoading(props => !props.systemSettings.isLoading)
const FormEnhanced = enhance(SystemSettingsForm)

class SystemSettingsContainer extends Component {
  componentDidMount() {
    const {
      getSystemSettings,
      getUserCredential,
      user
    } = this.props
    getSystemSettings()
    getUserCredential(user.userId)
  }

  render() {
    return (
      <SettingsPanel
        title="Account and security"
        user={this.props.user}
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

const mapStateToProps = ({ settings, loadUser }) => ({
  systemSettings: settings.system,
  user: loadUser.user,
  usingSsoService: _.get(loadUser, 'credential.hasPassword', false) === false,
})

const mapDispatchToProps = {
  getSystemSettings,
  getUserCredential, 
  checkEmailAvailability,
  changeEmail,
  changePassword,
  resetPassword,
}

export default connect(mapStateToProps, mapDispatchToProps)(SystemSettingsContainerWithAuth)
