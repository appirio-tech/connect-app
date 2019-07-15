import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import _ from 'lodash'
import cn from 'classnames'
import uncontrollable from 'uncontrollable'

import AddFilePermission from '../FileList/AddFilePermissions'
import DeleteFileLinkModal from '../LinksMenu/DeleteFileLinkModal'
import EditFileAttachment from '../LinksMenu/EditFileAttachment'
import SubFolder from './SubFolder'
import ItemOperations from './ItemOperations'

import FolderIcon from '../../assets/icons/v.2.5/icon-folder-small.svg'

import './GridView.scss'

const FilesGridView = ({
  links,
  linkToDelete,
  linkToEdit,
  subFolderContent,
  onChangeSubFolder,
  onDelete,
  onDeleteIntent,
  onEdit,
  onEditIntent,
  title,
  selectedUsers,
  onAddAttachment,
  isSharingAttachment,
  discardAttachments,
  onChangePermissions,
  pendingAttachments,
  projectMembers,
  loggedInUser,
  onDeletePostAttachment,
  formatModifyDate,
  formatFolderTitle
}) => {
  const renderLink = (link) => {
    if (link.onClick) {
      return (
        <a
          href={link.address}
          onClick={(evt) => {
            // we only prevent default on click,
            // as we handle clicks with <li>
            evt.preventDefault()
          }}
        >
          {link.title}
        </a>
      )
    } else if (link.noNewPage) {
      return <Link to={link.address}>{link.title}</Link>
    } else {
      return <a href={link.address} target="_blank" rel="noopener noreferrer">{link.title}</a>
    }
  }

  const onAddingAttachmentPermissions = (allowedUsers) => {
    const { attachments, projectId } = pendingAttachments
    _.forEach(attachments, f => {
      const attachment = {
        ...f,
        allowedUsers
      }
      onAddAttachment(projectId, attachment)
    })
  }
  const goBack = () => onChangeSubFolder(null)

  return (
    <div styleName="assets-gridview-container">
      {(subFolderContent) && (
        <SubFolder
          link={ subFolderContent }
          renderLink={ renderLink }
          goBack={goBack}
          onDeletePostAttachment={onDeletePostAttachment}
          loggedInUser={loggedInUser}
          formatModifyDate={formatModifyDate}
        />)}
      {(!subFolderContent) && (
        <div styleName={cn({'assets-gridview-container-active': (linkToEdit >= 0  || linkToDelete >= 0)}, '')}>
          {(linkToEdit >= 0 || linkToDelete >= 0) && <div styleName="assets-gridview-modal-overlay"/>}
          <div styleName="assets-gridview-title">{`All ${title}`}</div>
          {pendingAttachments &&
            <AddFilePermission onCancel={discardAttachments}
              onSubmit={onAddingAttachmentPermissions}
              onChange={onChangePermissions}
              selectedUsers={selectedUsers}
              projectMembers={projectMembers}
              loggedInUser={loggedInUser}
              isSharingAttachment={isSharingAttachment}
            />}
          <ul>
            <li styleName="assets-gridview-header" key="assets-gridview-header">
              <div styleName="flex-item-title item-type">Type</div>
              <div styleName="flex-item-title item-name">Name</div>
              <div styleName="flex-item-title item-modified">Modified</div>
              <div styleName="flex-item-title item-action"/>
            </li>
            {links.map((link, idx) => {
              const onDeleteConfirm = () => {
                onDelete(link.id)
                onDeleteIntent(-1)
              }
              const onDeleteCancel = () => onDeleteIntent(-1)
              const handleDeleteClick = () => onDeleteIntent(idx)

              const onEditConfirm = (title, allowedUsers) => {
                onEdit(link.id, title, allowedUsers)
                onEditIntent(-1)
              }
              const onEditCancel = () => onEditIntent(-1)
              const handleEditClick = () => onEditIntent(idx)
              const canEdit = `${link.createdBy}` === `${loggedInUser.userId}`

              const changeSubFolder = () => onChangeSubFolder(link)

              if (Array.isArray(link.children) && link.children.length > 0) {
                return (
                  <li styleName="assets-gridview-row" onClick={changeSubFolder} key={'assets-gridview-folder-' + idx}>
                    <div styleName="flex-item item-type"><FolderIcon /></div>
                    <div styleName="flex-item item-name hand">{formatFolderTitle(link.title)}</div>
                    <div styleName="flex-item item-modified">{formatModifyDate(link)}</div>
                    <div styleName="flex-item item-action"/>
                  </li>)
              } else if(linkToDelete === idx) {
                return (
                  <li styleName="delete-confirmation-modal" key={'delete-confirmation-' + idx}>
                    <DeleteFileLinkModal
                      link={link}
                      onCancel={onDeleteCancel}
                      onConfirm={onDeleteConfirm}
                    />
                  </li>)
              } else if (linkToEdit === idx) {
                return (
                  <li styleName="delete-confirmation-modal" key={'delete-confirmation-' + idx}>
                    <EditFileAttachment
                      attachment={link}
                      projectMembers={projectMembers}
                      loggedInUser={loggedInUser}
                      onCancel={onEditCancel}
                      onConfirm={onEditConfirm}
                    />
                  </li>)
              } else {
                let iconPath
                try {
                  iconPath = require('../../assets/icons/' + link.title.split('.')[1] +'.svg')
                } catch(err) {
                  iconPath = require('../../assets/icons/default.svg')
                }
                return (
                  <li styleName="assets-gridview-row" key={'assets-gridview-item-' +idx}>
                    <div styleName="flex-item item-type">
                      <img width={42} height={42} src={iconPath} />
                    </div>
                    <div styleName="flex-item item-name">{renderLink(link)}</div>
                    <div styleName="flex-item item-modified">{formatModifyDate(link)}</div>
                    <div styleName="flex-item item-action">
                      {canEdit && (
                        <ItemOperations
                          canEdit={canEdit}
                          canDelete={canEdit}
                          handleEditClick={handleEditClick}
                          handleDeleteClick={handleDeleteClick}
                        />)}
                    </div>
                  </li>)}
            })}
          </ul>
        </div>)}
    </div>
  )
}

FilesGridView.propTypes = {
  canEdit: PropTypes.bool,
  links: PropTypes.array.isRequired,
  selectedUsers: PropTypes.string,
  projectMembers: PropTypes.object,
  pendingAttachments: PropTypes.object,
  onUploadAttachment: PropTypes.func,
  isSharingAttachment: PropTypes.bool.isRequired,
  discardAttachments: PropTypes.func,
  onChangePermissions: PropTypes.func,
  attachmentsStorePath: PropTypes.string.isRequired,
  onChangeSubFolder: PropTypes.func,
  onDelete: PropTypes.func,
  title: PropTypes.string,
  loggedInUser: PropTypes.object.isRequired,
  onDeletePostAttachment: PropTypes.func,
  formatModifyDate: PropTypes.func.isRequired,
  formatFolderTitle: PropTypes.func.isRequired,
}

FilesGridView.defaultProps = {
  title: 'Links',
  subFolderContent: null,
}

export default uncontrollable(FilesGridView, {
  linkToDelete: 'onDeleteIntent',
  linkToEdit: 'onEditIntent',
  subFolderContent: 'onChangeSubFolder'
})
