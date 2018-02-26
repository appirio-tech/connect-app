/**
 * Notification settings form
 */
import React from 'react'
import PropTypes from 'prop-types'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const Formsy = FormsyForm.Formsy
import SwitchButton from 'appirio-tech-react-components/components/SwitchButton/SwitchButton'
import BtnGroup from '../../../../../components/BtnGroup/BtnGroup'
import IconSettingsWeb from '../../../../../assets/icons/settings-icon-web.svg'
import './NotificationSettingsForm.scss'
import _ from 'lodash'


// list of the notification groups and related event types
// TODO move it to constants and reuse the same list in services/settings.js
const topics = [
  {
    title: 'New posts and replies',
    types: [
      'notifications.connect.project.topic.created',
      'notifications.connect.project.topic.deleted',
      'notifications.connect.project.post.created',
      'notifications.connect.project.post.edited',
      'notifications.connect.project.post.deleted'
    ]
  }, {
    title: 'Project status changes',
    types: [
      'notifications.connect.project.created',
      'notifications.connect.project.updated',
      'notifications.connect.project.canceled',
      'notifications.connect.project.approved',
      'notifications.connect.project.paused',
      'notifications.connect.project.completed',
      'notifications.connect.project.submittedForReview'
    ]
  }, {
    title: 'Project specification changes',
    types: [
      'notifications.connect.project.specificationModified'
    ]
  }, {
    title: 'File uploads',
    types: [
      'notifications.connect.project.fileUploaded'
    ]
  }, {
    title: 'New project links',
    types: [
      'notifications.connect.project.linkCreated'
    ]
  }, {
    title: 'Team changes',
    types: [
      'notifications.connect.project.member.joined',
      'notifications.connect.project.member.left',
      'notifications.connect.project.member.removed',
      'notifications.connect.project.member.managerJoined',
      'notifications.connect.project.member.copilotJoined',
      'notifications.connect.project.member.assignedAsOwner'
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
  const allTypes = _.flatten(_.map(topics, 'types'))

  allTypes.forEach((type) => {
    if (!settings[type]) {
      settings[type] = {}
    }

    // check each of deliveryMethod method separately as some can have
    // values and some don't have
    ['web', 'email'].forEach((deliveryMethod) => {
      if (_.isUndefined(settings[type][deliveryMethod])) {
        settings[type][deliveryMethod] = 'yes'
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

  handleChange(topicIndex, deliveryMethod) {
    const s = {
      settings: {
        ...this.state.settings
      }
    }

    // update values for all types of the topic
    topics[topicIndex].types.forEach((type) => {
      s.settings[type][deliveryMethod] = s.settings[type][deliveryMethod] === 'yes' ? 'no' : 'yes'
    })

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
              <th><span className="th-with-icon">
                <IconSettingsWeb className="icon-settings-web"/>
                <span>Web</span></span></th>
              {/* as email notification currently not supported, hide them for now */}
              {/*<th><span className="th-with-icon"><img src={iconMail} /><span>Email</span></span></th>*/}
            </tr>
          </thead>
          <tbody>
            {_.map(topics, (topic, index) => {
              // we toggle settings for all the types in one topic all together
              // so we can use values from the first type to get current value for the whole topic
              const topicFirstType = topic.types[0]
              return (
                <tr key={index}>
                  <th>{topic.title}</th>
                  <td><SwitchButton onChange={() => this.handleChange(index, 'web')} defaultChecked={settings[topicFirstType] && settings[topicFirstType].web === 'yes'} /></td>
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
