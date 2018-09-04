/**
 * Notification settings form
 */
import React from 'react'
import PropTypes from 'prop-types'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const Formsy = FormsyForm.Formsy
import { NOTIFICATION_SETTINGS_PERIODS } from '../../../../../config/constants'
import SwitchButton from 'appirio-tech-react-components/components/SwitchButton/SwitchButton'
import Tooltip from 'appirio-tech-react-components/components/Tooltip/Tooltip'
import { TOOLTIP_DEFAULT_DELAY } from '../../../../../config/constants'
import BtnGroup from '../../../../../components/BtnGroup/BtnGroup'
import IconSettingsWeb from '../../../../../assets/icons/settings-icon-web.svg'
import IconSettingsEmail from '../../../../../assets/icons/settings-icon-mail.svg'
import './NotificationSettingsForm.scss'
import _ from 'lodash'


// list of the notification groups and related event types
// TODO move it to constants and reuse the same list in services/settings.js
const topics = [
  {
    title: 'New posts and replies',
    enabledMethods:['web', 'email'],
    types: [
      'notifications.connect.project.topic.created',
      'notifications.connect.project.topic.deleted',
      'notifications.connect.project.post.created',
      'notifications.connect.project.post.edited',
      'notifications.connect.project.post.deleted'
    ]
  }, {
    title: 'Project status changes',
    enabledMethods:['web'],
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
    title: 'Project specification changes',
    enabledMethods:['web'],
    types: [
      'notifications.connect.project.specificationModified'
    ]
  }, {
    title: 'File uploads',
    enabledMethods:['web'],
    types: [
      'notifications.connect.project.fileUploaded'
    ]
  }, {
    title: 'New project links',
    enabledMethods:['web'],
    types: [
      'notifications.connect.project.linkCreated'
    ]
  }, {
    title: 'Team changes',
    enabledMethods:['web'],
    types: [
      'notifications.connect.project.member.joined',
      'notifications.connect.project.member.left',
      'notifications.connect.project.member.removed',
      'notifications.connect.project.member.managerJoined',
      'notifications.connect.project.member.copilotJoined',
      'notifications.connect.project.member.assignedAsOwner'
    ]
  }, {
    title: 'Project plan changes',
    enabledMethods:['web'],
    types: [
      'notifications.connect.project.planReady',
      'notifications.connect.project.planModified'
    ]
  }, {
    title: 'Project phase updates',
    enabledMethods:['web'],
    types: [
      'notifications.connect.project.phase.transition.active',
      'notifications.connect.project.phase.transition.completed',
      'notifications.connect.project.phase.update.payment',
      'notifications.connect.project.phase.update.progress',
      'notifications.connect.project.phase.update.scope'
    ]
  }, {
    title: 'Project progress upates',
    enabledMethods:['web'],
    types: [
      'notifications.connect.project.phase.update.progress',
      'notifications.connect.project.progressModified'
    ]
  }, {
    title: 'Project phase timeline changes',
    enabledMethods:['web'],
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

  allTypes.forEach((type) => {
    if (!notifications[type]) {
      notifications[type] = {}
    }

    // check each of serviceId method separately as some can have
    // values and some don't have
    ['web', 'email'].forEach((serviceId) => {
      if (!notifications[type][serviceId]) {
        notifications[type][serviceId] = {}
      }
      if (_.isUndefined(notifications[type][serviceId].enabled)) {
        notifications[type][serviceId].enabled = 'yes'
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

    this.handleChange = this.handleChange.bind(this)
    this.handleBundleEmailChange = this.handleBundleEmailChange.bind(this)
  }

  handleChange(topicIndex, serviceId) {
    const notifications = {...this.state.settings.notifications}

    // update values for all types of the topic
    topics[topicIndex].types.forEach((type) => {
      notifications[type][serviceId].enabled = notifications[type][serviceId].enabled === 'yes' ? 'no' : 'yes'
    })

    this.setState({
      settings: {
        ...this.state.settings,
        notifications,
      }
    })
  }

  handleBundleEmailChange(bundlePeriod) {
    this.setState({
      settings: {
        ...this.state.settings,
        services: {
          ...this.state.settings.services,
          email: {
            ...this.state.settings.services.email,
            // this will be send to backend which uses null instead of 'immediately'
            bundlePeriod: bundlePeriod === 'immediately' ? null : bundlePeriod,
          }
        }
      }
    })
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
              <th>Notifications</th>
              <th><span className="th-with-icon">
                <IconSettingsWeb className="icon-settings-web"/>
                <span>Web</span></span></th>
              <th><span className="th-with-icon">
                <IconSettingsEmail />
                <span>Email</span></span></th>
            </tr>
          </thead>
          <tbody>
            {_.map(topics, (topic, index) => {
              // we toggle settings for all the types in one topic all together
              // so we can use values from the first type to get current value for the whole topic
              const topicFirstType = topic.types[0]
              const emailStatus = topic.enabledMethods.indexOf('email') < 0 ? 'disabled' : null
              const emailTooltip = topic.enabledMethods.indexOf('email') < 0 ? 'Emails are not yet supported for this event type' : null
              return (
                <tr key={index}>
                  <th>{topic.title}</th>
                  <td><SwitchButton onChange={() => this.handleChange(index, 'web')} defaultChecked={notifications[topicFirstType].web.enabled === 'yes'} /></td>
                  <td>
                    { !!emailTooltip &&
                      <Tooltip theme="light" tooltipDelay={TOOLTIP_DEFAULT_DELAY}>
                        <div className="tooltip-target">
                          <SwitchButton onChange={() => this.handleChange(index, 'email')} defaultChecked={notifications[topicFirstType].email.enabled === 'yes' && emailStatus===null} disabled={emailStatus}/>
                        </div>
                        <div className="tooltip-body">
                          {emailTooltip}
                        </div>
                      </Tooltip>
                    }
                    {
                      !emailTooltip && <SwitchButton onChange={() => this.handleChange(index, 'email')} defaultChecked={notifications[topicFirstType].email.enabled === 'yes' && emailStatus===null} disabled={emailStatus}/>
                    }
                  </td>
                </tr>
              )
            })}
            <tr>
              <td colSpan="3">
                <div className="bundle-emails">
                  <div className="th">Bundle emails (beta):</div>
                  <BtnGroup
                    items={NOTIFICATION_SETTINGS_PERIODS}
                    onChange={this.handleBundleEmailChange}
                    defaultValue={_.get(this.props.values, 'settings.services.email.bundlePeriod') || 'immediately'}
                  />
                </div>
              </td>
            </tr>
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
