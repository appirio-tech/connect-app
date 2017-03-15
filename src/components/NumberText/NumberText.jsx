import React, { PropTypes } from 'react'
import './NumberText.scss'

const IconImage = ({ number }) => (
  <span className="screen-number">{number}</span>
)

IconImage.propTypes = {
  number: PropTypes.string
}

export default IconImage
