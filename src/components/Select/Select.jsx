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
// import 'react-select/dist/react-select.css'
import './Select.scss'

const Select = (props) => {
  return (
    <ReactSelect {...props} />
  )
}

export default Select
