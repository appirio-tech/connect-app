import React from 'react'
import PT from 'prop-types'
import './ProductTypeCard.scss'
import { Link } from 'react-router-dom'

function ProductTypeCard(p) {
  const className = 'ProductTypeCard enabled'
  const url = '/projects/' + p.projectId + '/specification/stage/' + p.index
  return (
    <div className={className}>
      <Link to={url} className="trigger go-home hidden" onClick={() => p.onClick(p.index)}>
        <div className="info-wrapper">
          <h1 className="header">{ p.type }</h1>
        </div>
      </Link>
    </div>
  )
}

ProductTypeCard.propTypes = {
  onClick: PT.func.isRequired,
  selected: PT.bool,
  type: PT.string.isRequired,
  buttonText: PT.string.isRequired
}

export default ProductTypeCard