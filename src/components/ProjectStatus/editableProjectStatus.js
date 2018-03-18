import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ProjectStatusChangeConfirmation from './ProjectStatusChangeConfirmation'
import ProjectStatus from './ProjectStatus'
import cn from 'classnames'
import _ from 'lodash'
import enhanceDropdown from 'appirio-tech-react-components/components/Dropdown/enhanceDropdown'
import {
  PROJECT_STATUS,
  PROJECT_STATUS_COMPLETED,
  PROJECT_STATUS_CANCELLED
} from '../../config/constants'
import CarretDownNormal9px from '../../assets/icons/arrow-9px-carret-down-normal.svg'


const hocStatusDropdown = (CompositeComponent) => {
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
      const selected = PROJECT_STATUS.filter((opt) => opt.value === status)[0] || PROJECT_STATUS[0]
      if (!selected) {
        return null
      }

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
              <CarretDownNormal9px className="icon-carret-down-normal"/>
            </i> }
          </div>
          { isOpen && canEdit &&
            <div className={cn('status-dropdown', { 'dropdown-up': this.shouldDropdownUp() })}>
              <div className="status-header">Project Status</div>
              <ul>
                {
                  PROJECT_STATUS.sort((a, b) => a.dropDownOrder > b.dropDownOrder).map((item) =>
                    (<li key={item.value}>
                      <a
                        href="javascript:"
                        className={cn('status-option', 'status-' + item.value, { active: item.value === status })}
                        onClick={(e) => {
                          onItemSelect(item.value, e)
                        }}
                      >
                        <ProjectStatus status={item} showText />
                      </a>
                    </li>)
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
    const { canEdit } = this.props
    const ProjectStatusDropdown = canEdit ? enhanceDropdown(hocStatusDropdown(CompositeComponent)) : hocStatusDropdown(CompositeComponent)
    return (
      <div className={cn('EditableProjectStatus', {'modal-active': showStatusChangeDialog})}>
        <div className="modal-overlay" onClick={ this.hideStatusChangeDialog }/>
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
  /**
   * Boolean flag to control editability of the project status. It does not render the dropdown if it is not editable.
   */
  canEdit: PropTypes.bool
}

export default editableProjectStatus
