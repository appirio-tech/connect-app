/**
 * A modal control button: a user-specified icon inside gray circle
 * (40 px diameter), which turns blue when hovered, and a gray uppercase
 * label underneath. The onClick() callback is triggered on click.
 */

import noop from 'lodash/noop'
import React from 'react'
import PT from 'prop-types'
import './ModalControl.scss'

function ModalControl(props) {

  return (
    <div
      className={`ModalControl ${props.className}`}
      onClick={props.onClick}
    >
      <div className="bubble">
        <span className="icon-wrapper">{props.icon}</span>
      </div>
      <div className="label">{props.label}</div>
    </div>
  )
}

ModalControl.defaultProps = {
  className: '',
  icon: null,
  label: '',
  onClick: noop
}

ModalControl.propTypes = {
  className: PT.string,
  icon: PT.element,
  label: PT.string
}

export default ModalControl
