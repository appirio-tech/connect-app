/**
 * Container for notification settings
 */
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import NotificationSettingsForm from '../components/NotificationSettingsForm'
import SettingsPanel from '../../../components/SettingsPanel'
import { requiresAuthentication } from '../../../../../components/AuthenticatedComponent'
import { getNotificationSettings, saveNotificationSettings } from '../../../actions'

const NotificationSettingsContainer = (props) => {
  const { notificationSettings, getNotificationSettings, saveNotificationSettings } = props

  return (
    <SettingsPanel
      title="Notifications"
      text="Answer just a few questions about your application.
        You can also provide the needed information in a supporting document—upload it below or add a link in the notes section."
      isWide
    >
      <NotificationSettingsForm values={notificationSettings} onInit={getNotificationSettings} onSubmit={saveNotificationSettings} />
    </SettingsPanel>
  )
}

NotificationSettingsContainer.propTypes = {
  notificationSettings: PropTypes.object.isRequired,
  getNotificationSettings: PropTypes.func.isRequired,
  saveNotificationSettings: PropTypes.func.isRequired
}

const NotificationSettingsContainerWithAuth = requiresAuthentication(NotificationSettingsContainer)

const mapStateToProps = ({ settings }) => ({
  notificationSettings: settings.notifications
})

const mapDispatchToProps = {
  getNotificationSettings,
  saveNotificationSettings
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationSettingsContainerWithAuth)
