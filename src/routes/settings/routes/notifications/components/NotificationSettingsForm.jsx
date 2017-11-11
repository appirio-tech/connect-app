/**
 * Notification settings form
 */
import React, { PropTypes } from 'react'
import { Formsy, SwitchButton } from 'appirio-tech-react-components'
import BtnGroup from '../../../../../components/BtnGroup/BtnGroup'
import iconWeb from '../../../../../assets/images/icon-web.png'
import iconMail from '../../../../../assets/images/icon-mail.png'
import './NotificationSettingsForm.scss'

const NotificationSettingsForm = (props) => {
  const { values } = props

  return (
    <Formsy.Form
      className="notification-settings-form"
      onValidSubmit={props.onSubmit}
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
          <tr>
            <th>System news & updates</th>
            <td><span className="fixed-value">{values.system.web}</span></td>
            <td><SwitchButton defaultChecked={values.system.email} /></td>
          </tr>
          <tr>
            <th>When I’m added to a project</th>
            <td><SwitchButton defaultChecked={values['member-added'].web} /></td>
            <td><SwitchButton defaultChecked={values['member-added'].email} /></td>
          </tr>
          <tr>
            <th>New project notifications</th>
            <td><SwitchButton defaultChecked={values['new-project'].web} /></td>
            <td><SwitchButton defaultChecked={values['new-project'].email} /></td>
          </tr>
          <tr>
            <th>New @mention on posts, discussion, message</th>
            <td><SwitchButton defaultChecked={values.mention.web} /></td>
            <td><SwitchButton defaultChecked={values.mention.email} /></td>
          </tr>
          <tr>
            <th>News, promotions and marketing messages</th>
            <td><span className="none"/></td>
            <td><SwitchButton defaultChecked={values.promotions.email} /></td>
          </tr>
          <tr>
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
                  defaultValue={values.bundleEmail}
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="controls">
        <button type="submit" className="tc-btn tc-btn-primary">Save settings</button>
      </div>
    </Formsy.Form>
  )
}

NotificationSettingsForm.propTypes = {
  values: PropTypes.object.isRequired,
  onSubmit: PropTypes.func
}

export default NotificationSettingsForm
