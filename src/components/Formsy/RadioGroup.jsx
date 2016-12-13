import React, { Component, PropTypes } from 'react'
import { HOC as hoc } from 'formsy-react'
import cn from 'classnames'

class RadioGroup extends Component {

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
    const { label, name, wrapperClass, options } = this.props
    const hasError = !this.props.isPristine() && !this.props.isValid()
    const disabled = this.props.isFormDisabled() || this.props.disabled
    const errorMessage = this.props.getErrorMessage() || this.props.validationError

    const renderOption = (radio, key) => {
      const checked = (this.props.getValue() === radio.value)
      const disabled = this.props.isFormDisabled() || radio.disabled || this.props.disabled
      const rClass = cn('radio', { disabled })
      const id = name+'-opt-'+key
      const setRef = (c) => this['element-' + key] = c
      return (
        <div className={rClass} key={key}>
          <input
            ref={setRef}
            id={id}
            checked={checked}
            type="radio"
            value={radio.value}
            onChange={this.changeValue}
            disabled={disabled}
          />
          <label htmlFor={id}>{radio.label}</label>
        </div>
      )
    }

    return (
      <div className={'radio-group-input ' + wrapperClass }>
        <label className="radio-group-label">{label}</label>
        <div className="radio-group-options">{options.map(renderOption)}</div>
      { hasError ? (<p className="error-message">{errorMessage}</p>) : null}
      </div>
    )
  }
}


RadioGroup.PropTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired
}

RadioGroup.defaultProps = {
  onChange: () => {}
}

export default hoc(RadioGroup)
