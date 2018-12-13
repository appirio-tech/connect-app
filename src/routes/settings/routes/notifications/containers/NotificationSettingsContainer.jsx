/**
 * Container for notification settings
 */
import React from 'react'
import PropTypes from 'prop-types'
import  _ from 'lodash'
import { connect } from 'react-redux'
import NotificationSettingsForm from '../components/NotificationSettingsForm'
import SettingsPanel from '../../../components/SettingsPanel'
import { requiresAuthentication } from '../../../../../components/AuthenticatedComponent'
import { getNotificationSettings, saveNotificationSettings } from '../../../actions'
import spinnerWhileLoading from '../../../../../components/LoadingSpinner'
import { ROLE_CONNECT_COPILOT, ROLE_CONNECT_MANAGER, ROLE_ADMINISTRATOR, ROLE_CONNECT_ADMIN } from '../../../../../config/constants'

// show loader instead of form when settings are being loaded
const enhance = spinnerWhileLoading(props => !props.values.isLoading)
const NotificationSettingsFormWithLoader = enhance(NotificationSettingsForm)

class NotificationSettingsContainer extends React.Component {
  componentDidMount() {
    this.props.getNotificationSettings()
  }

  render() {
    const { notificationSettings, saveNotificationSettings, isCustomer } = this.props

    return (
      <SettingsPanel
        title="Notifications"
        isWide
      >
        <NotificationSettingsFormWithLoader 
          values={notificationSettings} 
          onSubmit={saveNotificationSettings} 
          isCustomer={isCustomer} 
        />
      </SettingsPanel>
    )
  }
}

NotificationSettingsContainer.propTypes = {
  notificationSettings: PropTypes.object.isRequired,
  getNotificationSettings: PropTypes.func.isRequired,
  saveNotificationSettings: PropTypes.func.isRequired
}

const NotificationSettingsContainerWithAuth = requiresAuthentication(NotificationSettingsContainer)

const mapStateToProps = ({ settings, loadUser }) => {
  const powerUserRoles = [ROLE_CONNECT_COPILOT, ROLE_CONNECT_MANAGER, ROLE_ADMINISTRATOR, ROLE_CONNECT_ADMIN]
  
  return {
    notificationSettings: settings.notifications,
    isCustomer: _.intersection(loadUser.user.roles, powerUserRoles).length === 0
  }
}

const mapDispatchToProps = {
  getNotificationSettings,
  saveNotificationSettings
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationSettingsContainerWithAuth)
