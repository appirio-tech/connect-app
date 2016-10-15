import React, {PropTypes} from 'react'
import Modal from '../Modal/Modal'
import { Formsy, TCFormFields } from 'appirio-tech-react-components'

class AddLink extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      canSubmit: false,
      newLink: {}
    }
    this.enableSubmitBtn = this.enableSubmitBtn.bind(this)
    this.disableSubmitBtn = this.disableSubmitBtn.bind(this)
  }

  enableSubmitBtn() {
    this.setState({ canSubmit: true })
  }

  disableSubmitBtn() {
    this.setState({ canSubmit: false })
  }

  render() {
    const {onClose, onAdd} = this.props
    const {canSubmit} = this.state
    return (
      <Modal onClose={onClose}>
        <Modal.Title>
          ADD A LINK
        </Modal.Title>
        <Modal.Body>
          <Formsy.Form onValidSubmit={onAdd} onValid={this.enableSubmitBtn} onInvalid={this.disableSubmitBtn}>
            <TCFormFields.TextInput
              name="title"
              label="Title"
              type="text"
              validations="isRequired"
              validationError="Title is required"
              maxLength={250}
              wrapperClass="form-group"
            />
            <TCFormFields.TextInput
              name="address"
              label="Address"
              type="text"
              validationError="This is a required field."
              validations={{
                isRelaxedUrl: true,
                isRequired: true
              }}
              validationErrors={{
                isRelaxedUrl: 'Please enter a valid URL'
              }}
              wrapperClass="form-group"
            />
            <div className="button-area center-buttons">
              <button className="tc-btn tc-btn-primary tc-btn-sm" type="submit" disabled={!canSubmit}>
                Add Link
              </button>
            </div>
          </Formsy.Form>
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
