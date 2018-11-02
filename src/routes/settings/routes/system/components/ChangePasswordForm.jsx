/**
 * Change password form
 *
 * - Validates form client side
 */
import React from 'react'
import PropTypes from 'prop-types'
import { PASSWORD_MIN_LENGTH, PASSWORD_REG_EXP } from '../../../../../config/constants'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const TCFormFields = FormsyForm.Fields
const Formsy = FormsyForm.Formsy
import './ChangePasswordForm.scss'

class ChangePasswordForm extends React.Component {
  constructor() {
    super()

    this.state = {
      isValid: true
    }

    this.onValid = this.onValid.bind(this)
    this.onInvalid = this.onInvalid.bind(this)
  }

  onValid() {
    this.setState({ isValid: true })
  }

  onInvalid() {
    this.setState({ isValid: false })
  }

  render() {
    const { onSubmit, isPasswordChanging } = this.props
    const { isValid } = this.state
    const isDisabledSubmit = !isValid || isPasswordChanging

    return (
      <Formsy.Form
        className="change-password-form"
        onValid={this.onValid}
        onInvalid={this.onInvalid}
        onValidSubmit={onSubmit}
      >
        <TCFormFields.TextInput
          type="password"
          name="password"
          label="Password"
          value=""
          validations={{
            minLength: PASSWORD_MIN_LENGTH,
            matchRegexp: PASSWORD_REG_EXP,
            isRequired: true
          }}
          validationError="Enter password, please"
          validationErrors={{
            minLength: `Enter at least ${PASSWORD_MIN_LENGTH} characters, please`,
            matchRegexp: 'Use at least one letter and one number or symbol'
          }}
          placeholder="**********"
          disabled={isPasswordChanging}
        />

        <div className="controls">
          <button type="submit" className="tc-btn tc-btn-default" disabled={isDisabledSubmit}>Change Password</button>
        </div>
      </Formsy.Form>
    )
  }
}

ChangePasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isPasswordChanging: PropTypes.bool
}

export default ChangePasswordForm
