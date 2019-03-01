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

let customStyles = {
  control: (provided) => ({
    ...provided,
    'border-color': '#aaaaab',
    '& > div': { height: '40px' }
  }),
  option: (provided) => ({
    ...provided,
    'font-family': 'Roboto, Arial, Helvetica, sans-serif',
    'font-size': '12px'
  }),
  multiValue: (provided) => ({
    ...provided,
    'background-color': '#cdcdce',
    'font-weight': 'bold'
  }),
  noOptionsMessage: (provided) => ({
    ...provided,
    'text-align': 'left',
    'font-size': '15px',
    color: 'gray'
  })
}

const Select = (props) => {
  console.log(props.showDropdownIndicator, props.createOption, customStyles)
  if (!props.showDropdownIndicator) {
    console.log('Hiding dropdownIndicator')
    customStyles = Object.assign(customStyles, {
      dropdownIndicator: (provided) => ({
        ...provided,
        display: 'none'
      })
    })
  } else {
    delete customStyles.dropdownIndicator
  }


  if (props.createOption) {
    return (
      <CreatableSelect
        {...props}
        styles={customStyles}
        noOptionsMessage={() => ('Type to search')}
      />
    )
  } else {
    return (
      <ReactSelect
        {...props}
        styles={customStyles}
        noOptionsMessage={() => ('Type to search')}
      />
    )
  }
}

export default Select
