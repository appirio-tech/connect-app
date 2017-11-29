import React, { Component, PropTypes } from 'react'
import ProjectStatusChangeConfirmation from './ProjectStatusChangeConfirmation'
import ProjectStatus from './ProjectStatus'
import cn from 'classnames'
import _ from 'lodash'
import { enhanceDropdown } from 'appirio-tech-react-components'
import SVGIconImage from '../SVGIconImage'
import {
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

  renderDropdown(props) {
    const { canEdit, isOpen, handleClick, onItemSelect, showText, withoutLabel, unifiedHeader, status } = props
    const selected = PROJECT_STATUS.filter((opt) => opt.value === status)[0]
    return (
      <div className="project-status-dropdown">
        <div className={cn('status-header', 'ps-' + selected.value, { active: isOpen, editable: canEdit })} onClick={handleClick}>
          <CompositeComponent
            status={selected}
            showText={showText}
            withoutLabel={withoutLabel}
            unifiedHeader={unifiedHeader}
          />
          { canEdit && <i className="caret" ><SVGIconImage filePath="arrow-9px-carret-down-normal" /></i> }
        </div>
        { isOpen && canEdit &&
          <div className="status-dropdown">
            <div className="status-header">Project Status</div>
            <ul>
              {
                PROJECT_STATUS.map((item) =>
                  <li key={item.value}>
                    <a
                      href="javascript:"
                      className={cn('status-option', 'ps-' + item.value, { active: item.value === status })}
                      onClick={(e) => {
                        onItemSelect(item.value, e)
                      }}
                    >
                      <ProjectStatus status={item} showText />
                    </a>
                  </li>
                )
              }
            </ul>
          </div>
        }
      </div>
    )
  }

  render() {
    const { showStatusChangeDialog, newStatus, statusChangeReason } = this.state
    const { canEdit } = this.props
    const ProjectStatusDropdown = canEdit ? enhanceDropdown(this.renderDropdown) : this.renderDropdown
    return (
      <div className={cn('panel', 'EditableProjectStatus', {'modal-active': showStatusChangeDialog})}>
        <div className="modal-overlay"></div>
        <ProjectStatusDropdown {...this.props } onItemSelect={ this.showStatusChangeDialog } />
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

editableProjectStatus.propTypes = {
  canEdit: PropTypes.boolean,
  isOpen: PropTypes.boolean,
  handleClick: PropTypes.func,
  onSelect : PropTypes.func
}

export default editableProjectStatus