import React from 'react'
import PropTypes from 'prop-types'
import FilePicker from 'appirio-tech-react-components/components/FilePicker/FilePicker'
import './AddFiles.scss'

import { FILE_PICKER_API_KEY, FILE_PICKER_SUBMISSION_CONTAINER_NAME, FILE_PICKER_CNAME } from '../../config/constants'

const AddFiles = props => {
  const { successHandler, category, storePath } = props

  const onFileUpload = fpFiles => successHandler(fpFiles, category)

  const options = {
    apiKey: FILE_PICKER_API_KEY,
    cname: FILE_PICKER_CNAME,
    buttonText: 'Add File',
    buttonClass: 'tc-btn tc-btn-secondary tc-btn-sm',
    dragText: 'Drag and drop your files here',
    language: 'en',
    location: 's3',
    storeContainer: FILE_PICKER_SUBMISSION_CONTAINER_NAME,
    path: storePath,
    multiple: 'true',
    services: ['COMPUTER', 'GOOGLE_DRIVE', 'BOX', 'DROPBOX', 'SKYDRIVE']
  }

  return (
    <div className="add-file">
      <FilePicker apiKey={FILE_PICKER_API_KEY} mode="filepicker-dragdrop" options={options} onSuccess={onFileUpload} />
    </div>
  )
}

AddFiles.propTypes = {
  successHandler: PropTypes.func.isRequired,
  storePath: PropTypes.string.isRequired,
  category: PropTypes.string
}

AddFiles.defaultProps = {
  category: null
}

export default AddFiles
