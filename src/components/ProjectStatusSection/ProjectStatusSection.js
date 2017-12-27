import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import PanelProject from '../PanelProject/PanelProject'
import ProjectStatusChangeConfirmation from './ProjectStatusChangeConfirmation'
import './ProjectStatusSection.scss'
import cn from 'classnames'
import _ from 'lodash'
import {
  PROJECT_ROLE_COPILOT,
  PROJECT_ROLE_MANAGER,
  PROJECT_STATUS,
  PROJECT_STATUS_COMPLETED,
  PROJECT_STATUS_CANCELLED
} from '../../config/constants'

class ProjectStatusSection extends React.Component {

  constructor(props) {
    super(props)
    this.state = { showStatusChangeDialog : false }
    this.onClickOutside = this.onClickOutside.bind(this)
    this.hideStatusChangeDialog = this.hideStatusChangeDialog.bind(this)
    this.showStatusChangeDialog = this.showStatusChangeDialog.bind(this)
    this.changeStatus = this.changeStatus.bind(this)
    this.handleReasonUpdate = this.handleReasonUpdate.bind(this)
  }

  componentWillReceiveProps() {
    this.setState({ showStatusChangeDialog : false })
  }

  componentDidMount() {
    document.addEventListener('click', this.onClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClickOutside)
  }

  onClickOutside(e) {
    if (e.target === ReactDOM.findDOMNode(this.refs.toggleBtn)) {
      return
    }
    this.setState({ isOpen : false })
  }

  showStatusChangeDialog(newStatus) {
    if (newStatus === PROJECT_STATUS_COMPLETED || newStatus === PROJECT_STATUS_CANCELLED) {
      this.setState({ newStatus, showStatusChangeDialog : true, isOpen : false })
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
    const {directLinks, status, currentMemberRole } = this.props
    const { showStatusChangeDialog, isOpen, newStatus, statusChangeReason } = this.state
    const selected = PROJECT_STATUS.filter((opt) => opt.value === status)[0]
    const canEdit = currentMemberRole
      && _.indexOf([PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER], currentMemberRole) > -1

    return (
      <PanelProject>
        <div className={cn('panel', 'project-status-wrapper', {'modal-active': showStatusChangeDialog})}>
          <div className="modal-overlay"></div>
          <div className="project-status-section">
            <PanelProject.Heading>
              Status
            </PanelProject.Heading>
            <div
              onClick={() => canEdit && this.setState({isOpen : !isOpen})}
              ref="toggleBtn"
              className={cn('status-label', selected.color, {active: isOpen, editable : canEdit})}
            >
              <i className="status-icon"/>
              {selected.name}
            </div>
            {isOpen && <dir className="status-dropdown">
              <ul>
                {PROJECT_STATUS.sort((a, b) => a.dropDownOrder > b.dropDownOrder).map((item) =>
                  <li key={item.value}>
                    <a
                      href="javascript:"
                      className={cn({active: item.value === status})}
                      onClick={(e) => {
                        this.showStatusChangeDialog(item.value, e)
                      }}
                    >
                      <span className={item.color}><i className="status-icon"/></span>
                      {item.name}
                    </a>
                  </li>)}
              </ul>
            </dir>}
          </div>
          { showStatusChangeDialog &&
            <ProjectStatusChangeConfirmation
              newStatus={ newStatus }
              onConfirm={ this.changeStatus }
              onCancel={ this.hideStatusChangeDialog }
              onReasonUpdate={ this.handleReasonUpdate }
              statusChangeReason={ statusChangeReason }
            />
          }
          {directLinks && <div className="project-direct-links">
            <ul>
              {directLinks.map((link, i) => <li key={i}><a href={link.href} target="_blank" rel="noopener noreferrer">{link.name}</a></li>)}
            </ul>
          </div>}
        </div>
      </PanelProject>
    )
  }
}

ProjectStatusSection.propTypes = {
  currentMemberRole: PropTypes.string,
  directLinks: PropTypes.array,
  status: PropTypes.oneOf(['draft', 'active', 'in_review', 'reviewed', 'completed', 'paused', 'cancelled']).isRequired,
  onChangeStatus: PropTypes.func.isRequired
}

export default ProjectStatusSection
