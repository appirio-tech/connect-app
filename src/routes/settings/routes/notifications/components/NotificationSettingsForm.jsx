/**
 * Notification settings form
 */
import React from 'react'
import PropTypes from 'prop-types'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const Formsy = FormsyForm.Formsy
import { NOTIFICATION_SETTINGS_PERIODS } from '../../../../../config/constants'
import Tooltip from 'appirio-tech-react-components/components/Tooltip/Tooltip'
import { TOOLTIP_DEFAULT_DELAY, EVENT_TYPE } from '../../../../../config/constants'
import IconSettingsWeb from '../../../../../assets/icons/bell.svg'
import IconSettingsEmail from '../../../../../assets/icons/email.svg'
import './NotificationSettingsForm.scss'
import _ from 'lodash'
import SelectDropdown from '../../../../../components/SelectDropdown/SelectDropdown'
import SwitchButton from 'appirio-tech-react-components/components/SwitchButton/SwitchButton'


// list of the notification groups and related event types
// TODO move it to constants and reuse the same list in services/settings.js
const topics = [
  {
    title: 'New posts and replies',
    description: 'Get a notification any time somebody posts on your project. This will make sure you can stay up-to-date with what’s happening on your project',
    enabledMethods:['web', 'email'],
    types: [
      EVENT_TYPE.TOPIC.CREATED,
      EVENT_TYPE.TOPIC.DELETED,
      EVENT_TYPE.POST.CREATED,
      EVENT_TYPE.POST.UPDATED,
      EVENT_TYPE.POST.DELETED,
    ]
  }, {
    title: 'Project status',
    description: 'Receive a notification any time your project status changes',
    enabledMethods:['web', 'email'],
    types: [
      EVENT_TYPE.PROJECT.CREATED,
      EVENT_TYPE.PROJECT.CANCELED,
      EVENT_TYPE.PROJECT.APPROVED,
      EVENT_TYPE.PROJECT.PAUSED,
      EVENT_TYPE.PROJECT.COMPLETED,
      EVENT_TYPE.PROJECT.SUBMITTED_FOR_REVIEW,
      EVENT_TYPE.PROJECT.ACTIVE,
    ]
  }, {
    title: 'Project scope',
    description: 'Receive a notification any time your project scope is updated',
    enabledMethods:['web', 'email'],
    types: [
      EVENT_TYPE.PROJECT.SPECIFICATION_MODIFIED,
    ]
  }, {
    title: 'File uploads',
    description: 'Receive a notification any time a new file is uploaded to your project',
    enabledMethods:['web', 'email'],
    types: [
      EVENT_TYPE.PROJECT.FILE_UPLOADED,
    ]
  }, {
    title: 'New project link',
    description: 'Receive a notification any time a new link is added to your project',
    enabledMethods:['web', 'email'],
    types: [
      EVENT_TYPE.PROJECT.LINK_CREATED,
    ]
  }, {
    title: 'Project team',
    description: 'Receive a notification any time a person joins or leaves the team',
    enabledMethods:['web', 'email'],
    types: [
      EVENT_TYPE.MEMBER.JOINED,
      EVENT_TYPE.MEMBER.LEFT,
      EVENT_TYPE.MEMBER.REMOVED,
      EVENT_TYPE.MEMBER.MANAGER_JOINED,
      EVENT_TYPE.MEMBER.COPILOT_JOINED,
      EVENT_TYPE.MEMBER.ASSIGNED_AS_OWNER,
    ]
  }, {
    title: 'Project plan',
    description: 'Receive a notification when a phase is added to your project plan',
    enabledMethods:['web', 'email'],
    types: [
      EVENT_TYPE.PROJECT_PLAN.READY,
      EVENT_TYPE.PROJECT_PLAN.MODIFIED,
    ]
  }, {
    title: 'Project phase updates',
    description: 'Receive a notification for any activity on your project phase',
    enabledMethods:['web', 'email'],
    types: [
      EVENT_TYPE.PROJECT_PLAN.PHASE_ACTIVATED,
      EVENT_TYPE.PROJECT_PLAN.PHASE_COMPLETED,
      EVENT_TYPE.PROJECT_PLAN.PHASE_PAYMENT_UPDATED,
      EVENT_TYPE.PROJECT_PLAN.PHASE_PROGRESS_UPDATED,
      EVENT_TYPE.PROJECT_PLAN.PHASE_SCOPE_UPDATED,
      EVENT_TYPE.PROJECT_PLAN.PHASE_PRODUCT_SPEC_UPDATED,
      EVENT_TYPE.PROJECT_PLAN.MILESTONE_ACTIVATED,
      EVENT_TYPE.PROJECT_PLAN.MILESTONE_COMPLETED,
      // should we include wait.customer to be controlled via settings?
      EVENT_TYPE.PROJECT_PLAN.WAITING_FOR_CUSTOMER_INPUT,
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
        // for messaging related email notifications, by default bundle period is set to 'immediately'
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

    const initialSettings = initSettings(props.values.settings)

    this.state = {
      initialSettings,
      settings: initialSettings,
      dirty: false,
    }

    this.handleEmailConfigurationChange = this.handleEmailConfigurationChange.bind(this)
    this.handleWebConfigurationChange = this.handleWebConfigurationChange.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  componentWillReceiveProps(newProps) {
    // after setting were updated on the server
    // reinit form with updated values
    if (this.props.values.pending && !newProps.values.pending) {
      const initialSettings = initSettings(newProps.values.settings)
      this.setState({
        initialSettings,
        settings: initialSettings,
        dirty: false,
      })
    }
  }

  handleEmailConfigurationChange(selectedOption, topicIndex) {
    const notifications = {...this.state.settings.notifications}
    // update values for all types of the topic
    topics[topicIndex].types.forEach((type) => {
      notifications[type] = {
        ...notifications[type],
        email: {
          ...notifications[type].email,
          enabled: selectedOption.value === 'off' ? 'no' : 'yes',
          bundlePeriod: selectedOption.value === 'off' ? '' : selectedOption.value
        }
      }
    })

    this.setState({
      settings: {
        ...this.state.settings,
        notifications,
      }
    }, this.onChange)
  }

  stopPropagation(e) {
    e.preventDefault()
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
  }

  handleWebConfigurationChange(topicIndex) {
    const notifications = {...this.state.settings.notifications}

    // update values for all types of the topic
    topics[topicIndex].types.forEach((type) => {
      notifications[type] = {
        ...notifications[type],
        web: {
          ...notifications[type].web,
          enabled: notifications[type].web.enabled === 'yes' ? 'no' : 'yes'
        }
      }
    })

    this.setState({
      settings: {
        ...this.state.settings,
        notifications,
      }
    }, this.onChange)
  }

  isChanged() {
    return !_.isEqual(this.state.initialSettings, this.state.settings)
  }

  onChange() {
    const isChanged = this.isChanged()

    if (this.state.dirty !== isChanged) {
      this.setState({ dirty: isChanged })
    }
  }

  render() {
    const { isCustomer } = this.props
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
                    {isCustomer ? (
                      <label className="checkbox-ctrl">
                        <input
                          defaultChecked={notifications[topicFirstType].web.enabled === 'yes'}
                          type="checkbox"
                          readOnly
                          className="checkbox"
                          onClick={(e) => this.stopPropagation(e)}
                        />
                        <span className="checkbox-text" />
                      </label>
                    ) : (
                      <SwitchButton                       
                        onChange={() => this.handleWebConfigurationChange(index)}
                        name={`web[${index}]`}
                        checked={notifications[topicFirstType].web.enabled === 'yes'}
                      />
                    )}
                  </td>
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
          <button type="submit" className="tc-btn tc-btn-primary" disabled={this.props.values.pending || !this.state.dirty}>Save settings</button>
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
