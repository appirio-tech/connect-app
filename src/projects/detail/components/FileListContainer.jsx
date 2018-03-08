import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import FileList from '../../../components/FileList/FileList'
import AddFiles from '../../../components/FileList/AddFiles'
import { getProjectRoleForCurrentUser } from '../../../helpers/projectHelper'
import { PROJECT_ATTACHMENTS_FOLDER, PROJECT_ROLE_CUSTOMER } from '../../../config/constants'
import { addProjectAttachment, updateProjectAttachment, removeProjectAttachment } from '../../actions/projectAttachment'

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

  render() {
    const { files, project, allMembers, userId } = this.props
    const storePath = `${PROJECT_ATTACHMENTS_FOLDER}/${project.id}/`
    const currentMemberRole = getProjectRoleForCurrentUser({ project, currentUserId: userId})
    const canAddFile = currentMemberRole && currentMemberRole !== PROJECT_ROLE_CUSTOMER
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
        <FileList files={files} onDelete={ this.deleteFile } onSave={ this.updateFile } />
        {canAddFile && <AddFiles successHandler={this.processUploadedFiles} storePath={storePath} category={'appDefinition'} /> }
      </div>
    )
  }
}

const mapDispatchToProps = {addProjectAttachment, updateProjectAttachment, removeProjectAttachment}

const mapStateToProps = ({ members, loadUser }) => {
  return {
    allMembers: members.members,
    userId: parseInt(loadUser.user.id)
  }
}

FileListContainer.propTypes = {
  project: PropTypes.object.isRequired,
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
  allMembers: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(FileListContainer)
