/**
 * Change email form
 *
 * - Validates form client side
 * - Validates email server side (check if available)
 * - Doesn't validate server side initially inputted email
 */
import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { EMAIL_AVAILABILITY_CHECK_DEBOUNCE } from '../../../../../config/constants'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const TCFormFields = FormsyForm.Fields
const Formsy = FormsyForm.Formsy
import './ChangeEmailForm.scss'
import LoadingIndicator from '../../../../../components/LoadingIndicator/LoadingIndicator'

class ChangeEmailForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isFocused: false,
      isValid: true,
      currentEmail: this.props.settings.email
    }

    this.onValid = this.onValid.bind(this)
    this.onInvalid = this.onInvalid.bind(this)
    this.onChange = this.onChange.bind(this)
    this.cancel = this.cancel.bind(this)
    this.submit = this.submit.bind(this)

    // debounced checkEmailAvailability function to prevent polluting server with requests
    this.debouncedAvailabilityCheck = _.debounce(this.checkEmailAvailability, EMAIL_AVAILABILITY_CHECK_DEBOUNCE)
  }

  componentWillReceiveProps(nextProps) {
    // when form ref is available
    // and there is no client side validation errors
    // we will check if have to show email availability error
    if (this.formRef && this.state.isValid) {
      const isCurrentEmailChacked = nextProps.checkedEmail === this.state.currentEmail
      const currentEmailCheckingError = nextProps.checkedEmail === this.state.currentEmail && nextProps.checkingEmailError

      if (isCurrentEmailChacked && !nextProps.isEmailAvailable) {
        this.formRef.updateInputsWithError({
          email: currentEmailCheckingError ? currentEmailCheckingError : 'This email is taken'
        })
      } else {
        this.formRef.updateInputsWithError({})
      }
    }
  }

  cancel() {
    this.formRef && this.formRef.updateInputsWithError({})
    this.emailRef.setValue(this.props.settings.email)
    this.debouncedAvailabilityCheck.cancel()
    this.setState({isFocused: false})
  }

  submit() {
    this.props.onSubmit(this.state.currentEmail)
  }

  checkEmailAvailability() {
    this.props.checkEmailAvailability(this.state.currentEmail)
  }

  onValid() {
    // if we haven't changed email, then don't check it
    if (this.state.currentEmail !== this.props.settings.email) {
      this.debouncedAvailabilityCheck()
    } else {
      // cancel availability check if current email hasn't been changed
      this.debouncedAvailabilityCheck.cancel()
    }
    this.setState({ isValid: true })
  }

  onInvalid() {
    // cancel availability checking if current email has client side validation errors
    this.debouncedAvailabilityCheck.cancel()
    this.setState({ isValid: false })
  }

  onChange(data) {
    if (data.email === this.props.settings.email) {
      this.setState({currentEmail: data.email, isFocused: false})
    } else {
      this.setState({ currentEmail: data.email, isFocused: true })
    }
    // clear all server validation errors when email is changed
    this.formRef && this.formRef.updateInputsWithError({})
  }

  render() {
    const { settings, checkingEmail, checkedEmail, isEmailAvailable, isEmailChanging, emailSubmitted } = this.props
    const { currentEmail, isValid, isFocused } = this.state
    const currentEmailAvailable = checkedEmail === currentEmail && isEmailAvailable
    const isCheckingCurrentEmail = checkingEmail === currentEmail
    const isEmailChanged = settings.email !== currentEmail
    const isDisabledSubmit = !isValid || !currentEmailAvailable || !isEmailChanged || isEmailChanging
    const hideActions = !isFocused || emailSubmitted
    let formStyle = ''

    if (isFocused) {
      formStyle = 'focused-form'
      if (emailSubmitted) {
        formStyle = 'submitted-form'
      }
    }

    return (
      <Formsy.Form
        className={`change-email-form ${formStyle}`}
        onValid={this.onValid}
        onInvalid={this.onInvalid}
        onChange={this.onChange}
        onValidSubmit={this.submit}
        ref={(ref) => this.formRef = ref}
      >
        <div className="email-container">
          <div className="label">
            Email
          </div>
          <div className="field">
            <TCFormFields.TextInput
              type="email"
              name="email"
              value={settings.email}
              validations={{
                isEmail: true,
                isRequired: true
              }}
              validationError="Enter email"
              validationErrors={{
                isEmail: 'Provide a correct email'
              }}
              disabled={isEmailChanging}
              ref={(ref) => this.emailRef = ref}
            />
            { isFocused && isCheckingCurrentEmail && (
              <div className="field-status">
                Verifying email
                <LoadingIndicator isSmall />
              </div>
            )}
            { (isFocused && isEmailChanged && currentEmailAvailable || isEmailChanging) && (
              <div className="field-status success-status">
                Email is available
              </div>
            )}
            { isFocused && emailSubmitted && (
              <div className="field-status red-status">
                We sent you a verification email, please check your mailbox
              </div>
            )}
          </div>
        </div>
        { !hideActions &&
          <div className="controls">
            {!isEmailChanging && <button onClick={this.cancel} className="tc-btn tc-btn-default">Cancel</button>}
            <button type="submit" className="tc-btn tc-btn-primary" disabled={isDisabledSubmit}>{isEmailChanging ? 'Saving...' : 'Change Email'}</button>
          </div>
        }
      </Formsy.Form>
    )
  }
}

ChangeEmailForm.propTypes = {
  email: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  checkingEmail: PropTypes.string,
  checkedEmail: PropTypes.string,
  checkingEmailError: PropTypes.string,
  isEmailAvailable: PropTypes.bool,
  isEmailChanging: PropTypes.bool
}

export default ChangeEmailForm
