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
      color: !p.disabled && s.hovered ? 'blue' : 'black'
    })
    return (
      <div
        className={`ProjectTypeCard ${p.disabled ? 'disabled' : 'enabled'}`}
        onClick={p.disabled ? _.noop : p.onClick}
        onMouseEnter={() => this.setState({ hovered: true })}
        onMouseLeave={() => this.setState({ hovered: false })}
      >
        {icon}
        <h1 className="header">{p.type}</h1>
        <div className="details">{p.info}</div>
        <div className="button">Create project</div>
      </div>
    )
  }
}

ProjectTypeCard.defaultTypes = {
  onClick: _.noop
}

ProjectTypeCard.propTypes = {
  icon: PT.element.isRequired,
  info: PT.string.isRequired,
  onClick: PT.func,
  type: PT.string.isRequired
}

export default ProjectTypeCard
