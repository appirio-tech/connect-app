import React from 'react'

const IconArrowMinimalRight = (props) => {
  const fill = props.fill || '#62AADC'
  const height = props.height || '16'
  const width = props.width || '16'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 16 16" aria-labelledby="title">
      <title id="title">IconArrowMinimalRight</title>
	<path fill={fill} d="M4.854 15.707L12.561 8 4.854.293 3.439 1.707 9.732 8l-6.293 6.293z"/>
</svg>
  )
}

IconArrowMinimalRight.propTypes = {
  fill   : React.PropTypes.string,
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconArrowMinimalRight