import React, {PropTypes} from 'react'
import cn from 'classnames'

export default class CommentEditToggle extends React.Component {

  constructor(props) {
    super(props)
    this.state = {isOpen: false}
    this.onEdit = this.onEdit.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.showDelete = this.showDelete.bind(this)
    this.cancelDelete = this.cancelDelete.bind(this)
    this.onClickOutside = this.onClickOutside.bind(this)
  }

  componentDidMount() {
    document.removeEventListener('click', this.onClickOutside)
    document.addEventListener('click', this.onClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClickOutside)
  }

  onClickOutside(evt) {
    if (!this.state.isOpen) {
      return
    }

    let currNode = evt.target
    let isInToggle = false

    do {
      if (currNode === this.refs.editToggleContainer) {
        isInToggle = true
        break
      }

      currNode = currNode.parentNode

      if(!currNode)
        break
    } while(currNode.tagName)

    if (!isInToggle) {
      this.setState({isOpen: false})
    }
  }

  onEdit() {
    this.setState({isOpen: false})
    this.props.onEdit()
  }

  showDelete() {
    this.setState({showDeleteConfirm: true})
  }

  cancelDelete() {
    this.setState({isOpen: false, showDeleteConfirm: false})
  }

  onDelete() {
    this.setState({isOpen: false})
    this.props.onDelete()
  }

  render() {
    const { isOpen, showDeleteConfirm } = this.state

    return (
      <div className="edit-toggle-container" ref="editToggleContainer">
        <div className={cn('edit-toggle', {'for-topic': this.props.forTopic})} onClick={() => this.setState({isOpen: !isOpen, showDeleteConfirm: false})}>
        </div>
        {
          (isOpen) &&
          <dir className="edit-dropdown">
            <ul className={cn({hide: showDeleteConfirm})}>
              <li><a href="javascript:" onClick={this.onEdit}>{this.props.forTopic ? 'Edit post' : 'Edit comment'}</a></li>
              {!this.props.hideDelete && <li><a href="javascript:" onClick={this.showDelete}>{this.props.forTopic ? 'Delete post' : 'Delete comment'}</a></li>}
            </ul>
            <div className={cn('delete-confirm', {hide: !showDeleteConfirm})}>
              <h4>Confirm to delete {this.props.forTopic ? 'post' : 'comment'}</h4>
              <div className="delete-confirm-btns">
                <button className="tc-btn tc-btn-primary tc-btn-xs" onClick={this.cancelDelete} type="button">Cancel</button>
                <button className="tc-btn tc-btn-primary tc-btn-xs" onClick={this.onDelete} type="button">Delete</button>
              </div>
            </div>
          </dir>
        }
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
