import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SelectDropdown from 'appirio-tech-react-components/components/SelectDropdown/SelectDropdown'
import cn from 'classnames'
import { PROJECT_STATUS_COMPLETED, PROJECT_STATUS_CANCELLED } from '../../config/constants'

import './ProjectStatusChangeConfirmation.scss'

class ProjectStatusChangeConfirmation extends Component {

  constructor(props) {
    super(props)
    this.state = {showUp:false, emptyCancelReason:false}
    this.handleReasonChange = this.handleReasonChange.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
    this.shouldDropdownUp = this.shouldDropdownUp.bind(this)

  }

  componentWillMount(){
    let confirmText
    let titleStatus
    switch(this.props.newStatus) {
    case PROJECT_STATUS_COMPLETED:
      confirmText = 'Close Project'
      titleStatus = 'close'
      break
    case PROJECT_STATUS_CANCELLED:
      confirmText = 'Cancel Project'
      titleStatus = 'cancel'
      break
    default:
      confirmText = 'Confirm'
      titleStatus = 'close'
    }
    this.cancelReasons = [
      { value: null, title: '-- Select Reason --'},
      { value: "spam", title: "Spam"},
      { value: "demo", title: "Demo/Test"},
      { value: "duplicate", title: "Duplicate project"},
      { value: "join-as-member", title: "Want to join Topcoder as member"},
      { value: "price", title: "Project budget doesn't fit"},
      { value: "insufficient-input", title: "Insufficient input from Customer"},
      { value: "non-community", title: "Poor community fit"},
      { value: "customer-inactivity", title: "Customer not responsive"},
      { value: "unrealistic-timeline", title: "Unrealistic timeline"}
    ]
    this.confirmText = confirmText
    this.titleStatus = titleStatus

  }

  handleReasonChange(option){
    // after reason change, remove the error
    this.setState({emptyCancelReason:false})
    // update reason in parent component
    this.props.onReasonUpdate(option)
  }
  handleConfirm(){
    // if new status is cancelled but cancel reason is not set, show error
    if (this.props.newStatus === PROJECT_STATUS_CANCELLED && !this.props.statusChangeReason) {
      this.setState({emptyCancelReason:true})
    } else { // otherwise update the status
      this.props.onConfirm()
    }
  }
  shouldDropdownUp(){
    if (this.wrapper) {
      const bounds = this.wrapper.getBoundingClientRect()
      const windowHeight = window.innerHeight

      return bounds.top > windowHeight / 2
    }

    return false
  }

  render() {
    const { newStatus, onCancel } = this.props
    this.shouldDropdownUp()
    return (
      <div className={cn('modal', 'project-status-change-modal', { 'dropdown-up': this.state.showUp })}
        ref={(input) => { if (input && ! this.wrapper){this.wrapper = input; this.setState({showUp:this.shouldDropdownUp()}) }}}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-title danger">
          You are about to { this.titleStatus } the project
        </div>
        <div className="modal-body">
          <p className="message">
            This action will permanently change the status of your project and cannot be undone.
          </p>

          { newStatus === PROJECT_STATUS_CANCELLED &&
            <div className="cancellation-reason">
              <label>Why is this project being canceled?</label>
              <div className="select-cancellation-reason">
                <SelectDropdown
                  options={ this.cancelReasons }
                  onSelect={ this.handleReasonChange }
                  theme="default"
                  // support passing selected value for the dropdown
                />
              </div>
              { this.state.emptyCancelReason && <div className="tc-error-messages">Please select reason to cancel the project</div> }
            </div>
          }

          <div className="button-area flex center">
            <button className="tc-btn tc-btn-default tc-btn-sm btn-cancel" onClick={onCancel}>Cancel</button>
            <button className="tc-btn tc-btn-warning tc-btn-sm" onClick={ this.handleConfirm }>{ this.confirmText }</button>
          </div>
        </div>
      </div>
    )
  }
}

ProjectStatusChangeConfirmation.propTypes = {
  newStatus: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onReasonUpdate: PropTypes.func.isRequired,
  statusChangeReason: PropTypes.string
}

export default ProjectStatusChangeConfirmation
