/**
 * Container for notification settings
 */
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import NotificationSettingsForm from '../components/NotificationSettingsForm'
import SettingsPanel from '../../../components/SettingsPanel'
import { requiresAuthentication } from '../../../../../components/AuthenticatedComponent'

const NotificationSettingsContainer = (props) => {
  const { notificationSettings } = props

  return (
    <SettingsPanel
      title="Notifications"
      text="Answer just a few questions about your application.
        You can also provide the needed information in a supporting document—upload it below or add a link in the notes section."
      isWide
    >
      <NotificationSettingsForm values={notificationSettings} />
    </SettingsPanel>
  )
}

NotificationSettingsContainer.propTypes = {
  notificationSettings: PropTypes.object.isRequired
}

const NotificationSettingsContainerWithAuth = requiresAuthentication(NotificationSettingsContainer)

const mapStateToProps = ({ settings }) => ({
  notificationSettings: settings.notifications
})

export default connect(mapStateToProps)(NotificationSettingsContainerWithAuth)
