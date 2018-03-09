import React from 'react'
import PropTypes from 'prop-types'

export class EditLinkModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      title : props.link.title,
      address : props.link.address
    }
  }

  handleTitleChange(event) {
    this.setState({title: event.target.value})
  }

  handleAddressChange(event) {
    this.setState({ address: event.target.value})
    this.isURLValid()
  }

  isURLValid() {
    return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/.test(this.state.address)
  }

  render() {
    const { onCancel, onConfirm } = this.props
    const { title, address } = this.state
    return (
      <div className="modal delete-link-modal">
        <div className="modal-title danger">
        You're about to edit a link
        </div>
        <div className="modal-body">
          <label for="title">Title:</label>
          <input className="edit-input" type="text" value={title} onChange={this.handleTitleChange.bind(this)} name="title"/> 
          <br />
          <label for="address">Address:</label>
          <input className="edit-input" type="text" value={address} onChange={this.handleAddressChange.bind(this)} 
            name="address"
          />
          <br />

          <div className="button-area flex center">
            <button className="tc-btn tc-btn-default tc-btn-sm btn-cancel" onClick={onCancel}>Cancel</button>
            {this.isURLValid() ? <button className="tc-btn tc-btn-warning tc-btn-sm" onClick={() => onConfirm(title, address)}>Edit link</button>
              : <button className="tc-btn tc-btn-warning tc-btn-sm" onClick={() => onConfirm(title, address)} disabled>Edit link</button>}
          </div>
        </div>
      </div>
    )}
}

EditLinkModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
  // link: PropTypes.object.isRequired
}

export default EditLinkModal
