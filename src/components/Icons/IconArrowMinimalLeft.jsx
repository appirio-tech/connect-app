import React from 'react'

const IconArrowMinimalLeft = (props) => {
  const fill = props.fill || '#62AADC'
  const height = props.height || '16'
  const width = props.width || '16'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 16 16" aria-labelledby="title">
      <title id="title">IconArrowMinimalLeft</title>
	<path fill={fill} d="M11.146.293L3.439 8l7.707 7.707 1.415-1.414L6.268 8l6.293-6.293z"/>
</svg>
  )
}

IconArrowMinimalLeft.propTypes = {
  fill   : React.PropTypes.string,
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconArrowMinimalLeft