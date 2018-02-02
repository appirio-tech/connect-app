/**
 * Change email form
 *
 * - Validates form client side
 * - Validates email server side (check if available)
 * - Doesn't validate server side initially inputted email
 */
import React from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash/debounce'
import { EMAIL_AVAILABILITY_CHECK_DEBOUNCE } from '../../../../../config/constants'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const TCFormFields = FormsyForm.Fields
const Formsy = FormsyForm.Formsy
import './ChangeEmailForm.scss'
import IconCheck from '../../assets/icons/check.svg'


class ChangeEmailForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isValid: true,
      currentEmail: this.props.email
    }

    this.onValid = this.onValid.bind(this)
    this.onInvalid = this.onInvalid.bind(this)
    this.onChange = this.onChange.bind(this)

    // debounced checkEmailAvailability function to prevent polluting server with requests
    this.debouncedAvailabilityCheck = debounce(this.checkEmailAvailability, EMAIL_AVAILABILITY_CHECK_DEBOUNCE)
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

  checkEmailAvailability() {
    this.props.checkEmailAvailability(this.state.currentEmail)
  }

  onValid() {
    // if we haven't changed email, then don't check it
    if (this.state.currentEmail !== this.props.email) {
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
    this.setState({ currentEmail: data.email })
    // clear all server validation errors when email is changed
    this.formRef && this.formRef.updateInputsWithError({})
  }

  render() {
    const { email: initialEmail, onSubmit, checkingEmail, checkedEmail, isEmailAvailable, isEmailChanging } = this.props
    const { currentEmail, isValid } = this.state
    const currentEmailAvailable = checkedEmail === currentEmail && isEmailAvailable
    const isCheckingCurrentEmail = checkingEmail === currentEmail
    const isEmailChanged = initialEmail !== currentEmail
    const isDisabledSubmit = !isValid || !currentEmailAvailable || !isEmailChanged || isEmailChanging

    return (
      <Formsy.Form
        className="change-email-form"
        onValid={this.onValid}
        onInvalid={this.onInvalid}
        onChange={this.onChange}
        onValidSubmit={onSubmit}
        ref={(ref) => this.formRef = ref}
      >
        <div className="field">
          <TCFormFields.TextInput
            type="email"
            name="email"
            label="Email"
            value={initialEmail}
            validations={{
              isEmail: true,
              isRequired: true
            }}
            validationError="Enter email, please"
            validationErrors={{
              isEmail: 'Provide a correct email, please'
            }}
            disabled={isEmailChanging}
          />
          <div className="field-status">
            {isCheckingCurrentEmail && <LoadingIndicator isSmall />}
            {isEmailChanged && currentEmailAvailable && <IconCheck className="icon-check"/>}
          </div>
        </div>
        <div className="controls">
          <button type="submit" className="tc-btn tc-btn-default" disabled={isDisabledSubmit}>Change Email</button>
        </div>
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
