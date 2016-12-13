import React, { Component } from 'react'
import { HOC as hoc } from 'formsy-react'
import classNames from 'classnames'

class Textarea extends Component {

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
    const { label, name, rows, cols, placeholder, wrapperClass} = this.props
    const hasError = !this.props.isPristine() && !this.props.isValid()
    const classes = classNames('tc-textarea', {error: hasError})
    const disabled = this.props.isFormDisabled() || this.props.disabled
    const errorMessage = this.props.getErrorMessage() || this.props.validationError

    return (
      <div className={wrapperClass}>
        <label className="tc-label">{label}</label>
        <textarea
          rows={rows}
          cols={cols}
          id={name}
          name={name}
          placeholder={placeholder}
          className={classes}
          disabled={disabled}
          onChange={this.changeValue}
          value={this.props.getValue()}
        />
      { hasError ? (<p className="error-message">{errorMessage}</p>) : null}
      </div>

    )
  }
}
Textarea.defaultProps = {
  onChange: () => {},
  rows: 3,
  cols: 0
}
export default hoc(Textarea)
