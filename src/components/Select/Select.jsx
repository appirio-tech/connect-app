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
// import '../../styles/react-select.css'
import stylevars from './Select.scss'

let customStyles = {
	control: (provided, state) => ({
		...provided,
		'border-color': '#aaaaab',
		'& > div': { height: '40px' }
	}),
	option: (provided, state) => ({
		...provided,
		'font-family': 'Roboto, Arial, Helvetica, sans-serif',
		'font-size': '12px'
	}),
	multiValue: (provided, state) => ({
		...provided,
		'background-color': '#cdcdce',
		'font-weight': 'bold'
	}),
	noOptionsMessage: (provided, state) => ({
		...provided,
		'text-align': 'left',
		'font-size': '15px',
		color: 'gray'
	})
}

const Select = (props) => {
  if (!props.showDropdownIndicator) {
	  customStyles = Object.assign(customStyles, {
		  dropdownIndicator: (provided, state) => ({
	  		...provided,
	  		display: 'none'})
		}
		)
  }
  
  return (
    <ReactSelect
      {...props}
      styles={customStyles}
      noOptionsMessage={()=>('Type to search')}/>
  )
}

export default Select
