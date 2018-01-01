/**
 * Container for notification settings
 */
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import NotificationSettingsForm from '../components/NotificationSettingsForm'
import SettingsPanel from '../../../components/SettingsPanel'
import { requiresAuthentication } from '../../../../../components/AuthenticatedComponent'
import { getNotificationSettings, saveNotificationSettings } from '../../../actions'
import spinnerWhileLoading from '../../../../../components/LoadingSpinner'

// show loader instead of form when settings are being loaded
const enhance = spinnerWhileLoading(props => !props.values.isLoading)
const NotificationSettingsFormWithLoader = enhance(NotificationSettingsForm)

class NotificationSettingsContainer extends React.Component {
  componentDidMount() {
    this.props.getNotificationSettings()
  }

  render() {
    const { notificationSettings, saveNotificationSettings } = this.props

    return (
      <SettingsPanel
        title="Notifications"
        text="Answer just a few questions about your application.
          You can also provide the needed information in a supporting document—upload it below or add a link in the notes section."
        isWide
      >
        <NotificationSettingsFormWithLoader values={notificationSettings} onSubmit={saveNotificationSettings} />
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

const mapStateToProps = ({ settings }) => ({
  notificationSettings: settings.notifications
})

const mapDispatchToProps = {
  getNotificationSettings,
  saveNotificationSettings
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationSettingsContainerWithAuth)
