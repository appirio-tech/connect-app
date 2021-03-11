import React, { Component } from 'react'
import ChangeEmailForm from '../components/ChangeEmailForm'
import ChangePasswordForm from '../components/ChangePasswordForm'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
import './SystemSettingsForm.scss'

const Formsy = FormsyForm.Formsy
const TCFormFields = FormsyForm.Fields

class SystemSettingsForm extends Component {
  render() {
    const { changePassword, checkEmailAvailability, changeEmail, systemSettings, resetPassword, usingSsoService } = this.props
    return (
      <div styleName="system-settings-container">

        <div styleName="section-heading">
          Account details
        </div>

        <div styleName="username">
          <div styleName="label">
            Username
          </div>
          <Formsy.Form styleName="input-container">
            <TCFormFields.TextInput
              wrapperClass="input-field"
              name="username"
              type="text"
              value={systemSettings.settings.handle}
              disabled
            />
            <div styleName="username-hint">
              To change the username please <a href="mailto:support@topcoder.com">get in touch with support</a>
            </div>
          </Formsy.Form>
        </div>

        <div className="form">
          <ChangeEmailForm
            checkEmailAvailability={checkEmailAvailability}
            onSubmit={(email) => changeEmail(email)}
            {...systemSettings}
            usingSsoService={usingSsoService}
          />

          {usingSsoService && (
            <div styleName="error-message">
              Since you joined Topcoder using your &lt;SSO Service&gt; account,
              any email updates will need to be handled by logging in to
              your &lt;SSO Service&gt; account.
            </div>
          )}
        </div>

        {!usingSsoService&& (
          <div styleName="section-heading">
          Retrieve or change your password
          </div>
        )}

        {!usingSsoService && (
          <div className="form">
            <ChangePasswordForm
              onSubmit={(data) => changePassword(data)}
              onReset={() => resetPassword()}
              {...systemSettings}
            />
          </div>
        )}
      </div>
    )
  }
}

export default SystemSettingsForm
