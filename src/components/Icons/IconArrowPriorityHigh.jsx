import React from 'react'

const IconArrowPriorityHigh = (props) => {
  const fill = props.fill || '#62AADC'
  const height = props.height || '16'
  const width = props.width || '16'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 16 16" aria-labelledby="title">
      <title id="title">IconArrowPriorityHigh</title>
      <path fill={fill} d="M11 12h5v2h-5zM11 8h5v2h-5zM11 4h5v2h-5zM5 14h4v-2H5c-1.654 0-3-1.346-3-3s1.346-3 3-3v3l4-4-4-4v3C2.243 4 0 6.243 0 9s2.243 5 5 5z"/>
    </svg>
  )
}

IconArrowPriorityHigh.propTypes = {
  fill   : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconArrowPriorityHigh