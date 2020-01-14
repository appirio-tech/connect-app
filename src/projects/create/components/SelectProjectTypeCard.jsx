import _ from 'lodash'
import React from 'react'
import PT from 'prop-types'
import './SelectProjectTypeCard.scss'

function SelectProjectTypeCard(p) {
  return (
    <div
      styleName="SelectProjectTypeCard"
    >
      <div styleName="icon-wrapper">{ p.icon }</div>
      <h1 styleName="header">{ p.type }</h1>
      <div styleName="sub-type-details">{ p.info }</div>
      <button
        className="tc-btn tc-btn-sm tc-btn-primary"
        onClick={p.disabled ? _.noop : p.onClick}
      >{ p.buttonText }</button>
    </div>
  )
}

SelectProjectTypeCard.defaultProps = {
  disabled: false,
}

SelectProjectTypeCard.propTypes = {
  disabled: PT.bool,
  icon: PT.element,
  info: PT.string,
  onClick: PT.func.isRequired,
  type: PT.string.isRequired,
  buttonText: PT.string.isRequired
}

export default SelectProjectTypeCard
