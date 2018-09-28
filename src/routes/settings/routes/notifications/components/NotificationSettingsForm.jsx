/**
 * Notification settings form
 */
import React from 'react'
import PropTypes from 'prop-types'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const Formsy = FormsyForm.Formsy
import { NOTIFICATION_SETTINGS_PERIODS } from '../../../../../config/constants'
import Tooltip from 'appirio-tech-react-components/components/Tooltip/Tooltip'
import { TOOLTIP_DEFAULT_DELAY } from '../../../../../config/constants'
import IconSettingsWeb from '../../../../../assets/icons/bell.svg'
import IconSettingsEmail from '../../../../../assets/icons/email.svg'
import './NotificationSettingsForm.scss'
import _ from 'lodash'
import SelectDropdown from '../../../../../components/SelectDropdown/SelectDropdown'


// list of the notification groups and related event types
// TODO move it to constants and reuse the same list in services/settings.js
const topics = [
  {
    title: 'New posts and replies',
    description: 'Get a notification any time somebody posts on your project. This will make sure you can stay up-to-date with what’s happening on your project',
    enabledMethods:['web', 'email'],
    types: [
      'notifications.connect.project.topic.created',
      'notifications.connect.project.topic.deleted',
      'notifications.connect.project.post.created',
      'notifications.connect.project.post.edited',
      'notifications.connect.project.post.deleted'
    ]
  }, {
    title: 'Project status',
    description: 'Receive a notification any time your porject status changes',
    enabledMethods:['web', 'email'],
    types: [
      'notifications.connect.project.created',
      'notifications.connect.project.updated',
      'notifications.connect.project.canceled',
      'notifications.connect.project.approved',
      'notifications.connect.project.paused',
      'notifications.connect.project.completed',
      'notifications.connect.project.submittedForReview',
      'notifications.connect.project.active'
    ]
  }, {
    title: 'Project scope',
    description: 'Receive a notification any time your project scope is updated',
    enabledMethods:['web', 'email'],
    types: [
      'notifications.connect.project.specificationModified'
    ]
  }, {
    title: 'File uploads',
    description: 'Receive a notification any time a new file is uploaded to your project',
    enabledMethods:['web', 'email'],
    types: [
      'notifications.connect.project.fileUploaded'
    ]
  }, {
    title: 'New project link',
    description: 'Receive a notification any time a new link is added to your project',
    enabledMethods:['web', 'email'],
    types: [
      'notifications.connect.project.linkCreated'
    ]
  }, {
    title: 'Project team',
    description: 'Receive a notification any time a person joins or leaves the team',
    enabledMethods:['web', 'email'],
    types: [
      'notifications.connect.project.member.joined',
      'notifications.connect.project.member.left',
      'notifications.connect.project.member.removed',
      'notifications.connect.project.member.managerJoined',
      'notifications.connect.project.member.copilotJoined',
      'notifications.connect.project.member.assignedAsOwner'
    ]
  }, {
    title: 'Project plan',
    description: 'Receive a notification when a phase is added to your project plan',
    enabledMethods:['web', 'email'],
    types: [
      'notifications.connect.project.planReady',
      'notifications.connect.project.planModified'
    ]
  }, {
    title: 'Project phase updates',
    description: 'Receive a notification for any activity on your project phase',
    enabledMethods:['web', 'email'],
    types: [
      'notifications.connect.project.phase.transition.active',
      'notifications.connect.project.phase.transition.completed',
      'notifications.connect.project.phase.update.payment',
      'notifications.connect.project.phase.update.progress',
      'notifications.connect.project.phase.update.scope'
    ]
  }, {
    title: 'Project progress updates',
    enabledMethods:['web', 'email'],
    types: [
      'notifications.connect.project.phase.update.progress',
      'notifications.connect.project.progressModified'
    ]
  }, {
    title: 'Project phase timeline changes',
    enabledMethods:['web', 'email'],
    types: [
      'notifications.connect.project.phase.timelineModified',
      'notifications.connect.project.phase.milestone.transition.active',
      'notifications.connect.project.phase.milestone.transition.completed',
      // should we include wait.customer to be controlled via settings?
      'notifications.connect.project.phase.milestone.waiting.customer'
    ]
  }
]

/**
 * Initialize settings
 *
 *  as settings are not initialized by default on the server
 *  we probably get values not for all settings
 *  so we initialize them first
 *  by default we treat settings ENABLED
 *
 * @param  {Object} settings not initialized
 *
 * @return {Object}          initialized settings
 */
