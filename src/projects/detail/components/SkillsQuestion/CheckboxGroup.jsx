import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import './CheckboxGroup.scss'

class CheckboxGroup extends Component {

  constructor(props) {
    super(props)
    this.changeValue = this.changeValue.bind(this)
  }

  changeValue() {
    const value = []
    this.props.options.forEach((option, key) => {
      if (this['element-' + key].checked) {
        value.push(option.value)
      }
    })
    this.props.setValue(value)
    this.props.onChange(this.props.name, value)
  }

  render() {
    const { label, name = 'tc-checkbox-group', options, layout, wrapperClass, getValue, disabled } = this.props
    const curValue = getValue() || []

    const renderOption = (cb, key) => {
      const checked = curValue.includes(cb.value)
      const checkboxDisabled = cb.disabled || disabled
      const rClass = cn('tc-checkbox-group-item', { disabled, selected: checked })
      const id = name+'-opt-'+key
      const setRef = (c) => this['element-' + key] = c
      return (
        <div styleName={rClass} key={key}>
          <div styleName="checkmark">
            <input
              id={id}
              ref={setRef}
              type="checkbox"
              name={name}
              checked={checked}
              disabled={checkboxDisabled}
              onChange={this.changeValue}
            />
            <label htmlFor={id}/>
          </div>
          <label htmlFor={id}>{cb.title}</label>
          {
            cb.description && checked && <div styleName="item-description"> {cb.description} </div>
          }
        </div>
      )
    }
    const chkGrpClass = cn('tc-checkbox-group', wrapperClass, {
      horizontal: layout === 'horizontal',
      vertical: layout === 'vertical'
    })
    return (
      <div styleName={chkGrpClass}>
        <label styleName="group-label">{label}</label>
        <div styleName="group-options">{options.map(renderOption)}</div>
      </div>
    )
  }
}

CheckboxGroup.PropTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired
}

CheckboxGroup.defaultProps = {
  onChange: () => {}
}

export default CheckboxGroup
