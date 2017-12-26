import _ from 'lodash'
import React from 'react'
import PT from 'prop-types'
import './ProjectTypeCard.scss'

function ProjectTypeCard(p) {

  let className = `ProjectTypeCard ${p.disabled ? 'disabled' : 'enabled'}`
  if (p.selected) className = `${className} selected`

  return (
    <div
      className={className}
      onClick={p.disabled ? _.noop : p.onClick}
    >
      <div className="icon-wrapper">{ p.icon }</div>
      <h1 className="header">{ p.type }</h1>
      <div className="sub-type-details">{ p.info }</div>
      <button className="tc-btn tc-btn-sm tc-btn-primary">{ p.buttonText }</button>
    </div>
  )
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
  type: PT.string.isRequired,
  buttonText: PT.string.isRequired
}

export default ProjectTypeCard