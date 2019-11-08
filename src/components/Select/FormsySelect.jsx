import React from 'react'
import PropTypes from 'prop-types'
import { HOC as hoc } from 'formsy-react'

import Select from './Select'

/**
 * This component is a formsy wrapper for the Select component
 * @param {Object} props Component props
 */
const FormsySelect = props => {
  // when setValueOnly is set to true, formsy should submit the 'option.value' instead of the whole 'option' object
  const { onChange, setValueOnly, options } = props
  const selectedOption = props.getValue()

  const onSelectionChange = selectedOption => {
    props.setValue(setValueOnly ? selectedOption.value : selectedOption)
    onChange && onChange(selectedOption)
  }
  const value = setValueOnly
    ? _.find(options, o => o.value === selectedOption)
    : selectedOption

  return <Select {...props} value={value} onChange={onSelectionChange} />
}

FormsySelect.PropTypes = {
  onChange: PropTypes.func,
  setValueOnly: PropTypes.bool,
  options: PropTypes.array.isRequired
}

export default hoc(FormsySelect)
