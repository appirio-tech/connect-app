import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import FileList from '../../../components/FileList/FileList'
import AddFiles from '../../../components/FileList/AddFiles'
import { PROJECT_ATTACHMENTS_FOLDER } from '../../../config/constants'
import { addProjectAttachment, updateProjectAttachment, removeProjectAttachment } from '../../actions/projectAttachment'

class FileListContainer extends Component {
  constructor(props) {
    super(props)
    this.processUploadedFiles = this.processUploadedFiles.bind(this)
    this.deleteFile = this.deleteFile.bind(this)
    this.updateFile = this.updateFile.bind(this)
  }

  updateFile(attachmentId, updatedAttachment) {
    this.props.updateProjectAttachment(this.props.projectId, attachmentId, updatedAttachment)
  }

  deleteFile(attachmentId) {
    this.props.removeProjectAttachment(this.props.projectId, attachmentId)
  }

  processUploadedFiles(fpFiles, category) {
    fpFiles = _.isArray(fpFiles) ? fpFiles : [fpFiles]
    _.forEach(fpFiles, f => {
      const attachment = {
        title: f.filename,
        description: '',
        category,
        size: f.size,
        filePath: f.key,
        contentType: f.mimeType || 'application/unknown'
      }
      this.props.addProjectAttachment(this.props.projectId, attachment)
    })
  }

  render() {
    const { files, projectId } = this.props
    const storePath = `${PROJECT_ATTACHMENTS_FOLDER}/${projectId}/`
    return (
      <div>
        <FileList>
          {files.map((file, i) =>
            <FileList.Item
              {...file}
              key={i}
              onDelete={this.deleteFile}
              onSave={this.updateFile}
            />)}
        </FileList>
        <AddFiles successHandler={this.processUploadedFiles} storePath={storePath} category={'appDefinition'} />
      </div>
    )
  }
}

const mapDispatchToProps = {addProjectAttachment, updateProjectAttachment, removeProjectAttachment}


FileListContainer.propTypes = {
  projectId: PropTypes.number.isRequired,
  files: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default connect(null, mapDispatchToProps)(FileListContainer)
