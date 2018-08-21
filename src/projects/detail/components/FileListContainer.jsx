import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import FileList from '../../../components/FileList/FileList'
import AddFiles from '../../../components/FileList/AddFiles'
import { getProjectRoleForCurrentUser } from '../../../helpers/projectHelper'

class FileListContainer extends Component {
  constructor(props) {
    super(props)
    this.processUploadedFiles = this.processUploadedFiles.bind(this)
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
      attachmentsStorePath,
      canManageAttachments,
      removeAttachment,
      updateAttachment,
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
      <div>
        <FileList files={files} onDelete={removeAttachment} onSave={updateAttachment} canModify={canManageAttachments}/>
        <AddFiles successHandler={this.processUploadedFiles} storePath={attachmentsStorePath} category={category} />
      </div>
    )
  }
}

const mapDispatchToProps = {}

const mapStateToProps = ({ members }) => {
  return {
    allMembers: members.members,
  }
}

FileListContainer.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
  allMembers: PropTypes.object.isRequired,
  addAttachment: PropTypes.func.isRequired,
  updateAttachment: PropTypes.func.isRequired,
  removeAttachment: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(FileListContainer)
