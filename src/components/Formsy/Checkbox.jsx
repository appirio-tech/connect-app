import React, { Component } from 'react'
import { HOC as hoc } from 'formsy-react'
import classNames from 'classnames'

class Checkbox extends Component {

  constructor(props) {
    super(props)
    this.changeValue = this.changeValue.bind(this)
  }

  changeValue(e) {
    const value = e.target.checked
    this.props.setValue(value)
    this.props.onChange(this.props.name, value)
  }

  render() {
    const { label, name } = this.props
    const hasError = !this.props.isPristine() && !this.props.isValid()
    const classes = classNames('tc-checkbox', {error: hasError})
    const disabled = this.props.isFormDisabled() || this.props.disabled
    const errorMessage = this.props.getErrorMessage() || this.props.validationError
    const setRef = (c) => this.element = c

    return (
      <div className="checkbox-group-item">
        <div className={classes}>
          <input
            id={name}
            ref={setRef}
            type="checkbox"
            name={name}
            checked={this.props.getValue() === true}
            disabled={disabled}
            onChange={this.changeValue}
          />
          <label htmlFor={name}/>
        </div>
        <label className="tc-checkbox-label" htmlFor={name}>{label}</label>
        { hasError ? (<p className="error-message">{errorMessage}</p>) : null}
      </div>
    )
  }
}

Checkbox.defaultProps = {
  onChange: () => {}
}

export default hoc(Checkbox)
