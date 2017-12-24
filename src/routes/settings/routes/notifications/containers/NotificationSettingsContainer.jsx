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
        link={{
          to: 'https://www.topcoder.com/settings/email/',
          text: 'Manage email settings'
        }}
        text="Notifications are a great way to get back to what matters. Somethimes things can be a bit overwhelming, we get it, so here you can turn off the things that bugg you. You can always turn them back on later. To modify your email notifications please follow: "
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
