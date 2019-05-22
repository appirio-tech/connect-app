import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import * as filepicker from 'filestack-js'

import './LinksMenu.scss'
import Panel from '../Panel/Panel'
import AddFilePermission from '../FileList/AddFilePermissions'
import DeleteFileLinkModal from './DeleteFileLinkModal'
import EditFileAttachment from './EditFileAttachment'
import uncontrollable from 'uncontrollable'
import MobileExpandable from '../MobileExpandable/MobileExpandable'
import cn from 'classnames'
import BtnRemove from '../../assets/icons/ui-16px-1_trash-simple.svg'
import BtnEdit from '../../assets/icons/icon-edit.svg'
import LinksMenuAccordion from './LinksMenuAccordion'

import _ from 'lodash'

import {
  FILE_PICKER_API_KEY,
  FILE_PICKER_FROM_SOURCES,
  FILE_PICKER_CNAME,
  FILE_PICKER_SUBMISSION_CONTAINER_NAME
} from '../../config/constants'

const FileLinksMenu = ({
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
  isSharingAttachment,
  discardAttachments,
  onChangePermissions,
  pendingAttachments,
  projectMembers,
  loggedInUser,
  onDeletePostAttachment
}) => {

  const fileUploadClient = filepicker.init(FILE_PICKER_API_KEY, {
    cname: FILE_PICKER_CNAME
  })

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

  const openFileUpload = () => {
    if (fileUploadClient) {
      const picker = fileUploadClient.picker({
        storeTo: {
          location: 's3',
          path: attachmentsStorePath,
          container: FILE_PICKER_SUBMISSION_CONTAINER_NAME,
          region: 'us-east-1'
        },
        maxFiles: 4,
        fromSources: FILE_PICKER_FROM_SOURCES,
        uploadInBackground: false,
        onFileUploadFinished: (files) => {
          processUploadedFiles(files, category)
        },
        onOpen: () => {
          onAddingNewLink(true)
        },
        onClose: () => {
          onAddingNewLink(false)
        }
      })

      picker.open()
    }
  }

  return (
    <MobileExpandable title={`${title} (${links.length})`}>
      <Panel className={cn({'modal-active': (isAddingNewLink || linkToDelete >= 0)}, 'panel-links-container')}>
        <Panel.AddBtn onClick={openFileUpload}>Upload File</Panel.AddBtn>

        <Panel.Title>
          {title} ({links.length})
        </Panel.Title>

        {(isAddingNewLink || linkToDelete >= 0) && <div className="modal-overlay"/>}

        {
          pendingAttachments &&
          <AddFilePermission onCancel={discardAttachments}
            onSubmit={onAddingAttachmentPermissions}
            onChange={onChangePermissions}
            selectedUsers={selectedUsers}
            projectMembers={projectMembers}
            loggedInUser={loggedInUser}
            isSharingAttachment={isSharingAttachment}
          />
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
                if (Array.isArray(link.children) && link.children.length > 0) {
                  return (
                    <LinksMenuAccordion
                      key={`link-menu-accordion-${idx}`}
                      link={ link }
                      renderLink={ renderLink }
                      onDeletePostAttachment={onDeletePostAttachment}
                      loggedInUser={loggedInUser}
                    />)
                } else if(linkToDelete === idx) {
                  return (
                    <li className="delete-confirmation-modal" key={'delete-confirmation-' + idx}>
                      <DeleteFileLinkModal
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
                        {canEdit && <div className="buttons link-buttons">
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
        {!isAddingNewLink && (
          <div className="add-link-mobile">
            <button className="tc-btn tc-btn-secondary tc-btn-md" onClick={openFileUpload}>Upload File</button>
          </div>
        )}
      </Panel>
    </MobileExpandable>
  )
}

FileLinksMenu.propTypes = {
  canEdit: PropTypes.bool,
  noDots: PropTypes.bool,
  limit: PropTypes.number,
  links: PropTypes.array.isRequired,
  selectedUsers: PropTypes.string,
  projectMembers: PropTypes.object,
  pendingAttachments: PropTypes.object,
  onUploadAttachment: PropTypes.func,
  isSharingAttachment: PropTypes.bool.isRequired,
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
  onDeletePostAttachment: PropTypes.func,
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
