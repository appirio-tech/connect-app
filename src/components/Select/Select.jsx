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
import Async from 'react-select/lib/Async'
import './Select.scss'

const Select = (props) => {
  let containerclass = 'react-select-hiddendropdown-container'
  if (props.showDropdownIndicator) {
    containerclass = 'react-select-container'
  }
  if (props.heightAuto) {
    containerclass += ' height-auto'
  }

  if (props.createOption) {
    return (
      <CreatableSelect
        {...props}
        createOptionPosition="first"
        className={containerclass}
        ref={props.createSelectRef}
        classNamePrefix="react-select"
      />
    )
  } else if (props.asyncOption) {
    return (
      <Async
        {...props}
        createOptionPosition="first"
        className={containerclass}
        classNamePrefix="react-select"
        isClearable
      />
    )
  } else {
    return (
      <ReactSelect
        {...props}
        createOptionPosition="first"
        className={containerclass}
        classNamePrefix="react-select"
        isClearable
      />
    )
  }
}

Select.defaultProps = {
  noOptionsMessage: () => 'Type to search'
}

export default Select
