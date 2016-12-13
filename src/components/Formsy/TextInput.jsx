import React, { Component } from 'react'
import { HOC as hoc } from 'formsy-react'
import classNames from 'classnames'

class TextInput extends Component {

  constructor(props) {
    super(props)
    this.changeValue = this.changeValue.bind(this)
  }

  changeValue(e) {
    const value = e.target.value
    this.props.setValue(value)
    this.props.onChange(this.props.name, value)
  }

  render() {
    const { label, name, type, placeholder, wrapperClass, maxLength } = this.props
    const hasError = !this.props.isPristine() && !this.props.isValid()
    const classes = classNames('tc-file-field__inputs', {error: hasError})
    const disabled = this.props.isFormDisabled() || this.props.disabled
    const errorMessage = this.props.getErrorMessage() || this.props.validationError

    return (
      <div className={wrapperClass}>
        <label className="tc-label">{label}</label>
        <input
          name={name}
          className={classes}
          type={type}
          placeholder={placeholder}
          value={this.props.getValue()}
          disabled={disabled}
          onChange={this.changeValue}
          maxLength={maxLength}
        />
      { hasError ? (<p className="error-message">{errorMessage}</p>) : null}
      </div>
    )
  }
}

TextInput.defaultProps = {
  onChange: () => {}
}

export default hoc(TextInput)
