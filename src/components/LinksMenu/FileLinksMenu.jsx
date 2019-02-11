import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import './LinksMenu.scss'
import Panel from '../Panel/Panel'
import AddFiles from '../FileList/AddFiles'
import AddFilePermission from '../FileList/AddFilePermissions'
import DeleteLinkModal from './DeleteLinkModal'
import EditFileAttachment from './EditFileAttachment'
import uncontrollable from 'uncontrollable'
import MobileExpandable from '../MobileExpandable/MobileExpandable'
import cn from 'classnames'
import BtnRemove from '../../assets/icons/ui-16px-1_trash-simple.svg'
import BtnEdit from '../../assets/icons/icon-edit.svg'
import _ from 'lodash'
import Modal from '../Modal/Modal'

const FileLinksMenu = ({
  canAdd,
  canDelete,
  noDots,
  isAddingNewLink,
  limit,
  links,
  linkToDelete,
  linkToEdit,
  onAddingNewLink,
  onChangeLimit,
  onDelete,
  onDeleteIntent,
  onEdit,
  onEditIntent,
  title,
  moreText,
  withHash,
  attachmentsStorePath,
  category,
  selectedUsers,
  onAddAttachment,
  onUploadAttachment,
  discardAttachments,
  onChangePermissions,
  pendingAttachments,
  projectMembers,
  loggedInUser,
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

  const processUploadedFiles = (fpFiles, category) => {
    const attachments = []
    onAddingNewLink(false)
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
    onUploadAttachment(attachments)
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

  const onClose = () => {
    onAddingNewLink(false)
  }

  return (
    <MobileExpandable title={`${title} (${links.length})`}>
      <Panel className={cn({'modal-active': (isAddingNewLink || linkToDelete >= 0)}, 'panel-links-container')}>
        {canAdd && !isAddingNewLink && onAddingNewLink &&
        <Panel.AddBtn onClick={() => onAddingNewLink(true)}>Upload File</Panel.AddBtn>}

        {!isAddingNewLink && <Panel.Title>
          {title} ({links.length})
        </Panel.Title>}

        {(isAddingNewLink || linkToDelete >= 0) && <div className="modal-overlay"/>}

        {
          pendingAttachments &&
          <AddFilePermission onCancel={discardAttachments}
            onSubmit={onAddingAttachmentPermissions}
            onChange={onChangePermissions}
            selectedUsers={selectedUsers}
            projectMembers={projectMembers}
            loggedInUser={loggedInUser}
          />
        }

        {isAddingNewLink &&
          <Modal onClose={onClose}>
            <Modal.Title>
              UPLOAD A FILE
            </Modal.Title>
            {
              pendingAttachments &&
              <AddFilePermission />
            }
            <AddFiles successHandler={processUploadedFiles.bind(this)}
              storePath={attachmentsStorePath}
              category={category}
            />
          </Modal>
        }

        <div
          className={cn('panel-links', {
            'panel-links-nodots': noDots,
            'panel-links-with-hash': withHash
          })}
        >
          <ul>
            {
              links.slice(0, limit).map((link, idx) => {
                const onDeleteConfirm = () => {
                  onDelete(idx)
                  onDeleteIntent(-1)
                }
                const onDeleteCancel = () => onDeleteIntent(-1)
                const handleDeleteClick = () => onDeleteIntent(idx)

                const onEditConfirm = (title, allowedUsers) => {
                  onEdit(idx, title, allowedUsers)
                  onEditIntent(-1)
                }
                const onEditCancel = () => onEditIntent(-1)
                const handleEditClick = () => onEditIntent(idx)
                const canEdit = `${link.createdBy}` === `${loggedInUser.userId}`
                if (linkToDelete === idx) {
                  return (
                    <li className="delete-confirmation-modal" key={'delete-confirmation-' + idx}>
                      <DeleteLinkModal
                        link={link}
                        onCancel={onDeleteCancel}
                        onConfirm={onDeleteConfirm}
                      />
                    </li>
                  )
                } else if (linkToEdit === idx) {
                  return (
                    <li className="delete-confirmation-modal" key={'delete-confirmation-' + idx}>
                      <EditFileAttachment
                        attachment={link}
                        projectMembers={projectMembers}
                        loggedInUser={loggedInUser}
                        onCancel={onEditCancel}
                        onConfirm={onEditConfirm}
                      />
                    </li>
                  )
                } else {
                  return (
                    <li
                      key={idx}
                      onClick={link.onClick ? link.onClick : () => {
                      }}
                      className={cn({
                        clickable: !!link.onClick,
                        'is-active': link.isActive
                      })}
                    >
                      {renderLink(link)}
                      <div className="button-group">
                        {canEdit && <div className="buttons link-buttons">
                          <button onClick={handleEditClick} type="button">
                            <BtnEdit className="btn-remove"/>
                          </button>
                        </div>}
                        {canDelete && <div className="buttons link-buttons">
                          <button onClick={handleDeleteClick} type="button">
                            <BtnRemove className="btn-edit"/>
                          </button>
                        </div>}
                        {!!link.count &&
                        <div className="link-count">
                          {link.count}
                        </div>
                        }
                      </div>
                    </li>
                  )
                }
              })
            }
          </ul>
          {links.length > limit && <div className="links-footer">
            <a href="javascript:" onClick={() => onChangeLimit(10000)}>{moreText}</a>
          </div>}
        </div>
        {canAdd && !isAddingNewLink && (
          <div className="add-link-mobile">
            <button className="tc-btn tc-btn-secondary tc-btn-md" onClick={() => onAddingNewLink(true)}>Add New Link
            </button>
          </div>
        )}
      </Panel>
    </MobileExpandable>
  )
}

FileLinksMenu.propTypes = {
  canAdd: PropTypes.bool,
  canDelete: PropTypes.bool,
  canEdit: PropTypes.bool,
  noDots: PropTypes.bool,
  limit: PropTypes.number,
  links: PropTypes.array.isRequired,
  selectedUsers: PropTypes.string,
  projectMembers: PropTypes.object,
  pendingAttachments: PropTypes.object,
  onUploadAttachment: PropTypes.func,
  discardAttachments: PropTypes.func,
  onChangePermissions: PropTypes.func,
  attachmentsStorePath: PropTypes.string.isRequired,
  moreText: PropTypes.string,
  onAddingNewLink: PropTypes.func,
  onAddNewLink: PropTypes.func,
  onChangeLimit: PropTypes.func,
  onDelete: PropTypes.func,
  title: PropTypes.string,
  loggedInUser: PropTypes.object.isRequired,
}

FileLinksMenu.defaultProps = {
  limit: 5,
  moreText: 'load more',
  title: 'Links',
}

export default uncontrollable(FileLinksMenu, {
  linkToDelete: 'onDeleteIntent',
  linkToEdit: 'onEditIntent',
  isAddingNewLink: 'onAddingNewLink',
  isAddingNewFile: 'isAddingNewFile',
  limit: 'onChangeLimit'
})
