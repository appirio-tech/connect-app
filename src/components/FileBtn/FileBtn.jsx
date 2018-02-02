/**
 * Button to choose file
 */
import React from 'react'
import PropTypes from 'prop-types'
import pick from 'lodash/pick'
import './FileBtn.scss'

const FileBtn = (props) => {
  const fileProps = pick(props, 'accept', 'onChange')

  return (
    <div className="file-btn">
      <input className="file" type="file" {...fileProps} />
      <button className="tc-btn tc-btn-default" tabIndex="-1">Update</button>
    </div>
  )
}

FileBtn.propTypes = {
  accept: PropTypes.string,
  onChange: PropTypes.func
}

export default FileBtn
