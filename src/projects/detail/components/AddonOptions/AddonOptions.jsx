import _ from 'lodash'
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
    const { options, allowMultiple } = this.props
    const value = []

    options.forEach(subCategory => {
      subCategory.options.forEach((option, i) => {
        if (this['element-' + subCategory.key + '-' + i].checked) {
          const val = { ...option.value }
          if (allowMultiple) {
            val.qty = this['element-' + subCategory.key + '-' + i + '-qty'].value
            if (isNaN(val.qty)) {
              delete val.qty
            } else {
              val.qty = parseInt(val.qty)
            }
          }
          value.push(val)
        }
      })
    })
    this.props.setValue(value)
    this.props.onChange(this.props.name, value)
  }

  render() {
    const { label, name, options, title, description, wrapperClass, allowMultiple } = this.props
    const hasError = !this.props.isPristine() && !this.props.isValid()
    const errorMessage = this.props.getErrorMessage() || this.props.validationError
    const getId = s => s.id

    const renderOption = (group, allowMultiple, cb, key) => {
      const curValue = this.props.getValue() || []
      const optValue = curValue.find((v) => v.id === cb.value.id)
      const checked = curValue.map(getId).indexOf(getId(cb.value)) !== -1
      const disabled = this.props.isFormDisabled() || cb.disabled || this.props.disabled
      const rClass = cn('checkbox-group-item', { disabled, selected: checked })
      const id = name+'-opt-'+group+'-'+key
      const setRef = (c) => this['element-' + group + '-' + key] = c
      const setQtyRef = (c) => this['element-' + group + '-' + key + '-qty'] = c
      return (
        <div className={rClass} key={key}>
          <div styleName="addon-row">
            <div styleName="addon-checkbox">
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
              <label className="tc-checkbox-label" styleName="addon-label" htmlFor={id}>{cb.label}</label>
            </div>
            { allowMultiple && <div styleName="addon-qty">
              <label className="tc-checkbox-label" styleName="addon-qty-label" >Quantity</label>
              <input
                type="number"
                styleName="addon-qty-input"
                name={`${name}-qty`}
                ref={setQtyRef}
                value={optValue && optValue.qty ? optValue.qty : 1}
                onChange={this.changeValue}
                min={1}
                max={100}
              />
            </div>
            }
          </div>
          {
            cb.quoteUp && !checked && <div className="checkbox-option-price"> {`+ $${cb.quoteUp}`} </div>
          }
          {
            cb.description && checked && <div className="checkbox-option-description"> {cb.description} </div>
          }
        </div>
      )
    }

    return (
      <div className={cn(wrapperClass)}>
        <div styleName="addon-header">
          <h3 styleName="addon-title">{title}</h3>
          <p>{description}</p>
        </div>
        {options.map((subCategory, i) => (
          <div styleName="subcategory" key={i}>
            <h5 styleName="subcategory-title">{subCategory.title}</h5>
            <div className="vertical">
              <label className="checkbox-group-label">{label}</label>
              <div className="checkbox-group-options">{subCategory.options.map(renderOption.bind(this, subCategory.key, allowMultiple))}</div>
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
