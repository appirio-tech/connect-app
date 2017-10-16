import React from 'react'
import { PropTypes } from 'react'


const SVGIconImage = ({ filePath }) => {
  const Icon = require(`!svg-react-loader?name=Icon!../assets/images/${filePath}.svg`)
  return (
    <Icon className="Icon"  />
  )
}

SVGIconImage.propTypes = {
  filePath: PropTypes.string
}

export default SVGIconImage
