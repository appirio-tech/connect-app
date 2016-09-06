import React, {PropTypes} from 'react'
import ReactDOM from 'react-dom'
import PanelProject from '../PanelProject/PanelProject'
import './ProjectStatus.scss'
import cn from 'classnames'
import _ from 'lodash'
import uncontrollable from 'uncontrollable'
import { PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER } from '../../config/constants'

const statusOptions = [
  {className: 'draft', name: 'Draft', value: 'draft'},
  {className: 'working', name: 'Working', value: 'active'},
  {className: 'draft', name: 'In Review', value: 'in_review'},
  {className: 'working', name: 'Reviewed', value: 'reviewed'},
  {className: 'completed', name: 'Completed', value: 'completed'},
  {className: 'paused', name: 'Paused', value: 'paused'},
  {className: 'error', name: 'Cancelled', value: 'cancelled'}
]

class ProjectStatus extends React.Component {

  constructor(props) {
    super(props)
    this.onClickOutside = this.onClickOutside.bind(this)
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

  render() {
    const {status, isOpen, currentMemberRole, onToggleOpen, onChangeStatus} = this.props

    const selected = statusOptions.filter((opt) => opt.value === status)[0]
    const canEdit = currentMemberRole
      && _.indexOf([PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER], currentMemberRole) > -1

    return (
      <PanelProject>
        <div className="project-status">
          <PanelProject.Heading>
            Status
          </PanelProject.Heading>
          <div
            onClick={(e) => canEdit && onToggleOpen(!isOpen, e)}
            ref="toggleBtn"
            className={cn('status-label', selected.className, {active: isOpen})}
          >
            <i className="status-icon"/>
            {selected.name}
          </div>
          {isOpen && <dir className="status-dropdown">
            <ul>
              {statusOptions.map((item) =>
                <li key={item.value}>
                  <a
                    href="javascript:"
                    className={cn({active: item.value === status})}
                    onClick={(e) => {
                      onChangeStatus(item.value, e)
                      onToggleOpen(false, e)
                    }}
                  >
                    <span className={item.className}><i className="status-icon"/></span>
                    {item.name}
                  </a>
                </li>)}
            </ul>
          </dir>}
        </div>
      </PanelProject>
    )
  }
}

ProjectStatus.propTypes = {
  isOpen: PropTypes.bool,
  currentMemberRole: PropTypes.string,
  onToggleOpen: PropTypes.func,
  status: PropTypes.oneOf(['draft', 'active', 'in_review', 'reviewed', 'completed', 'paused', 'cancelled']).isRequired,
  onChangeStatus: PropTypes.func.isRequired
}

export default uncontrollable(ProjectStatus, {
  isOpen: 'onToggleOpen'
})
