import React, { PropTypes } from 'react'
import './SVGNumberText.scss'

const SVGIconImage = ({ number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42">
    <text x="21" y="42" className="screen-number" textAnchor="middle">
      {number}
    </text>
  </svg>
)

SVGIconImage.propTypes = {
  number: PropTypes.string
}

export default SVGIconImage
