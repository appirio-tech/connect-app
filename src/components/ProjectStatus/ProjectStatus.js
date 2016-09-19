import React, {PropTypes} from 'react'
import ReactDOM from 'react-dom'
import PanelProject from '../PanelProject/PanelProject'
import './ProjectStatus.scss'
import cn from 'classnames'
import _ from 'lodash'
import uncontrollable from 'uncontrollable'
import { PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER, PROJECT_STATUS } from '../../config/constants'

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
    const {directLinks, status, isOpen, currentMemberRole, onToggleOpen, onChangeStatus} = this.props
    const selected = PROJECT_STATUS.filter((opt) => opt.value === status)[0]
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
            className={cn('status-label', selected.className, {active: isOpen, editable: canEdit})}
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
                      onChangeStatus(item.value, e)
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
        {directLinks && <div className="project-direct-links">
          <ul>
            {directLinks.map((link, i) => <li key={i}><a href={link.href}>{link.name}</a></li>)}
          </ul>          
        </div>}
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
