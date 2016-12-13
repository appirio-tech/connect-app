import React from 'react'

const IconArrowSelect = (props) => {
  const fill = props.fill || '#62AADC'
  const height = props.height || '16'
  const width = props.width || '16'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 16 16" aria-labelledby="title">
      <title id="title">IconArrowSelect</title>
      <path fill={fill} d="M7.375 1.219l-5 4 1.249 1.562L8 3.28l4.375 3.501 1.249-1.562-5-4a1.003 1.003 0 0 0-1.249 0zM8 12.72L3.625 9.219l-1.249 1.562 5 4a.996.996 0 0 0 1.249 0l5-4-1.249-1.562L8 12.72z"/>
    </svg>
  )
}

IconArrowSelect.propTypes = {
  fill   : React.PropTypes.string,
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconArrowSelect