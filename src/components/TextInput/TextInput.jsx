import React, { PropTypes as PT } from 'react'
import './TextInput.scss'

function TextInput(props) {
  return (
    <input
      className={`TextInput ${props.className} ${props.value ? '' : 'empty'}`}
      maxLength={props.maxLength}
      onChange={event => props.onChange(event.target.value)}
      placeholder={props.placeholder}
      type="text"
      value={props.value}
      autoFocus={props.autoFocus}
    />
  )
}

TextInput.defaultProps = {
  className: '',
  maxLength: Number.MAX_VALUE,
  placeholder: ''
}

TextInput.propTypes = {
  className: PT.string,
  maxLength: PT.number,
  onChange: PT.func.isRequired,
  placeholder: PT.string,
  value: PT.string.isRequired
}

export default TextInput
