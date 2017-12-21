/**
 * Button to choose file
 */
import React, { PropTypes } from 'react'
import _ from 'lodash'
import './FileBtn.scss'

const FileBtn = (props) => {
  const fileProps = _.pick(props, 'accept', 'onChange')

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
