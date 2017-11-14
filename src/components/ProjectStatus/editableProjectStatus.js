import React, {PropTypes, Component} from 'react'
import ReactDOM from 'react-dom'
import PanelProject from '../PanelProject/PanelProject'
import ProjectStatusChangeConfirmation from './ProjectStatusChangeConfirmation'
import cn from 'classnames'
import _ from 'lodash'
import {
  PROJECT_ROLE_COPILOT,
  PROJECT_ROLE_MANAGER,
  PROJECT_STATUS,
  PROJECT_STATUS_COMPLETED,
  PROJECT_STATUS_CANCELLED
} from '../../config/constants'

const editableProjectStatus = (CompositeComponent) => class extends Component {
  constructor(props) {
    super(props)
    this.state = { showStatusChangeDialog : false }
    this.hideStatusChangeDialog = this.hideStatusChangeDialog.bind(this)
    this.showStatusChangeDialog = this.showStatusChangeDialog.bind(this)
    this.changeStatus = this.changeStatus.bind(this)
    this.handleReasonUpdate = this.handleReasonUpdate.bind(this)
  }

  componentWillReceiveProps() {
    this.setState({ showStatusChangeDialog : false })
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  showStatusChangeDialog(newStatus) {
    if (newStatus === PROJECT_STATUS_COMPLETED || newStatus === PROJECT_STATUS_CANCELLED) {
      this.setState({ newStatus, showStatusChangeDialog : true })
    } else {
      this.props.onChangeStatus(newStatus)
    }
  }

  hideStatusChangeDialog() {
    // set flag off for showing the status change dialog
    // resets the status change reason so that it starts from fresh on next status change
    this.setState({ showStatusChangeDialog : false, statusChangeReason: null })
  }

  changeStatus() {
    this.props.onChangeStatus(this.state.newStatus, this.state.statusChangeReason)
  }

  handleReasonUpdate(reason) {
    this.setState({ statusChangeReason : _.get(reason, 'value') })
  }

  render() {
    const { showStatusChangeDialog, newStatus, statusChangeReason } = this.state
    return (
      <div className={cn('panel', {'modal-active': showStatusChangeDialog})}>
        <div className="modal-overlay"></div>
        <CompositeComponent
          { ...this.props }
          onSelect={ this.showStatusChangeDialog }
        />
        { showStatusChangeDialog &&
          <ProjectStatusChangeConfirmation
            newStatus={ newStatus }
            onConfirm={ this.changeStatus }
            onCancel={ this.hideStatusChangeDialog }
            onReasonUpdate={ this.handleReasonUpdate }
            statusChangeReason={ statusChangeReason }
          />
        }
      </div>
    )
  }
}

export default editableProjectStatus