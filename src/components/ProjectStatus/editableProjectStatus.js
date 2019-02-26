import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ProjectStatusChangeConfirmation from './ProjectStatusChangeConfirmation'
import cn from 'classnames'
import _ from 'lodash'
import enhanceDropdown from 'appirio-tech-react-components/components/Dropdown/enhanceDropdown'
import Tooltip from 'appirio-tech-react-components/components/Tooltip/Tooltip'
import {
  PROJECT_STATUS,
  PROJECT_STATUS_ACTIVE,
  PROJECT_STATUS_COMPLETED,
  PROJECT_STATUS_CANCELLED,
  TOOLTIP_DEFAULT_DELAY
} from '../../config/constants'
import CarretDownNormal9px from '../../assets/icons/arrow-9px-carret-down-normal.svg'


const hocStatusDropdown = (CompositeComponent, statusList, projectCanBeActive) => {
  class StatusDropdown extends Component {
    shouldDropdownUp() {
      if (this.refs.dropdown) {
        const bounds = this.refs.dropdown.getBoundingClientRect()
        const windowHeight = window.innerHeight

        return bounds.top > windowHeight / 2
      }

      return false
    }

    render() {
      const { canEdit, isOpen, handleClick, onItemSelect, showText, withoutLabel, unifiedHeader, status } = this.props
      const selected = statusList.filter((opt) => opt.value === status)[0] || PROJECT_STATUS[0]
      if (!selected) {
        return null
      }

      const activestatusList = statusList.map((status) => ({
        ...status,
        disabled: !projectCanBeActive && status.value === PROJECT_STATUS_ACTIVE,
        toolTipMessage: (!projectCanBeActive && status.value === PROJECT_STATUS_ACTIVE) ? 'To activate project there should be at least one phase in "Planned" status. Please, check "Project Plan" tab.' : null,
      }))

      this.shouldDropdownUp()
      return (
        <div className="project-status-dropdown" ref="dropdown">
          <div
            className={cn('status-header', 'status-' + selected.value, { active: isOpen, editable: canEdit })}
            onClick={handleClick}
          >
            <CompositeComponent
              status={selected}
              showText={showText}
              withoutLabel={withoutLabel}
              unifiedHeader={unifiedHeader}
            />
            { canEdit && <i className="caret" >
              <CarretDownNormal9px className="icon-carret-down-normal" />
            </i> }
          </div>
          { isOpen && canEdit &&
            <div className={cn('status-dropdown', { 'dropdown-up': this.shouldDropdownUp() })}>
              <div className="status-header">Project Status</div>
              <ul>
                {
                  activestatusList.sort((a, b) => a.dropDownOrder > b.dropDownOrder).map((item) =>
                    item.toolTipMessage ? (
                      <Tooltip key={item.value} theme="light" tooltipDelay={TOOLTIP_DEFAULT_DELAY}>
                        <div className="tooltip-target">
                          <li>
                            <a
                              href="javascript:"
                              className={cn('status-option', 'status-' + item.value, { active: item.value === status, disabled: item.disabled })}
                              onClick={(e) => {
                                if (!item.disabled)
                                  onItemSelect(item.value, e)
                              }}
                            >
                              <CompositeComponent status={item} showText />
                            </a>
                          </li>
                        </div>
                        <div className="tooltip-body">
                          {item.toolTipMessage}
                        </div>
                      </Tooltip>
                    ) : (
                      <div key={item.value} className="tooltip-target">
                        <li>
                          <a
                            href="javascript:"
                            className={cn('status-option', 'status-' + item.value, { active: item.value === status, disabled: item.disabled })}
                            onClick={(e) => {
                              if (!item.disabled)
                                onItemSelect(item.value, e)
                            }}
                          >
                            <CompositeComponent status={item} showText />
                          </a>
                        </li>
                      </div>
                    )
                  )
                }
              </ul>
            </div>
          }
        </div>
      )
    }
  }

  return StatusDropdown
}

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
      (this.props.projectId) ? this.props.onChangeStatus(this.props.projectId, newStatus) : this.props.onChangeStatus(newStatus)
    }
  }

  hideStatusChangeDialog() {
    // set flag off for showing the status change dialog
    // resets the status change reason so that it starts from fresh on next status change
    this.setState({ showStatusChangeDialog : false, statusChangeReason: null })
  }

  changeStatus() {
    (this.props.projectId) ?
      this.props.onChangeStatus(this.props.projectId, this.state.newStatus, this.state.statusChangeReason)
      : this.props.onChangeStatus(this.state.newStatus, this.state.statusChangeReason)

  }

  handleReasonUpdate(reason) {
    this.setState({ statusChangeReason : _.get(reason, 'value') })
  }

  render() {
    const { showStatusChangeDialog, newStatus, statusChangeReason } = this.state
    const { canEdit, projectCanBeActive } = this.props
    const StatusDropdown = canEdit
      ? enhanceDropdown(hocStatusDropdown(CompositeComponent, PROJECT_STATUS, projectCanBeActive))
      : hocStatusDropdown(CompositeComponent, PROJECT_STATUS, projectCanBeActive)
    return (
      <div className={cn('EditableProjectStatus', {'modal-active': showStatusChangeDialog})}>
        <div className="modal-overlay" onClick={ this.hideStatusChangeDialog }/>
        <StatusDropdown {...this.props } onItemSelect={ this.showStatusChangeDialog } />
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
  /**
   * Boolean flag to control editability of the project status. It does not render the dropdown if it is not editable.
   */
  canEdit: PropTypes.bool,
  /**
   * Boolean flag to control if project status can be switched to active.
   */
  projectCanBeActive: PropTypes.bool
}

export default editableProjectStatus
