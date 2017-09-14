import _ from 'lodash'
import React, { PropTypes as PT } from 'react'
import './ProjectTypeCard.scss'

class ProjectTypeCard extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const p = this.props
    const s = this.state
    const icon = React.cloneElement(p.icon, {
      color: !p.disabled && s.hovered ? '#1A85FF' : '#5D5D66'
    })

    let className = `ProjectTypeCard ${p.disabled ? 'disabled' : 'enabled'}`
    if (p.selected) className = `${className} selected`

    return (
      <div
        className={className}
        onClick={p.disabled ? _.noop : this.props.onClick}
        onMouseEnter={() => this.setState({ hovered: true })}
        onMouseLeave={() => this.setState({ hovered: false })}
      >
        {icon}
        <h1 className="header">{p.type}</h1>
        <div className="sub-type-details">{p.info}</div>
        <button className="tc-btn tc-btn-sm tc-btn-primary">Select project</button>
      </div>
    )
  }
}

ProjectTypeCard.defaultProps = {
  disabled: false,
  selected: false
}

ProjectTypeCard.propTypes = {
  disabled: PT.bool,
  icon: PT.element.isRequired,
  info: PT.string.isRequired,
  onClick: PT.func.isRequired,
  selected: PT.bool,
  type: PT.string.isRequired
}

export default ProjectTypeCard