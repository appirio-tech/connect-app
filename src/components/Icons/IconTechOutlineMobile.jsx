import React from 'react'

const IconTechOutlineMobile = (props) => {
  const fill = props.fill || '#62AADC'
  const height = props.height || '48'
  const width = props.width || '48'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 48 48" aria-labelledby="title">
      <title id="title">IconTechOutlineMobile</title>
        <path fill={fill} d="M14 47h20c2.8 0 5-2.2 5-5V6c0-2.8-2.2-5-5-5H14c-2.8 0-5 2.2-5 5v36c0 2.8 2.2 5 5 5zm23-18H11V13h26v16zm-3 16H14c-1.7 0-3-1.3-3-3V31h26v11c0 1.7-1.3 3-3 3zM14 3h20c1.7 0 3 1.3 3 3v5H11V6c0-1.7 1.3-3 3-3z"/><path d="M24 35c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zm0 4c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"/>
      </svg>
  )
}

IconTechOutlineMobile.propTypes = {
  fill   : React.PropTypes.string,
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconTechOutlineMobile