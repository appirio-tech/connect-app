import React, {PropTypes} from 'react'
import FileListItem from './FileListItem'
import './FileList.scss'

const FileList = ({children}) => (
  <div className="file-list">
    <h4>Attached Files</h4>
    {children}
  </div>
)

FileList.propTypes = {
  children: PropTypes.any.isRequired
}

FileList.Item = FileListItem

export default FileList
