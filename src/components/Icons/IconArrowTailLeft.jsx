import React from 'react'

const IconArrolTailLeft = (props) => {
  const fill = props.fill || '#62AADC'
  const height = props.height || '16'
  const width = props.width || '16'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 16 16" aria-labelledby="title">
      <title id="title">IconArrolTailLeft</title>
      <path fill={fill} d="M8.121 2.707L6.707 1.293 0 8l6.707 6.707 1.414-1.414L3.828 9H16V7H3.828z"/>
    </svg>
  )
}

IconArrolTailLeft.propTypes = {
  fill   : React.PropTypes.string,
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconArrolTailLeft