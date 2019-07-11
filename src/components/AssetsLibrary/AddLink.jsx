import React from 'react'
import PropTypes from 'prop-types'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'

import Modal from '../Modal/Modal'
const TCFormFields = FormsyForm.Fields
const Formsy = FormsyForm.Formsy

import './AddLink.scss'

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

  componentDidMount() {
    document.body.classList.add('new-link-dialog-no-scroll')
  }

  componentWillUnmount() {
    document.body.classList.remove('new-link-dialog-no-scroll')
  }

  render() {
    const {onClose, onAdd} = this.props
    const {canSubmit} = this.state
    return (
      <div styleName="new-link-dialog-bg">
        <Modal
          isOpen
          onClose={onClose}
          styleName="new-link-dialog"
          overlayClassName="new-link-dialog-overlay"
          contentLabel=""
        >
          <Modal.Title>
            ADD A LINK
          </Modal.Title>
          <Modal.Body>
            <Formsy.Form onValidSubmit={onAdd} onValid={this.enableSubmitBtn} onInvalid={this.disableSubmitBtn}>
              <TCFormFields.TextInput
                name="title"
                label="Name"
                type="text"
                validations="isRequired"
                validationError="Name is required"
                maxLength={250}
                wrapperClass="form-group"
              />
              <TCFormFields.TextInput
                name="address"
                label="URL"
                type="text"
                validationError="URL is required."
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
      </div>
    )
  }
}

AddLink.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
}

export default AddLink
