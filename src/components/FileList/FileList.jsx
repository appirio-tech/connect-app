import React from 'react'
import PropTypes from 'prop-types'
import Panel from '../Panel/Panel'
import FileListItem from './FileListItem'
import cn from 'classnames'
import uncontrollable from 'uncontrollable'
import FileDeletionConfirmModal from './FileDeletionConfirmModal'
import './FileList.scss'

const FileList = ({files, onDelete, onSave, deletingFile, onDeleteIntent, canModify, projectMembers, 
  loggedInUser }) => (
  <Panel className={cn('file-list', {'modal-active': deletingFile})}>
    {deletingFile && <div className="modal-overlay" />}
    {
      files.map((file, i) => {
        const _onConfirmDelete = () => {
          onDelete(file.id)
          onDeleteIntent(null)
        }
        const _onFileDeleteCancel = () => onDeleteIntent(null)
        if (deletingFile === file.id) {
          return (
            <FileDeletionConfirmModal
              key={i}
              fileName={ file.title }
              onConfirm={ _onConfirmDelete }
              onCancel={ _onFileDeleteCancel }
            />
          )
        }
        return (
          <FileList.Item
            {...file}
            key={i}
            onDelete={ onDeleteIntent }
            onSave={ onSave }
            canModify={canModify}
            projectMembers={projectMembers}
            loggedInUser={loggedInUser}
          />
        )
      })
    }
  </Panel>
)

FileList.propTypes = {
  canModify: PropTypes.bool.isRequired,
  projectMembers: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired
}

FileList.Item = FileListItem

export default uncontrollable(FileList, {
  deletingFile: 'onDeleteIntent'
})
