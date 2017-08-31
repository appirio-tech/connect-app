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

  shouldComponentUpdate(nextProps, nextState) {
    return !(
        _.isEqual(nextProps.icon, this.props.icon)
     && _.isEqual(nextProps.label, this.props.label)
     && _.isEqual(nextProps.className, this.props.className)
     // intentionally commenting onClick comparison, assuming it won't change dynamically
     // ideally we should make this component functional i.e. remove hovered state
     // to achieve that we need to render SVG as inline svg element instead of rendering it as image
     // && _.isEqual(nextProps.onClick, this.props.onClick)
     && _.isEqual(nextState.hovered, this.state.hovered)
   )
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
