import React from 'react'

const IconArrowPriorityLow = (props) => {
  const fill = props.fill || '#62AADC'
  const height = props.height || '16'
  const width = props.width || '16'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 16 16" aria-labelledby="title">
      <title id="title">IconArrowPriorityLow</title>
      <path fill={fill} d="M11 2h5v2h-5zM11 6h5v2h-5zM11 10h5v2h-5zM5 12v3l4-4-4-4v3c-1.654 0-3-1.346-3-3s1.346-3 3-3h4V2H5C2.243 2 0 4.243 0 7s2.243 5 5 5z"/></svg>
  )
}

IconArrowPriorityLow.propTypes = {
  fill   : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconArrowPriorityLow