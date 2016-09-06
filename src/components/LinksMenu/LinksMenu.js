import React, {PropTypes} from 'react'
import './LinksMenu.scss'
import Panel from '../Panel/Panel'
import AddLink from './AddLink'
import uncontrollable from 'uncontrollable'
import cn from 'classnames'

const LinksMenu = ({ links, limit, canDelete, isAddingNewLink, onAddingNewLink, onAddNewLink, onChangeLimit, onDelete }) => (
  <Panel className={cn({'modal-active': isAddingNewLink})}>
    <Panel.AddBtn onClick={() => onAddingNewLink(true)}>Create New Link</Panel.AddBtn>
    <Panel.Title>
      Links ({links.length})
    </Panel.Title>
    {isAddingNewLink && <div className="modal-overlay"></div>}
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

    {!isAddingNewLink && <div className="panel-links">
      <ul>
        {links.slice(0, limit).map((link, idx) =>
          <li key={idx}>
            <a href={link.address}>{link.title}</a>
            {canDelete && <div className="buttons">
              <button onClick={() => onDelete(idx)} type="button" className="btn-remove"/>
            </div>}
          </li>)}
      </ul>
      {links.length > limit && <div className="links-footer">
        <a href="javascript:" onClick={() => onChangeLimit(10000)}>view more</a>
      </div>}
    </div>}
  </Panel>
)

LinksMenu.propTypes = {
  links: PropTypes.array.isRequired,
  limit: PropTypes.number,
  canDelete: PropTypes.bool,
  onAddingNewLink: PropTypes.func,
  onAddNewLink: PropTypes.func.isRequired,
  onChangeLimit: PropTypes.func,
  onDelete: PropTypes.func
}

LinksMenu.defaultProps = {
  limit: 7
}

export default uncontrollable(LinksMenu, {
  isAddingNewLink: 'onAddingNewLink',
  limit: 'onChangeLimit'
})
