/**
 * Notification settings form
 */
import React, { PropTypes } from 'react'
import { Formsy, SwitchButton } from 'appirio-tech-react-components'
import BtnGroup from '../../../../../components/BtnGroup/BtnGroup'
import iconWeb from '../../../../../assets/images/icon-web.png'
import iconMail from '../../../../../assets/images/icon-mail.png'
import './NotificationSettingsForm.scss'
import _ from 'lodash'

class NotificationSettingsForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      settings: props.values.settings || {}
    }

    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.props.onInit()
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      settings: nextProps.values.settings || {}
    })
  }

  handleChange(topic, deliveryMethod) {
    const s = {
      settings: {
        ...this.state.settings
      }
    }
    if (!s.settings[topic]) {
      s.settings[topic] = {}
    }
    s.settings[topic][deliveryMethod] = s.settings[topic][deliveryMethod] === 'yes' ? 'no' : 'yes'

    this.setState(s)
  }

  render() {
    const settings = this.state.settings
    const topics = [
      'notifications.connect.project.created',
      'notifications.connect.project.updated',
      'notifications.connect.message.posted',
      'notifications.connect.message.edited',
      'notifications.connect.message.deleted',
      'notifications.connect.project.submittedForReview'
    ]
    const titles = [
      'Project Created',
      'Project Updated',
      'Message Posted',
      'Message Edited',
      'Message Deleted',
      'Project Submitted For Review'
    ]

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
            <th><span className="th-with-icon"><img src={iconMail} /><span>Email</span></span></th>
          </tr>
        </thead>
        <tbody>
          {_.map(topics, (topic, index) => {
            const title = titles[index]
            return (
              <tr key={topic}>
                <th>{title}</th>
                <td><SwitchButton onChange={() => this.handleChange(topic, 'web')} defaultChecked={settings[topic] && settings[topic].web === 'yes'} /></td>
                <td><SwitchButton onChange={() => this.handleChange(topic, 'email')} defaultChecked={settings[topic] && settings[topic].email === 'yes'} /></td>
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

      <div className="controls">
        <button type="submit" className="tc-btn tc-btn-primary" disabled={this.props.values.pending}>Save settings</button>
      </div>
    </Formsy.Form>
    )
  }
}

NotificationSettingsForm.propTypes = {
  values: PropTypes.object.isRequired,
  onInit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default NotificationSettingsForm
