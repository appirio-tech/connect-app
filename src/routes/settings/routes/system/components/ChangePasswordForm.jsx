/**
 * Change password form
 *
 * - Validates form client side
 */
import React from 'react'
import PropTypes from 'prop-types'
import { PASSWORD_MIN_LENGTH, PASSWORD_REG_EXP } from '../../../../../config/constants'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
import PasswordInput from 'appirio-tech-react-components/components/Formsy/PasswordInput'
const Formsy = FormsyForm.Formsy
import './ChangePasswordForm.scss'

class ChangePasswordForm extends React.Component {
  constructor() {
    super()

    this.state = {
      isValid: true,
      isFocused: false,
      showReset: false,
      currentPassword: '',
      newPassword: '',
      verifyPassword: '',
      forcedError: {
        newPassword: null,
        verifyPassword: null,
      }
    }

    this.onValid = this.onValid.bind(this)
    this.onInvalid = this.onInvalid.bind(this)
    this.onPasswordChange = this.onPasswordChange.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onShowReset = this.onShowReset.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.passwordSubmitted && this.props.passwordSubmitted === false) {
      this.formRef && this.formRef.reset()
      this.setState({isFocused: false})
    }
  }

  onValid() {
    const { forcedError } = this.state
    const isValid = forcedError.newPassword === null && forcedError.verifyPassword === null
    this.setState({ isValid })
  }

  onInvalid() {
    this.setState({ isValid: false })
  }

  onCancel() {
    this.formRef && this.formRef.reset()
    this.setState({ isFocused: false, isValid: false, showReset: false, forcedError: {}})
  }

  validate(state) {
    const errors = {
      newPassword: null,
      verifyPassword: null,
    }
    if (state.newPassword !== '' && state.currentPassword === '') {
      errors.newPassword = 'Enter your current password'
    }
    if (state.verifyPassword !== '' && state.verifyPassword !== state.newPassword) {
      errors.verifyPassword = 'Passwords do not match'
    }
    return errors
  }

  handleVerifyPassword(value) {
    this.setState({verifyPassword: value})
  }

  onPasswordChange(type, value) {
    const newState = {...this.state,
      [type]: value,
      isFocused: true,
    }
    newState.forcedError = this.validate(newState)
    this.setState(newState)
  }

  onShowReset() {
    this.setState({isFocused: true, showReset: true})
  }

  getPasswordField(key, name, validations, errMsg) {
    const { isPasswordChanging } = this.props
    const { forcedError } = this.state
    if (forcedError[key] !== null) {
      validations = null
    }
    return (
      <div className="field">
        <div className="label">
          {name}
        </div>
        <div className="input-field">
          <PasswordInput
            type="password"
            value=""
            name={key}
            validationError={errMsg}
            disabled={isPasswordChanging}
            onChange={this.onPasswordChange}
            forceErrorMessage={forcedError[key]}
            validations={validations}
            showCheckMark={key !== 'currentPassword'}
            required
          />
          { (key === 'currentPassword') && <div onClick={this.onShowReset} className="hint">
            Forgot password?
          </div>}
        </div>
      </div>
    )
  }

  onSubmit() {
    this.props.onSubmit({
      password: this.state.newPassword,
      currentPassword: this.state.currentPassword
    })
  }

  passwordForm() {
    const { isPasswordChanging } = this.props
    const { isValid, isFocused } = this.state
    const isDisabledSubmit = !isValid || isPasswordChanging
    const showActions = isFocused && !isPasswordChanging
    return (
      <Formsy.Form
        className="change-password-form"
        onValid={this.onValid}
        onInvalid={this.onInvalid}
        onValidSubmit={this.onSubmit}
        ref={(ref) => this.formRef = ref}
      >
        {this.getPasswordField('currentPassword', 'Current password')}
        {this.getPasswordField('newPassword', 'New password', {
          minLength: PASSWORD_MIN_LENGTH,
          matchRegexp: PASSWORD_REG_EXP,
          isRequired: true
        }, 'Password should be 8-64 characters, use A-Z, a-z, 0-9, ! ? . = _')}
        {this.getPasswordField('verifyPassword', 'Verify new password', null, 'Passwords do not match')}

        { showActions && <div className="controls">
          <button onClick={this.onCancel} className="tc-btn tc-btn-default" >Cancel</button>
          <button type="submit" className="tc-btn tc-btn-primary" disabled={isDisabledSubmit}>Change Password</button>
        </div>
        }
        { isPasswordChanging && <div className="controls">
          <button className="tc-btn tc-btn-primary" disabled>Saving changes...</button>
        </div>
        }
      </Formsy.Form>
    )
  }

  resetPasswordForm() {
    const { isResetingPassword, passwordResetSubmitted, onReset } = this.props
    const showActions = !isResetingPassword && !passwordResetSubmitted
    const title = (passwordResetSubmitted)
      ? 'We sent you password rese instructions' : 'Reset your password'
    return (
      <div className="reset-container">
        <div className="reset-heading">
          {title}
        </div>
        <div className="reset-body">
          { passwordResetSubmitted && <span>
            Please follow the instructions otherwise you won’t be able to log in back to Topcoder.
            If you experience problems please <a href="mailto:support@topcoder.com">contact Support</a>.
          </span>}
          { !passwordResetSubmitted && <span>
            No worries, we all forget sometimes.
            We will send you a password reset link to your email address.
            Please follow the instruction in the email
          </span>}
        </div>
        { showActions && <div className="controls">
          <button onClick={this.onCancel} className="tc-btn tc-btn-default" >Cancel</button>
          <button onClick={onReset} className="tc-btn tc-btn-primary">Reset Password</button>
        </div>
        }
        { isResetingPassword && <div className="controls">
          <button className="tc-btn tc-btn-primary" disabled>Reseting your password...</button>
        </div>
        }
      </div>
    )
  }

  render() {
    const { isFocused, showReset } = this.state
    const formClass = (isFocused) ? 'focused-container' : ''
    return (
      <div className={`conttainer ${formClass}`}>
        {!showReset && this.passwordForm()}
        {showReset && this.resetPasswordForm()}
      </div>
    )
  }
}

ChangePasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  passwordSubmitted: PropTypes.bool,
  isResetingPassword: PropTypes.bool,
  isPasswordChanging: PropTypes.bool
}

export default ChangePasswordForm
