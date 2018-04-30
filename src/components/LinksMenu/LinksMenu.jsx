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


const LinksMenu = ({ links, limit, canAdd, canDelete, canEdit,  isAddingNewLink, onAddingNewLink, onAddNewLink, onChangeLimit, linkToDelete, linkToEdit, onDeleteIntent, onEditIntent, onDelete, onEdit }) => (
  <MobileExpandable title={`LINKS (${links.length})`}>
    <Panel className={cn({'modal-active': (isAddingNewLink || linkToDelete >= 0) }, 'panel-links-container')}>
      {canAdd && !isAddingNewLink && <Panel.AddBtn onClick={() => onAddingNewLink(true)}>Create New Link</Panel.AddBtn>}
      {!isAddingNewLink && <Panel.Title>
        Links ({links.length})
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

      <div className="panel-links">
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
                    </div>
                  </li>
                )
              }
            })
          }
        </ul>
        {links.length > limit && <div className="buttons links-footer">
          <a href="javascript:" onClick={() => onChangeLimit(10000)}>View all</a>
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
  links: PropTypes.array.isRequired,
  limit: PropTypes.number,
  canAdd: PropTypes.bool,
  canDelete: PropTypes.bool,
  canEdit: PropTypes.bool,
  onAddingNewLink: PropTypes.func,
  onAddNewLink: PropTypes.func.isRequired,
  onChangeLimit: PropTypes.func,
  onDelete: PropTypes.func
}

LinksMenu.defaultProps = {
  limit: 7
}

export default uncontrollable(LinksMenu, {
  linkToDelete: 'onDeleteIntent',
  linkToEdit: 'onEditIntent',
  isAddingNewLink: 'onAddingNewLink',
  limit: 'onChangeLimit'
})
