import React from 'react'
import PropTypes from 'prop-types'
import { TagSelect } from '../TagSelect/TagSelect'

export class EditLinkModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      title : props.link.title,
      address : props.link.path,
      tags: props.link.tags
    }
  }

  handleTitleChange(event) {
    this.setState({title: event.target.value})
  }

  handleAddressChange(event) {
    this.setState({ address: event.target.value})
    this.isURLValid()
  }

  handleTagsChange(tags) {
    this.setState({tags})
  }

  isURLValid() {
    return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/.test(this.state.address)
  }

  render() {
    const { onCancel, onConfirm } = this.props
    const { title, address, tags } = this.state
    return (
      <div className="modal delete-link-modal">
        <div className="modal-title danger">
        You're about to edit a link
        </div>
        <div className="modal-body">
          {/* Title */}
          <label htmlFor="title">Title:</label>
          <input className="edit-input" type="text" value={title} onChange={this.handleTitleChange.bind(this)} name="title"/>
          <br />

          {/* Link Address (URL) */}
          <label htmlFor="address">Address:</label>
          <input className="edit-input" type="text" value={address} onChange={this.handleAddressChange.bind(this)}
            name="address"
          />
          <br />

          {/* Tags */}
          <label htmlFor="tags">Tags (optional):</label>
          <TagSelect
            onUpdate={this.handleTagsChange.bind(this)}
            selectedTags={tags}
          />
          <br/>

          <div className="button-area flex center">
            <button className="tc-btn tc-btn-default tc-btn-sm btn-cancel" onClick={onCancel}>Cancel</button>
            {this.isURLValid() ? <button className="tc-btn tc-btn-warning tc-btn-sm" onClick={() => onConfirm(title, address, tags)}>Edit link</button>
              : <button className="tc-btn tc-btn-warning tc-btn-sm" disabled>Edit link</button>}
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
