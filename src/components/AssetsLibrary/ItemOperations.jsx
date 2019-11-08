import React from 'react'
import PropTypes from 'prop-types'
import Dropdown from 'appirio-tech-react-components/components/Dropdown/Dropdown'
import DropdownItem from 'appirio-tech-react-components/components/Dropdown/DropdownItem'

import './ItemOperations.scss'

class ItemOperations extends React.Component {

  render() {
    const {canEdit, canDelete, handleEditClick, handleDeleteClick } = this.props
    const editOptions = {label:'Edit', val:'1'}
    const deleteOptions = {label:'Remove', val:'2'}
    return (
      <Dropdown pointerShadow className="drop-down edit-toggle-container">
        <div className="dropdown-menu-header edit-toggle">
          <div styleName="edit-toggle-btn"><i/><i/><i/></div>
        </div>
        <div className="dropdown-menu-list down-layer">
          <ul>
            {canEdit &&
            <DropdownItem key={1} item={editOptions}
              onItemClick={handleEditClick}
              currentSelection=""
            />}
            {canDelete &&
            <DropdownItem key={2} item={deleteOptions}
              onItemClick={handleDeleteClick}
              currentSelection=""
            />}
          </ul>
        </div>
      </Dropdown>
    )
  }
}

ItemOperations.defaultProps = {
  canEdit: false,
  canDelete: false,
  handleEditClick:  () => {},
  handleDeleteClick: () => {},
}

ItemOperations.propTypes = {
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
  handleEditClick:  PropTypes.func,
  handleDeleteClick: PropTypes.func,
}

export default ItemOperations
