import React, {PropTypes} from 'react'
import FileListItem from './FileListItem'
import './FileList.scss'

const FileList = ({children}) => (
  <div className="file-list">
    {children}
  </div>
)

FileList.propTypes = {
  children: PropTypes.any.isRequired
}

FileList.Item = FileListItem

export default FileList
