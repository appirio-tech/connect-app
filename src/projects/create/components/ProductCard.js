import _ from 'lodash'
import React, { PropTypes as PT } from 'react'
import './ProductCard.scss'

function ProductCard(props) {
  const p = props

  let className = `ProductCard ${p.disabled ? 'disabled' : 'enabled'}`
  if (p.selected) className = `${className} selected`

  return (
    <div
      className={className}
      onClick={p.disabled ? _.noop : props.onClick}
    >
      <div className="icon-wrapper">{p.icon}</div>
      <h1 className="header">{p.type}</h1>
      <div className="sub-type-details">{p.info}</div>
      <button className="tc-btn tc-btn-sm tc-btn-primary">Create project</button>
    </div>
  )
}

ProductCard.defaultProps = {
  disabled: false,
  selected: false
}

ProductCard.propTypes = {
  disabled: PT.bool,
  icon: PT.element.isRequired,
  info: PT.string.isRequired,
  onClick: PT.func.isRequired,
  selected: PT.bool,
  type: PT.string.isRequired
}

export default ProductCard
