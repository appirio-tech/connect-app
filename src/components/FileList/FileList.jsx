import React, {PropTypes} from 'react'
import Panel from '../Panel/Panel'
import FileListItem from './FileListItem'
import cn from 'classnames'
import uncontrollable from 'uncontrollable'
import FileDeletionConfirmModal from './FileDeletionConfirmModal'
import './FileList.scss'

const FileList = ({files, onDelete, onSave, deletingFile, onDeleteIntent}) => (
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
          />
        )
      })
    }
  </Panel>
)

FileList.propTypes = {
}

FileList.Item = FileListItem

export default uncontrollable(FileList, {
  deletingFile: 'onDeleteIntent'
})
