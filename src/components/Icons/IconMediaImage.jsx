import React from 'react'

const IconName = (props) => {
  const fill = props.fill || '#62AADC'
  const height = props.height || '16'
  const width = props.width || '16'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 16 16" aria-labelledby="title">
      <title id="title">IconName</title>
        <path fill={fill} d="M15 16H1c-.6 0-1-.4-1-1V1c0-.6.4-1 1-1h14c.6 0 1 .4 1 1v14c0 .6-.4 1-1 1zM2 14h12V2H2v12z"/>
        <path fill={fill} d="M6 4c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zM3 12l2-4 2 2 3-4 3 6z"/>
    </svg>
  )
}

IconName.propTypes = {
  fill   : React.PropTypes.string,
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconName