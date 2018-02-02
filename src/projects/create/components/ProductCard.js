import noop from 'lodash/noop'
import React from 'react'
import PT from 'prop-types'
import './ProductCard.scss'

function ProductCard(props) {
  const p = props

  let className = `ProductCard ${p.disabled ? 'disabled' : 'enabled'}`
  if (p.selected) className = `${className} selected`

  return (
    <div
      className={className}
      onClick={p.disabled ? noop : p.onClick}
    >
      <div className="icon-wrapper">{p.icon}</div>
      <h3 className="header">{p.type}</h3>
      <div className="details">{p.info}</div>
    </div>
  )
}

ProductCard.defaultTypes = {
  onClick: noop
}

ProductCard.propTypes = {
  icon: PT.element.isRequired,
  info: PT.string.isRequired,
  onClick: PT.func,
  type: PT.string.isRequired
}

export default ProductCard
