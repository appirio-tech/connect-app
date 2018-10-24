/**
 * Button to choose file
 */
import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import './FileBtn.scss'

const FileBtn = (props) => {
  const fileProps = _.pick(props, 'accept', 'onChange')
  const { disabled } = props
  return (
    <div className="file-btn">
      <input className="file" type="file" {...fileProps} disabled={disabled} />
      <button className="tc-btn tc-btn-default" tabIndex="-1" disabled={disabled}>{props.label}</button>
    </div>
  )
}

FileBtn.propTypes = {
  label: PropTypes.string.isRequired,
  accept: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool
}

export default FileBtn
