import React, {PropTypes} from 'react'
import ReactDOM from 'react-dom'
import PanelProject from '../PanelProject/PanelProject'
import './ProjectStatus.scss'
import cn from 'classnames'
import uncontrollable from 'uncontrollable'


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
    const {status, isOpen, onToggleOpen, onChangeStatus} = this.props
    const options = [
      {className: 'draft', name: 'Draft', value: 'draft'},
      {className: 'working', name: 'Working', value: 'active'},
      {className: 'draft', name: 'In Review', value: 'in_review'},
      {className: 'working', name: 'Reviewed', value: 'reviewed'},
      {className: 'completed', name: 'Completed', value: 'completed'},
      {className: 'error', name: 'Paused', value: 'paused'},
      {className: 'error', name: 'Cancelled', value: 'cancelled'}
    ]
    const selected = options.filter((opt) => opt.value === status)[0]
    return (
      <PanelProject>
        <div className="project-status">
          <PanelProject.Heading>
            Status
          </PanelProject.Heading>
          <div
            onClick={(e) => onToggleOpen(!isOpen, e)}
            ref="toggleBtn"
            className={cn('status-label', selected.className, {active: isOpen})}
          >
            <i className="status-icon"/>
            {selected.name}
          </div>
          {isOpen && <dir className="status-dropdown">
            <ul>
              {options.map((item) =>
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
  onToggleOpen: PropTypes.func,
  status: PropTypes.oneOf(['draft', 'active', 'in_review', 'reviewed', 'completed', 'paused', 'cancelled']).isRequired,
  onChangeStatus: PropTypes.func.isRequired
}

export default uncontrollable(ProjectStatus, {
  isOpen: 'onToggleOpen'
})
