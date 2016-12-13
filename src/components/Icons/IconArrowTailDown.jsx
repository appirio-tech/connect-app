import React from 'react'

const IconArrowTailDown = (props) => {
  const fill = props.fill || '#62AADC'
  const height = props.height || '16'
  const width = props.width || '16'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 16 16" aria-labelledby="title">
      <title id="title">IconArrowTailDown</title>
      <path fill={fill} d="M7 0v12.172L2.707 7.879 1.293 9.293 8 16l6.707-6.707-1.414-1.414L9 12.172V0z"/>
    </svg>
  )
}

IconArrowTailDown.propTypes = {
  fill   : React.PropTypes.string,
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconArrowTailDown