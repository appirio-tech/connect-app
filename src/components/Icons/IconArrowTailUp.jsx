import React from 'react'

const IconArrowTailUp = (props) => {
  const fill = props.fill || '#62AADC'
  const height = props.height || '16'
  const width = props.width || '16'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 16 16" aria-labelledby="title">
      <title id="title">IconArrowTailUp</title>
      <path fill={fill} d="M9 16V3.828l4.293 4.293 1.414-1.414L8 0 1.293 6.707l1.414 1.414L7 3.828V16z"/>
    </svg>
  )
}

IconArrowTailUp.propTypes = {
  fill   : React.PropTypes.string,
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconArrowTailUp