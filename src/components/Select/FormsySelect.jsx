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
  const getOnlyValues = (selected)  => props.isMulti ? (selected || []).map(o => o.value) : selected.value

  const hasError = !props.isPristine() && !props.isValid()
  const errorMessage = props.getErrorMessage() || props.validationError
  const onSelectionChange = selectedOption => {
    props.setValue(setValueOnly ? getOnlyValues(selectedOption) : selectedOption)
    onChange && onChange(selectedOption)
  }
  const value = setValueOnly
    ? _.find(options, o => o.value === selectedOption)
    : selectedOption

  return (
    <div>
      <Select {...props} value={value} onChange={onSelectionChange} />
      {(hasError && errorMessage) ? (<p className="error-message">{errorMessage}</p>)  : null}
    </div>
  )
}

FormsySelect.PropTypes = {
  onChange: PropTypes.func,
  setValueOnly: PropTypes.bool,
  options: PropTypes.array.isRequired
}

export default hoc(FormsySelect)
