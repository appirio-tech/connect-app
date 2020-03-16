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
import UserTooltip from '../User/UserTooltip'
import FileIcon from '../../components/FileIcon'

import FolderIcon from '../../assets/icons/v.2.5/icon-folder-small.svg'

import './GridView.scss'
import ProjectManagerAvatars from '../../projects/list/components/Projects/ProjectManagerAvatars'
import FilterColHeader from './FilterColHeader'
import {
  PROJECT_ASSETS_SHARED_WITH_ADMIN,
  PROJECT_ASSETS_SHARED_WITH_ALL_MEMBERS,
  PROJECT_ASSETS_SHARED_WITH_TOPCODER_MEMBERS,
  PROJECT_FEED_TYPE_MESSAGES
} from '../../config/constants'

let selectedLink
let clearing = false

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
  selectedTags,
  onAddAttachment,
  assetsMembers,
  isSharingAttachment,
  discardAttachments,
  onChangePermissions,
  pendingAttachments,
  projectMembers,
  loggedInUser,
  onDeletePostAttachment,
  formatModifyDate,
  formatFolderTitle,
  setFilter,
  getFilterValue,
  clearFilter,
  filtered
}) => {
  let nameFieldRef
  let sharedWithFieldRef
  let dateFieldRef

  const updateSubContents = () => {
    if (selectedLink) {
      let link = links.filter(item => {
        return selectedLink.title === item.title
          && selectedLink.createdBy === item.createdBy
          && selectedLink.updatedAt === item.updatedAt
      })[0]

      if (!link) {
        link = _.cloneDeep(selectedLink)
        link.children = []
      }

      onChangeSubFolder(link)
    }
  }

  const clearSubContents = () => clearing = true

  const clearFieldValues = () => {
    nameFieldRef.clearFilter()
    sharedWithFieldRef.clearFilter()
    dateFieldRef.clearFilter()
  }

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

  const onAddingAttachmentPermissions = (allowedUsers, tags) => {
    const { attachments, projectId } = pendingAttachments
    _.forEach(attachments, f => {
      const attachment = {
        ...f,
        allowedUsers,
        tags
      }
      onAddAttachment(projectId, attachment)
    })
  }
  const goBack = () => {
    onChangeSubFolder(null)
    selectedLink = null
  }

  const renderSharedWith = (link) => {
    if (link.tag) {
      return (
        <p>
          {(link.tag === PROJECT_FEED_TYPE_MESSAGES)
            ? PROJECT_ASSETS_SHARED_WITH_TOPCODER_MEMBERS : PROJECT_ASSETS_SHARED_WITH_ALL_MEMBERS}
        </p>
      )
    } else if (!link.allowedUsers) {
      return (
        <p>
          {PROJECT_ASSETS_SHARED_WITH_ALL_MEMBERS}
        </p>
      )
    } else if (link.allowedUsers.length === 0) {
      return (
        <p>
          {PROJECT_ASSETS_SHARED_WITH_ADMIN}
        </p>
      )
    } else {
      return (
        <ProjectManagerAvatars managers={link.userHandles}/>
      )
    }
  }

  if (clearing) {
    setTimeout(() => {
      updateSubContents()
      clearing = false
    })
  }

  return (
    <div styleName="assets-gridview-container">
      {(subFolderContent) && (
        <SubFolder
          link={ subFolderContent }
          renderLink={ renderLink }
          goBack={goBack}
          assetsMembers={assetsMembers}
          onDeletePostAttachment={onDeletePostAttachment}
          loggedInUser={loggedInUser}
          formatModifyDate={formatModifyDate}
          setFilter={setFilter}
          getFilterValue={getFilterValue}
          clearFilter={clearFilter}
          updateSubContents={updateSubContents}
          clearSubContents={clearSubContents}
          filtered={filtered}
        />)}
      {(!subFolderContent) && (
        <div styleName={cn({'assets-gridview-container-active': (linkToEdit >= 0  || linkToDelete >= 0)}, '')}>
          {(linkToEdit >= 0 || linkToDelete >= 0) && <div styleName="assets-gridview-modal-overlay"/>}
          <div styleName="assets-gridview-title">
            {`${filtered ? 'Filtered' : 'All'} ${title}`}
            {filtered && (
              <button
                className="tc-btn tc-btn-default"
                onClick={() => {
                  clearFilter()
                  clearFieldValues()
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
          {pendingAttachments &&
            <AddFilePermission onCancel={discardAttachments}
              onSubmit={onAddingAttachmentPermissions}
              onChange={onChangePermissions}
              selectedUsers={selectedUsers}
              selectedTags={selectedTags}
              projectMembers={projectMembers}
              loggedInUser={loggedInUser}
              isSharingAttachment={isSharingAttachment}
            />}
          <ul>
            <li styleName="assets-gridview-header" key="assets-gridview-header">
              <div styleName="flex-item-title item-type">Type</div>
              <div styleName="flex-item-title item-name">
                <FilterColHeader
                  ref={(comp) => nameFieldRef = comp}
                  title="Name"
                  setFilter={setFilter}
                  type="name"
                  name={getFilterValue('name.name')}
                  tag={getFilterValue('name.tag')}
                />
              </div>
              <div styleName="flex-item-title item-shared-with">
                <FilterColHeader
                  ref={(comp) => sharedWithFieldRef = comp}
                  title="Shared With"
                  filterName="sharedWith"
                  setFilter={setFilter}
                  value={getFilterValue('sharedWith')}
                />
              </div>
              <div styleName="flex-item-title item-created-by">Created By</div>
              <div styleName="flex-item-title item-modified">
                <FilterColHeader
                  ref={(comp) => dateFieldRef = comp}
                  type="date"
                  title="Date"
                  setFilter={setFilter}
                  from={getFilterValue('date.from')}
                  to={getFilterValue('date.to')}
                />
              </div>
              <div styleName="flex-item-title item-action"/>
            </li>
            {links.map((link, idx) => {
              const onDeleteConfirm = () => {
                onDelete(link.id)
                onDeleteIntent(-1)
              }
              const onDeleteCancel = () => onDeleteIntent(-1)
              const handleDeleteClick = () => onDeleteIntent(idx)

              const onEditConfirm = (title, allowedUsers, tags) => {
                onEdit(link, title, allowedUsers, tags)
                onEditIntent(-1)
              }
              const onEditCancel = () => onEditIntent(-1)
              const handleEditClick = () => onEditIntent(idx)
              const canEdit = `${link.createdBy}` === `${loggedInUser.userId}`

              const changeSubFolder = () => {
                onChangeSubFolder(link)
                selectedLink = link
              }
              const owner = _.find(assetsMembers, m => m.userId === _.parseInt(link.createdBy))

              if (Array.isArray(link.children) && link.children.length > 0) {
                return (
                  <li styleName="assets-gridview-row" onClick={changeSubFolder} key={'assets-gridview-folder-' + idx}>
                    <div styleName="flex-item item-type"><FolderIcon /></div>
                    <div styleName="flex-item item-name hand"><p>{formatFolderTitle(link.title)}</p></div>
                    <div styleName="flex-item item-shared-with">
                      {renderSharedWith(link)}
                    </div>
                    <div styleName="flex-item item-created-by">
                      {!owner && !link.createdBy && (<div className="user-block">—</div>)}
                      {!owner && link.createdBy !== 'CoderBot' && (<div className="user-block txt-italic">Unknown</div>)}
                      {!owner && link.createdBy === 'CoderBot' && (<div className="user-block">CoderBot</div>)}
                      {owner && (
                        <div className="spacing">
                          <div className="user-block">
                            <UserTooltip usr={owner} id={idx} size={35} />
                          </div>
                        </div>)}
                    </div>
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
                return (
                  <li styleName="assets-gridview-row" key={'assets-gridview-item-' +idx}>
                    <div styleName="flex-item item-type">
                      <FileIcon type={link.title.split('.')[1]} />
                    </div>
                    <div styleName="flex-item item-name">
                      <div styleName="item-name-tag-wrapper">
                        <p>{renderLink(link)}</p>
                        {
                          link.tags && link.tags.map((t, i) => <span styleName="tag" key={i}>{t}</span>)
                        }
                      </div>
                    </div>
                    <div styleName="flex-item item-shared-with">
                      {renderSharedWith(link)}
                    </div>
                    <div styleName="flex-item item-created-by">
                      {!owner && (<div className="user-block txt-italic">Unknown</div>)}
                      {owner && (
                        <div className="spacing">
                          <div className="user-block">
                            <UserTooltip usr={owner} id={idx} size={35} />
                          </div>
                        </div>)}
                    </div>
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
  selectedTags: PropTypes.arrayOf(PropTypes.string),
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
  setFilter: PropTypes.func.isRequired,
  getFilterValue: PropTypes.func.isRequired,
  clearFilter: PropTypes.func.isRequired,
  filtered: PropTypes.bool
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
