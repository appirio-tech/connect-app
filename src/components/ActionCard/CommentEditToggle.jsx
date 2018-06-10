import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import Dropdown from 'appirio-tech-react-components/components/Dropdown/Dropdown'
import DropdownItem from 'appirio-tech-react-components/components/Dropdown/DropdownItem'
import Modal from 'react-modal'

import './CommentEditToggle.scss'

export default class CommentEditToggle extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
    this.onEdit = this.onEdit.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.showDelete = this.showDelete.bind(this)
    this.cancelDelete = this.cancelDelete.bind(this)
  }

  onEdit() {
    this.props.onEdit()
  }

  showDelete() {
    this.setState({showDeleteConfirm: true})
  }

  cancelDelete() {
    this.setState({showDeleteConfirm: false})
  }

  onDelete() {
    this.setState({showDeleteConfirm: false})
    this.props.onDelete()
  }

  render() {
    const {showDeleteConfirm } = this.state
    const editOptions = {label:this.props.forTopic ? 'Edit post' : 'Edit comment', val:'1'}
    const deleteOptions = {label:this.props.forTopic ? 'Delete post' : 'Delete comment', val:'2'}
    return (
      <div className="dropdownContainer">
        <Dropdown pointerShadow className="drop-down edit-toggle-container">
          <div className={cn('dropdown-menu-header', 'edit-toggle')} title="Edit">
            <div styleName="edit-toggle-btn"><i/><i/><i/></div>
          </div>
          <div className="dropdown-menu-list down-layer">
            <ul>
              <DropdownItem key={1} item={editOptions}
                onItemClick={this.onEdit}
                currentSelection=""
              />
              {! this.props.hideDelete &&
            <DropdownItem key={2} item={deleteOptions}
              onItemClick={this.showDelete}
              currentSelection=""
            />}
            </ul>
          </div>
        </Dropdown>
        <Modal
          isOpen={ showDeleteConfirm }
          className="delete-post-dialog"
          overlayClassName="delete-post-dialog-overlay"
          onRequestClose={ this.cancelDelete }
          contentLabel=""
        >

          <div className="modal-title">
          Are you sure you want to delete this post?
          </div>

          <div className="modal-body">
          This action cannot be undone.
          </div>

          <div className="button-area flex center action-area">
            <button className="tc-btn tc-btn-default tc-btn-sm action-btn btn-cancel" onClick={this.cancelDelete}>Cancel</button>
            <button className="tc-btn tc-btn-warning tc-btn-sm action-btn " onClick={this.onDelete}>Delete Post</button>
          </div>
        </Modal>

      </div>


    )
  }
}
CommentEditToggle.propTypes = {
  forTopic: PropTypes.bool,
  hideDelete: PropTypes.bool,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
}
