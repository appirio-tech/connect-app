import React, { Component, PropTypes } from 'react'
import { HOC as hoc } from 'formsy-react'
import cn from 'classnames'
import './AddonOptions.scss'

class AddonOptions extends Component {

  constructor(props) {
    super(props)
    this.changeValue = this.changeValue.bind(this)
  }

  changeValue() {
    const { options } = this.props
    const value = []

    options.forEach(subCategory => {
      subCategory.options.forEach((option, i) => {
        if (this['element-' + subCategory.key + '-' + i].checked) {
          value.push(option.value)
        }
      })
    })

    this.props.setValue(value)
    this.props.onChange(this.props.name, value)
  }

  render() {
    const { label, name, options, title, description } = this.props
    const hasError = !this.props.isPristine() && !this.props.isValid()
    const errorMessage = this.props.getErrorMessage() || this.props.validationError
    const getId = s => s.id

    const renderOption = (group, cb, key) => {
      const curValue = this.props.getValue() || []
      const checked = curValue.map(getId).indexOf(getId(cb.value)) !== -1
      const disabled = this.props.isFormDisabled() || cb.disabled || this.props.disabled
      const rClass = cn('checkbox-group-item', { disabled })
      const id = name+'-opt-'+group+'-'+key
      const setRef = (c) => this['element-' + group + '-' + key] = c
      return (
        <div className={rClass} key={key}>
          <div className="tc-checkbox">
            <input
              id={id}
              ref={setRef}
              type="checkbox"
              name={name}
              checked={checked}
              disabled={disabled}
              onChange={this.changeValue}
            />
            <label htmlFor={id}/>
          </div>
          <label className="tc-checkbox-label" htmlFor={id}>{cb.label}</label>
        </div>
      )
    }

    return (
      <div>
        <div styleName="addon-header">
          <h3 styleName="addon-title">{title}</h3>
          <p>{description}</p>
        </div>
        {options.map((subCategory, i) => (
          <div styleName="subcategory" key={i}>
            <h5 styleName="subcategory-title">{subCategory.title}</h5>
            <div className="vertical">
              <label className="checkbox-group-label">{label}</label>
              <div className="checkbox-group-options">{subCategory.options.map(renderOption.bind(this, subCategory.key))}</div>
              { hasError ? (<p className="error-message">{errorMessage}</p>) : null}
            </div>
          </div>
        ))}
      </div>
    )
  }
}

AddonOptions.PropTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
}

AddonOptions.defaultProps = {
  onChange: () => {}
}

export default hoc(AddonOptions)
