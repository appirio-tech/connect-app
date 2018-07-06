import React from 'react'
import PropTypes from 'prop-types'
import './LinksMenu.scss'
import Panel from '../Panel/Panel'
import AddLink from './AddLink'
import DeleteLinkModal from './DeleteLinkModal'
import EditLinkModal from './EditLinkModal'
import uncontrollable from 'uncontrollable'
import MobileExpandable from '../MobileExpandable/MobileExpandable'
import cn from 'classnames'
import BtnRemove from '../../assets/icons/ui-16px-1_trash-simple.svg'
import BtnEdit from '../../assets/icons/icon-edit.svg'


const LinksMenu = ({
  canAdd,
  canDelete,
  canEdit,
  className,
  isAddingNewLink,
  limit,
  links,
  linkToDelete,
  linkToEdit,
  onAddingNewLink,
  onAddNewLink,
  onChangeLimit,
  onDelete,
  onDeleteIntent,
  onEdit,
  onEditIntent,
  title,
  moreText,
}) => (
  <MobileExpandable title={`${title} (${links.length})`}>
    <Panel className={cn({'modal-active': (isAddingNewLink || linkToDelete >= 0) }, 'panel-links-container')}>
      {canAdd && !isAddingNewLink && onAddingNewLink && <Panel.AddBtn onClick={() => onAddingNewLink(true)}>Create New Link</Panel.AddBtn>}
      {!isAddingNewLink && <Panel.Title>
        {title} ({links.length})
      </Panel.Title>}
      { (isAddingNewLink || linkToDelete >= 0) && <div className="modal-overlay" />}
      {isAddingNewLink &&
        <AddLink
          onAdd={(link) => {
            if (link.address.indexOf('http') !== 0)
              link.address = `http://${link.address}`
            onAddNewLink(link)
            onAddingNewLink(false)
          }}
          onClose={() => {
            onAddingNewLink(false)
          }}
        />
      }

      <div className={cn('panel-links', { [className]: !!className })}>
        <ul>
          {
            links.slice(0, limit).map((link, idx) => {
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
              if (linkToDelete === idx) {
                return (
                  <li className="delete-confirmation-modal" key={ 'delete-confirmation-' + idx }>
                    <DeleteLinkModal
                      link={ link }
                      onCancel={ onDeleteCancel }
                      onConfirm={ onDeleteConfirm }
                    />
                  </li>
                )
              } else if (linkToEdit === idx) {
                return (
                  <li className="delete-confirmation-modal" key={ 'delete-confirmation-' + idx }>
                    <EditLinkModal
                      link={ link }
                      onCancel={ onEditCancel }
                      onConfirm={ onEditConfirm }
                    />
                  </li>
                )
              } else {
                return (
                  <li key={idx}>
                    <a href={link.address} target="_blank" rel="noopener noreferrer">{link.title}</a>
                    <div className="button-group">
                      {canEdit && <div className="buttons link-buttons">
                        <button onClick={ handleEditClick } type="button">
                          <BtnEdit className="btn-remove"/>
                        </button>
                      </div>}
                      {canDelete && <div className="buttons link-buttons">
                        <button onClick={ handleDeleteClick } type="button">
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
          <button className="tc-btn tc-btn-secondary tc-btn-md" onClick={() => onAddingNewLink(true)}>Add New Link</button>
        </div>
      )}
    </Panel>
  </MobileExpandable>
)

LinksMenu.propTypes = {
  canAdd: PropTypes.bool,
  canDelete: PropTypes.bool,
  canEdit: PropTypes.bool,
  className: PropTypes.string,
  limit: PropTypes.number,
  links: PropTypes.array.isRequired,
  moreText: PropTypes.string,
  onAddingNewLink: PropTypes.func,
  onAddNewLink: PropTypes.func,
  onChangeLimit: PropTypes.func,
  onDelete: PropTypes.func,
  title: PropTypes.string,
}

LinksMenu.defaultProps = {
  limit: 5,
  moreText: 'load more',
  title: 'Links',
}

export default uncontrollable(LinksMenu, {
  linkToDelete: 'onDeleteIntent',
  linkToEdit: 'onEditIntent',
  isAddingNewLink: 'onAddingNewLink',
  limit: 'onChangeLimit'
})
