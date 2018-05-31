import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import FileList from '../../../components/FileList/FileList'
import AddFiles from '../../../components/FileList/AddFiles'
import { PROJECT_ATTACHMENTS_FOLDER } from '../../../config/constants'
import { addProjectAttachment, updateProjectAttachment, removeProjectAttachment } from '../../actions/projectAttachment'
import { getProjectRoleForCurrentUser } from '../../../helpers/projectHelper'

class FileListContainer extends Component {
  constructor(props) {
    super(props)
    this.processUploadedFiles = this.processUploadedFiles.bind(this)
    this.deleteFile = this.deleteFile.bind(this)
    this.updateFile = this.updateFile.bind(this)
  }

  updateFile(attachmentId, updatedAttachment) {
    this.props.updateProjectAttachment(this.props.project.id, attachmentId, updatedAttachment)
  }

  deleteFile(attachmentId) {
    this.props.removeProjectAttachment(this.props.project.id, attachmentId)
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
        contentType: f.mimetype || 'application/unknown'
      }
      this.props.addProjectAttachment(this.props.project.id, attachment)
    })
  }

  canManageFiles() {
    const { currentUserId, project } = this.props
    const role = getProjectRoleForCurrentUser({ currentUserId, project })
    return !!role
  }

  render() {
    const { files, project, allMembers } = this.props
    const storePath = `${PROJECT_ATTACHMENTS_FOLDER}/${project.id}/`
    files.forEach(file => {
      if (allMembers[file.updatedBy]) {
        file.updatedByUser = allMembers[file.updatedBy]
      }

      if (allMembers[file.createdBy]) {
        file.createdByUser = allMembers[file.createdBy]
      }
    })

    return (
      <div>
        <FileList files={files} onDelete={ this.deleteFile } onSave={ this.updateFile } canModify={this.canManageFiles()}/>
        <AddFiles successHandler={this.processUploadedFiles} storePath={storePath} category={'appDefinition'} />
      </div>
    )
  }
}

const mapDispatchToProps = {addProjectAttachment, updateProjectAttachment, removeProjectAttachment}

const mapStateToProps = ({ members, loadUser }) => {
  return {
    allMembers     : members.members,
    currentUserId    : loadUser.user.userId
  }
}

FileListContainer.propTypes = {
  project: PropTypes.object.isRequired,
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
  allMembers: PropTypes.object.isRequired,
  currentUserId: PropTypes.number.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(FileListContainer)
