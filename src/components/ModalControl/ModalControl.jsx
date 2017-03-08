/**
 * A modal control button: a user-specified icon inside gray circle
 * (40 px diameter), which turns blue when hovered, and a gray uppercase
 * label underneath. The onClick() callback is triggered on click.
 */

import _ from 'lodash'
import React, { PropTypes as PT } from 'react'
import './ModalControl.scss'

class ModalControl extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    let icon = this.props.icon
    if (icon) icon = React.cloneElement(icon, {
      color: this.state.hovered ? 'white' : '#5D5D66'
    })
  
    return (
      <div
        className={`ModalControl ${this.props.className}`}
        onClick={this.props.onClick}
        onMouseEnter={() => this.setState({ hovered: true })}
        onMouseLeave={() => this.setState({ hovered: false })}
      >
        <div className="bubble">
          <span className="icon-wrapper">{icon}</span>
        </div>
        <div className="label">{this.props.label}</div>
      </div>
    )
  }
}

ModalControl.defaultProps = {
  className: '',
  icon: null,
  label: '',
  onClick: _.noop
}

ModalControl.propTypes = {
  className: PT.string,
  icon: PT.element,
  label: PT.string
}

export default ModalControl
