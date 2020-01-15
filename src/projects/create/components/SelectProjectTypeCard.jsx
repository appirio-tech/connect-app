import React from 'react'
import PT from 'prop-types'
import './SelectProjectTypeCard.scss'

function SelectProjectTypeCard(p) {
  const { projectType } = p
  return (
    <div
      styleName="SelectProjectTypeCard"
    >
      <div styleName="icon-wrapper">{ p.icon }</div>
      <h1 styleName="header">{ projectType.displayName }</h1>
      <div styleName="sub-type-details">{ projectType.info }</div>
      <button
        className="tc-btn tc-btn-sm tc-btn-primary"
        onClick={p.onClick}
      >{ p.buttonText }</button>
    </div>
  )
}

SelectProjectTypeCard.propTypes = {
  icon: PT.element,
  projectType: PT.any.isRequired,
  onClick: PT.func.isRequired,
  buttonText: PT.string.isRequired
}

export default SelectProjectTypeCard
