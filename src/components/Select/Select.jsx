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

const customStyles = {
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
	dropdownIndicator: (provided, state) => ({
		...provided,
		display: 'none'
	})
}

const Select = (props) => {
  console.log('Select class: ', stylevars)
  return (
    <ReactSelect {...props} styles={customStyles}/>
  )
}

export default Select