const initSettings = (notInitedSettings) => {
  const settings = {...notInitedSettings}
  const notifications = {...settings.notifications}
  const allTypes = _.flatten(_.map(topics, 'types'))
  const messagingNotifications = topics[0]
  // notification types for messaging events
  const messagingTypes = messagingNotifications.types

  allTypes.forEach((type) => {
    if (!notifications[type]) {
      notifications[type] = {}
    }

    // check each of serviceId method separately as some can have
    // values and some don't have
    ['web', 'email', 'emailBundling'].forEach((serviceId) => {
      if (!notifications[type][serviceId]) {
        notifications[type][serviceId] = {}
      }

      if (_.isUndefined(notifications[type][serviceId].enabled)) {
        notifications[type][serviceId].enabled = 'yes'
      }

      if (_.isUndefined(notifications[type][serviceId].bundlePeriod)) {
        // for messageing related email notifications, by default bundle period is set to 'immediately'
        if (serviceId === 'email' && _.includes(messagingTypes, type)) {
          notifications[type][serviceId].bundlePeriod = 'immediately'

        // for the rest of notifications by default bundle period is set to 'daily'
        } else {
          notifications[type][serviceId].bundlePeriod = 'daily'
        }
      }
    })
  })

  settings.notifications = notifications

  return settings
}

class NotificationSettingsForm extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      settings: initSettings(props.values.settings)
    }

    this.handleEmailConfigurationChange = this.handleEmailConfigurationChange.bind(this)
  }

  handleEmailConfigurationChange(selectedOption, topicIndex) {
    const notifications = {...this.state.settings.notifications}
    // update values for all types of the topic
    topics[topicIndex].types.forEach((type) => {
      notifications[type].email.enabled = selectedOption.value === 'off' ? 'no' : 'yes'
      notifications[type].email.bundlePeriod = selectedOption.value === 'off' ? '' : selectedOption.value
    })

    this.setState({
      settings: {
        ...this.state.settings,
        notifications,
      }
    })
  }

  stopPropagation(e) {
    e.preventDefault()
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
  }

  render() {
    const areSettingsProvided = !!this.props.values.settings
    const settings = this.state.settings
    const notifications = settings.notifications

    // if settings weren't provided (not loaded) don't render anything
    if (!areSettingsProvided) {
      return null
    }

    return (
      <Formsy.Form
        className="notification-settings-form"
        onValidSubmit={() => this.props.onSubmit(this.state.settings)}
      >
        <table className="table">
          <thead>
            <tr>
              <th>Project notifications</th>
              <th><span className="th-with-icon">
                <IconSettingsWeb className="icon-settings-web"/>
                <span className="title">Website</span></span></th>
              <th><span className="th-with-icon">
                <IconSettingsEmail />
                <span className="title">As Email</span></span></th>
            </tr>
          </thead>
          <tbody>
            {_.map(topics, (topic, index) => {
              // we toggle settings for all the types in one topic all together
              // so we can use values from the first type to get current value for the whole topic
              const topicFirstType = topic.types[0]
              const emailTooltip = topic.enabledMethods.indexOf('email') < 0 ? 'Emails are not yet supported for this event type' : null
              const emailEnabled = notifications[topicFirstType].email.enabled === 'yes'
              const emailBundlePeriod = notifications[topicFirstType].email.bundlePeriod
              const selectedOption = emailEnabled ? emailBundlePeriod : 'off'
              return [
                <tr key={index}>
                  <th>
                    {topic.title}
                    <div className="description_desktop">
                      {topic.description}
                    </div>
                  </th>
                  <td>
                    <label className="checkbox-ctrl">
                      <input
                        defaultChecked={notifications[topicFirstType].web.enabled === 'yes'}
                        type="checkbox"
                        readOnly
                        className="checkbox"
                        onClick={(e) => this.stopPropagation(e)}
                      />
                      <span className="checkbox-text" />
                    </label></td>
                  <td>
                    { !!emailTooltip &&
                      <Tooltip theme="light" tooltipDelay={TOOLTIP_DEFAULT_DELAY}>
                        <div className="tooltip-target">
                          <SelectDropdown
                            name="status"
                            value={selectedOption}
                            theme="default"
                            options={NOTIFICATION_SETTINGS_PERIODS.map(val => ({ value: val.value, title: val.text}))}
                            onSelect={(selected) => this.handleEmailConfigurationChange(selected, index)}
                          />
                        </div>
                        <div className="tooltip-body">
                          {emailTooltip}
                        </div>
                      </Tooltip>
                    }
                    {
                      !emailTooltip &&
                      <SelectDropdown
                        name="status"
                        value={selectedOption}
                        theme="default"
                        options={NOTIFICATION_SETTINGS_PERIODS.map(val => ({ value: val.value, title: val.text}))}
                        onSelect={(selected) => this.handleEmailConfigurationChange(selected, index)}
                      />
                    }
                  </td>
                </tr>,
                <tr className="description_mobile">
                  <td colSpan="3">
                    {topic.description}
                  </td>
                </tr>
              ]
            })}
          </tbody>
        </table>

        <div className="controls">
          <button type="submit" className="tc-btn tc-btn-primary" disabled={this.props.values.pending}>Save settings</button>
        </div>
      </Formsy.Form>
    )
  }
}

NotificationSettingsForm.propTypes = {
  values: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default NotificationSettingsForm
