import React, {PropTypes} from 'react'
import Modal from '../Modal/Modal'


class AddLink extends React.Component {
  render() {
    const {onClose, onAdd} = this.props

    const addLink = () => {
      const title = this.refs.title.value
      const href = this.refs.href.value
      if (title && href) {
        onAdd({title, href})
      }
    }
    
    return (
      <Modal onClose={onClose}>
        <Modal.Title>
          ADD A LINK
        </Modal.Title>
        <Modal.Body>
          <div className="form-group">
            <label className="tc-label">Title</label>
            <input className="tc-file-field__inputs" ref="title" type="text" placeholder="Awesome Title"/>
          </div>

          <div className="form-group">
            <label className="tc-label">Address</label>
            <input className="tc-file-field__inputs" ref="href" type="text" placeholder="https://www.topcoder.com/example"/>
          </div>

          <div className="button-area center-buttons">
            <button className="tc-btn tc-btn-primary tc-btn-sm" onClick={addLink}>Add Link</button>
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}

AddLink.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired
}

export default AddLink
