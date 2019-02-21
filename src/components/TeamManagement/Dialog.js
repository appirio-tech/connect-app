import React from 'react'
import Modal from 'react-modal'
import PT from 'prop-types'
import SelectDropdown from '../SelectDropdown/SelectDropdown'


class Dialog extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      role: 'manager'
    }

    this.roles = [{
      title: 'Manager',
      value: 'manager',
    }, {
      title: 'Observer',
      value: 'observer',
    }, {
      title: 'Account Manager',
      value: 'account_manager',
    }]

    this.handleRoles = this.handleRoles.bind(this)
    this.onConfirm = this.onConfirm.bind(this)
  }

  handleRoles(option) {
    this.setState({
      role: option.value
    })
  }

  onConfirm() {
    if(this.props.showRoleSelector) {
      this.props.onConfirm(this.state.role)
    } else {
      this.props.onConfirm()
    }

  }

  render()
  {
    const {onCancel, title, content, buttonColor, buttonText, disabled, showRoleSelector} = this.props

    return (
      <Modal
        isOpen
        className="management-dialog"
        overlayClassName="management-dialog-overlay"
        onRequestClose={onCancel}
        shouldCloseOnOverlayClick={!disabled}
        shouldCloseOnEsc={!disabled}
        contentLabel=""
      >
        <div className="management-dialog-container">
          <div className="dialog-title">{title}</div>
          <div className="dialog-content" dangerouslySetInnerHTML={{__html: content}}/>
          {showRoleSelector && <Formsy.Form className="input-container">
            <SelectDropdown
              name="role"
              value={this.state.role}
              theme="role-drop-down default"
              options={this.roles}
              onSelect={this.handleRoles}
            />
          </Formsy.Form>}
          <div className="dialog-actions">
            <button
              onClick={onCancel}
              className="tc-btn tc-btn-default"
              disabled={disabled}
            >
              Cancel
            </button>
            <button
              onClick={this.onConfirm}
              className={'tc-btn tc-btn-primary tc-btn-md ' + (buttonColor !== 'blue' ? 'btn-red' : '')}
              disabled={disabled}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </Modal>
    )
  }
}

Dialog.propTypes = {
  showRoleSelector: false
}

Dialog.propTypes = {
  onCancel: PT.func,
  onConfirm: PT.func,
  title: PT.string,
  content: PT.string,
  buttonColor: PT.string,
  buttonText: PT.string,
  showRoleSelector: PT.bool,
}

export default Dialog
