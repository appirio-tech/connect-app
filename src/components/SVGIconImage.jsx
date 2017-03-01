import React from 'react'
import { PropTypes } from 'react'

const SVGIconImage = ({ filePath }) => (
  <img className="Icon" src={require(`../assets/images/${filePath}.svg`)} />
)

SVGIconImage.propTypes = {
  filePath: PropTypes.string
}

export default SVGIconImage
