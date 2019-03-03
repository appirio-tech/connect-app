/**
 * Wrapper for react-select
 *
 * Note: currently react-select@0.9.1 is being used in
 *
 * - Supports multi-selecting
 * - Applies project specific styles
 */
import React from 'react'
import ReactSelect from 'react-select'
import CreatableSelect from 'react-select/lib/Creatable'
import './Select.scss'

let customStyles = {}

const Select = (props) => {
  if (!props.showDropdownIndicator) {
    customStyles = Object.assign(customStyles, {
      dropdownIndicator: (provided) => ({
        ...provided,
        display: 'none'
      }),
      control: (provided) => ({
        ...provided,
        '& > div:nth-child(2)': {
          display: 'none'
        }
      })
    })
  } else {
    customStyles = {}
  }
  // console.log(props.showDropdownIndicator, props.createOption, customStyles)

  if (props.createOption) {
    return (
      <CreatableSelect
        {...props}
        styles={customStyles}
        className="react-select-container"
        classNamePrefix="react-select"
        noOptionsMessage={() => ('Type to search')}
      />
    )
  } else {
    return (
      <ReactSelect
        {...props}
        className="react-select-container"
        classNamePrefix="react-select"
        styles={customStyles}
        noOptionsMessage={() => ('Type to search')}
      />
    )
  }
}

export default Select
