import React from 'react'
import PropTypes from 'prop-types'
import uncontrollable from 'uncontrollable'
import cn from 'classnames'
import  { Link } from 'react-router-dom'

import DeleteLinkModal from '../LinksMenu/DeleteLinkModal'
import EditLinkModal from '../LinksMenu/EditLinkModal'
import SubFolder from './SubFolder'
import ItemOperations from './ItemOperations'

import FolderIcon from '../../assets/icons/v.2.5/icon-folder-small.svg'
import LinkIcon from '../../assets/icons/link-12.svg'

import './GridView.scss'
const LinksGridView = ({
  canDelete,
  canEdit,
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
  formatModifyDate,
  formatFolderTitle,
}) => {
  const renderLink = (link) => {
    if (link.onClick) {
      return (
        <a
          href={link.address}
          onClick={(evt) => {
            // we only prevent default on click,
            // as we handle clicks with <li>
            if (!link.allowDefaultOnClick) {
              evt.preventDefault()
            }
          }}
        >
          {link.title}
        </a>)
    } else if (link.noNewPage) {
      return <Link to={link.address}>{link.title}</Link>
    } else {
      return <a href={link.address} target="_blank" rel="noopener noreferrer">{link.title}</a>
    }
  }
  const goBack = () => onChangeSubFolder(null)
  return (
    <div styleName="assets-gridview-container">
      {(subFolderContent) && (
        <SubFolder
          link={ subFolderContent }
          renderLink={ renderLink }
          goBack={goBack}
          formatModifyDate={formatModifyDate}
        />)}
      {(!subFolderContent) && (
        <div styleName={cn({'assets-gridview-container-active': (linkToEdit >= 0  || linkToDelete >= 0)}, '')}>
          {(linkToEdit >= 0 || linkToDelete >= 0) && <div styleName="assets-gridview-modal-overlay"/>}
          <div styleName="assets-gridview-title">{`All ${title}`}</div>
          <ul>
            <li styleName="assets-gridview-header" key="assets-gridview-header">
              <div styleName="flex-item-title item-type">Type</div>
              <div styleName="flex-item-title item-name">Name</div>
              <div styleName="flex-item-title item-modified">Modified</div>
              <div styleName="flex-item-title item-action"/>
            </li>
            {links.map((link, idx) => {
              const onDeleteConfirm = () => {
                onDelete(idx)
                onDeleteIntent(-1)
              }
              const onDeleteCancel = () => onDeleteIntent(-1)
              const handleDeleteClick = () => onDeleteIntent(idx)

              const onEditConfirm = (title, address) => {
                onEdit(idx, title, address)
                onEditIntent(-1)
              }
              const onEditCancel = () => onEditIntent(-1)
              const handleEditClick = () => onEditIntent(idx)
              const changeSubFolder = () => onChangeSubFolder(link)

              if (Array.isArray(link.children) && link.children.length > 0) {
                return (
                  <li styleName="assets-gridview-row" onClick={changeSubFolder} key={'assets-gridview-folder-' + idx}>
                    <div styleName="flex-item item-type"><FolderIcon /></div>
                    <div styleName="flex-item item-name hand">{formatFolderTitle(link.title)}</div>
                    <div styleName="flex-item item-modified">{formatModifyDate(link)}</div>
                    <div styleName="flex-item item-action"/>
                  </li>)
              } else if (linkToDelete === idx) {
                return (
                  <li styleName="delete-confirmation-modal" key={ 'delete-confirmation-' + idx }>
                    <DeleteLinkModal
                      link={ link }
                      onCancel={ onDeleteCancel }
                      onConfirm={ onDeleteConfirm }
                    />
                  </li>)
              } else if (linkToEdit === idx) {
                return (
                  <li styleName="delete-confirmation-modal" key={ 'delete-confirmation-' + idx }>
                    <EditLinkModal
                      link={ link }
                      onCancel={ onEditCancel }
                      onConfirm={ onEditConfirm }
                    />
                  </li>)
              } else {
                return (
                  <li styleName="assets-gridview-row" key={'assets-gridview-item-' +idx}>
                    <div styleName="flex-item item-type"><LinkIcon/></div>
                    <div styleName="flex-item item-name">{renderLink(link)}</div>
                    <div styleName="flex-item item-modified">{formatModifyDate(link)}</div>
                    <div styleName="flex-item item-action">
                      {(canEdit || canDelete) && (
                        <ItemOperations
                          canEdit={canEdit}
                          canDelete={canDelete}
                          handleEditClick={handleEditClick}
                          handleDeleteClick={handleDeleteClick}
                        />)}
                    </div>
                  </li>)}
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

LinksGridView.propTypes = {
  canDelete: PropTypes.bool,
  canEdit: PropTypes.bool,
  links: PropTypes.array.isRequired,
  onChangeSubFolder: PropTypes.func,
  onDelete: PropTypes.func,
  title: PropTypes.string,
  formatModifyDate: PropTypes.func.isRequired,
  formatFolderTitle: PropTypes.func.isRequired,
}

LinksGridView.defaultProps = {
  title: 'Links',
  subFolderContent: null,
}

export default uncontrollable(LinksGridView, {
  linkToDelete: 'onDeleteIntent',
  linkToEdit: 'onEditIntent',
  subFolderContent: 'onChangeSubFolder'
})
