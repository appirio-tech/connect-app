import React from 'react'

const IconUICheckBold = (props) => {
  const fill = props.fill || '#62AADC'
  const height = props.height || '16'
  const width = props.width || '16'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 16 16" aria-labelledby="title">
      <title id="title">IconUICheckBold</title>
        <path fill={fill} d="M5.6 8.4L1.6 6 0 7.6 5.6 14 16 3.6 14.4 2z"/>
    </svg>
  )
}

IconUICheckBold.propTypes = {
  fill   : React.PropTypes.string,
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconUICheckBold