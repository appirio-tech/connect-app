/**
 * Dropdown/select form field type
 */
import React from 'react'
import PT from 'prop-types'
import cn from 'classnames'

import SelectDropdown from '../../../../../components/SelectDropdown/SelectDropdown'

import './FormFieldDropdown.scss'

const FormFieldDropdown = ({ name, value, options, label, theme, disabled }) => (
  <div styleName={cn('milestone-post', theme)}>
    <div styleName="col-left">
      <div styleName="label-title">{label}</div>
    </div>
    <div styleName="col-right">
      <SelectDropdown
        name={name}
        value={value}
        theme="default"
        options={options}
        disabled={disabled}
      />
    </div>
  </div>
)

FormFieldDropdown.defaultProps = {
  value: '',
  theme: '',
  disabled: false,
}

FormFieldDropdown.propTypes = {
  label: PT.string.isRequired,
  name: PT.string.isRequired,
  value: PT.string,
  options: PT.arrayOf(PT.shape({
    title: PT.string.isRequired,
    value: PT.string.isRequired,
  })),
  theme: PT.string,
  disabled: PT.bool,
}

export default FormFieldDropdown
