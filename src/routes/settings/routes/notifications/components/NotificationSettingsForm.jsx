/**
 * Notification settings form
 */
import React, { PropTypes } from 'react'
import { Formsy, SwitchButton } from 'appirio-tech-react-components'
import BtnGroup from '../../../../../components/BtnGroup/BtnGroup'
import iconWeb from '../../../../../assets/images/icon-web.png'
import './NotificationSettingsForm.scss'
import _ from 'lodash'

// TODO move this list to constants together with the same list in service/settings.js
const topics = [
  'notifications.connect.project.created',
  'notifications.connect.project.updated',
  'notifications.connect.project.canceled',
  'notifications.connect.project.approved',
  'notifications.connect.project.paused',
  'notifications.connect.project.completed',
  'notifications.connect.project.submittedForReview',

  'notifications.connect.project.fileUploaded',
  'notifications.connect.project.specificationModified',
  'notifications.connect.project.linkCreated',

  'notifications.connect.project.member.joined',
  'notifications.connect.project.member.left',
  'notifications.connect.project.member.removed',
  'notifications.connect.project.member.managerJoined',
  'notifications.connect.project.member.copilotJoined',
  'notifications.connect.project.member.assignedAsOwner',

  'notifications.connect.project.topic.created',
  'notifications.connect.project.topic.deleted',
  'notifications.connect.project.post.created',
  'notifications.connect.project.post.edited',
  'notifications.connect.project.post.deleted'
]

// TODO put these values to one list with `topics`
const titles = [
  'Project Created',
  'Project Updated',
  'Project Canceled',
  'Project Approved',
  'Project Paused',
  'Project Completed',
  'Project Submitted For Review',

  'Project File uploaded',
  'Project Specification modified',
  'Project link added',

  'Project member joined',
  'Project member left',
  'Project member removed',
  'Project manager joined',
  'Project copilot joined',
  'Project member assigned as owner',

  'Project topic created',
  'Project topic deleted',
  'Project post created',
  'Project post edited',
  'Project post deleted'
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

  topics.forEach((topic) => {
    if (!settings[topic]) {
      settings[topic] = {}
    }

    // check each of deliveryMethod method separately as some can have
    // values and some don't have
    ['web', 'email'].forEach((deliveryMethod) => {
      if (_.isUndefined(settings[topic][deliveryMethod])) {
        settings[topic][deliveryMethod] = 'yes'
      }
    })
  })

  return settings
}

class NotificationSettingsForm extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      settings: initSettings(props.values.settings)
    }

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(topic, deliveryMethod) {
    const s = {
      settings: {
        ...this.state.settings
      }
    }
    s.settings[topic][deliveryMethod] = s.settings[topic][deliveryMethod] === 'yes' ? 'no' : 'yes'

    this.setState(s)
  }

  render() {
    const areSettingsProvided = !!this.props.values.settings
    const settings = this.state.settings

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
              <th><span className="th-with-icon"><img src={iconWeb} /><span>Web</span></span></th>
              {/* as email notification currently not supported, hide them for now */}
              {/*<th><span className="th-with-icon"><img src={iconMail} /><span>Email</span></span></th>*/}
            </tr>
          </thead>
          <tbody>
            {_.map(topics, (topic, index) => {
              const title = titles[index]
              return (
                <tr key={topic}>
                  <th>{title}</th>
                  <td><SwitchButton onChange={() => this.handleChange(topic, 'web')} defaultChecked={settings[topic] && settings[topic].web === 'yes'} /></td>
                  {/* as email notification currently not supported, hide them for now */}
                  {/*<td><SwitchButton onChange={() => this.handleChange(topic, 'email')} defaultChecked={settings[topic] && settings[topic].email === 'yes'} /></td>*/}
                </tr>
              )
            })}

            { false && <tr>
              <td colSpan="3">
                <div className="bundle-emails">
                  <div className="th">Bundle emails:</div>
                  <BtnGroup
                    items={[
                      { text: 'Send as they happen', value: 'immediately' },
                      { text: 'Every hour', value: 'hourly' },
                      { text: 'Every 12h.', value: '12h' },
                      { text: 'Every 24h.', value: '24h' }
                    ]}
                    defaultValue={this.props.values.bundleEmail}
                  />
                </div>
              </td>
              </tr>
            }
          </tbody>
        </table>

        <div className="email-settings">
          <a href="https://www.topcoder.com/settings/email/">Manage email settings</a>
        </div>

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
