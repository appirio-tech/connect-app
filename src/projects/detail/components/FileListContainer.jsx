import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import FileList from '../../../components/FileList/FileList'
import AddFiles from '../../../components/FileList/AddFiles'
import { getProjectRoleForCurrentUser } from '../../../helpers/projectHelper'
import { uploadProjectAttachments, discardAttachments, changeAttachmentPermission } from '../../actions/projectAttachment'
import AddFilePermission from '../../../components/FileList/AddFilePermissions'

class FileListContainer extends Component {
  constructor(props) {
    super(props)
    this.processUploadedFiles = this.processUploadedFiles.bind(this)
    this.onAddingAttachmentPermissions = this.onAddingAttachmentPermissions.bind(this)
  }

  processUploadedFiles(fpFiles, category) {
    const attachments = []
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
      attachments.push(attachment)
    })
    this.onUploadAttachment(attachments)
  }


  onUploadAttachment(attachment) {
    const { project } = this.props
    this.props.uploadProjectAttachments(project.id, attachment)
  }

  onAddingAttachmentPermissions(allowedUsers) {
    const { attachments } = this.props.pendingAttachments
    _.forEach(attachments, f => {
      const attachment = {
        ...f,
        allowedUsers
      }
      this.props.addAttachment(attachment)
    })
  }

  canManageFiles() {
    const { currentUserId, project } = this.props
    const role = getProjectRoleForCurrentUser({ currentUserId, project })
    return !!role
  }

  render() {
    const {
      files,
      category,
      allMembers,
      loggedInUser,
      attachmentsStorePath,
      canManageAttachments,
      removeAttachment,
      updateAttachment,
      additionalClass,
      pendingAttachments,
      attachmentPermissions,
    } = this.props

    files.forEach(file => {
      if (allMembers[file.updatedBy]) {
        file.updatedByUser = allMembers[file.updatedBy]
      }

      if (allMembers[file.createdBy]) {
        file.createdByUser = allMembers[file.createdBy]
      }
    })

    return (
      <div className={additionalClass}>
        <FileList files={files} onDelete={removeAttachment} onSave={updateAttachment} canModify={canManageAttachments}
          projectMembers={allMembers}
          loggedInUser={loggedInUser}
        />
        <AddFiles successHandler={this.processUploadedFiles} storePath={attachmentsStorePath} category={category} />

        {
          pendingAttachments &&
          <AddFilePermission onCancel={this.props.onDiscardAttachments}
            onSubmit={this.onAddingAttachmentPermissions}
            onChange={this.props.changeAttachmentPermission}
            selectedUsers={attachmentPermissions}
            projectMembers={allMembers}
            loggedInUser={loggedInUser}
          />
        }
      </div>
    )
  }
}

const mapDispatchToProps = {
  uploadProjectAttachments,
  onDiscardAttachments: discardAttachments,
  changeAttachmentPermission
}

const mapStateToProps = ({ members, projectState, loadUser }) => {
  const project = projectState.project
  const projectMembers = _.filter(members.members, m => _.some(project.members, pm => pm.userId === m.userId))
  return {
    allMembers:  _.keyBy(projectMembers, 'userId'),
    pendingAttachments: projectState.attachmentsAwaitingPermission,
    attachmentPermissions: projectState.attachmentPermissions,
    loggedInUser: loadUser.user,
  }
}

FileListContainer.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
  allMembers: PropTypes.object.isRequired,
  addAttachment: PropTypes.func.isRequired,
  updateAttachment: PropTypes.func.isRequired,
  removeAttachment: PropTypes.func.isRequired,
  additionalClass: PropTypes.string
}

FileListContainer.defaultProps = {
  additionalClass: '',
}

export default connect(mapStateToProps, mapDispatchToProps)(FileListContainer)
