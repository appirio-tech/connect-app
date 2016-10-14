import React, {PropTypes} from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-modal'
import PanelProject from '../PanelProject/PanelProject'
import ProjectStatusChangeConfirmation from './ProjectStatusChangeConfirmation'
import './ProjectStatus.scss'
import cn from 'classnames'
import _ from 'lodash'
import uncontrollable from 'uncontrollable'
import { Icons } from 'appirio-tech-react-components'
import { PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER, PROJECT_STATUS } from '../../config/constants'

class ProjectStatus extends React.Component {

  constructor(props) {
    super(props)
    this.state = { showStatusChangeDialog : false }
    this.onClickOutside = this.onClickOutside.bind(this)
    this.hideStatusChangeDialog = this.hideStatusChangeDialog.bind(this)
    this.showStatusChangeDialog = this.showStatusChangeDialog.bind(this)
    this.changeStatus = this.changeStatus.bind(this)
  }

  componentDidMount() {
    document.addEventListener('click', this.onClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClickOutside)
  }

  onClickOutside(e) {
    const {onToggleOpen} = this.props
    if (e.target === ReactDOM.findDOMNode(this.refs.toggleBtn)) {
      return
    }
    onToggleOpen(false, e)
  }

  showStatusChangeDialog(newStatus, e) {
    if (newStatus === 'completed' || newStatus === 'cancelled') {
      this.setState({  newStatus, showStatusChangeDialog : true })
    } else {
      this.setState({  newStatus, showStatusChangeDialog : true })
      // this.props.onChangeStatus(newStatus)
    }
  }

  hideStatusChangeDialog() {
    this.setState({ showStatusChangeDialog : false })
  }

  changeStatus() {
    this.props.onChangeStatus(this.state.newStatus)
  }

  render() {
    const {directLinks, status, isOpen, currentMemberRole, onToggleOpen, onChangeStatus } = this.props
    const { showStatusChangeDialog } = this.state
    const selected = PROJECT_STATUS.filter((opt) => opt.value === status)[0]
    const canEdit = currentMemberRole
      && _.indexOf([PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER], currentMemberRole) > -1

    return (
      <PanelProject>
        <div className={cn('panel', 'project-status-wrapper', {'modal-active': showStatusChangeDialog})}>
          <div className="modal-overlay"></div>
          <div className="project-status">
            <PanelProject.Heading>
              Status
            </PanelProject.Heading>
            <div
              onClick={(e) => canEdit && onToggleOpen(!isOpen, e)}
              ref="toggleBtn"
              className={cn('status-label', selected.color, {active: isOpen, editable : canEdit})}
            >
              <i className="status-icon"/>
              {selected.name}
            </div>
            {isOpen && <dir className="status-dropdown">
              <ul>
                {PROJECT_STATUS.map((item) =>
                  <li key={item.value}>
                    <a
                      href="javascript:"
                      className={cn({active: item.value === status})}
                      onClick={(e) => {
                        this.showStatusChangeDialog(item.value, e)
                        onToggleOpen(false, e)
                      }}
                    >
                      <span className={item.color}><i className="status-icon"/></span>
                      {item.name}
                    </a>
                  </li>)}
              </ul>
            </dir>}
          </div>
          { showStatusChangeDialog && <ProjectStatusChangeConfirmation onConfirm={ this.changeStatus } onCancel={ this.hideStatusChangeDialog } /> }
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

ProjectStatus.propTypes = {
  isOpen: PropTypes.bool,
  currentMemberRole: PropTypes.string,
  directLinks: PropTypes.array,
  onToggleOpen: PropTypes.func,
  status: PropTypes.oneOf(['draft', 'active', 'in_review', 'reviewed', 'completed', 'paused', 'cancelled']).isRequired,
  onChangeStatus: PropTypes.func.isRequired
}

export default uncontrollable(ProjectStatus, {
  isOpen: 'onToggleOpen'
})
