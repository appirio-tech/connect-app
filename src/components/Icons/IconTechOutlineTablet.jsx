import React from 'react'

const IconTechOutlineTablet = (props) => {
  const fill = props.fill || '#62AADC'
  const height = props.height || '48'
  const width = props.width || '48'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 48 48" aria-labelledby="title">
      <title id="title">IconTechOutlineTablet</title>
        <path fill={fill} d="M3 6v36c0 2.8 2.2 5 5 5h32c2.8 0 5-2.2 5-5V6c0-2.8-2.2-5-5-5H8C5.2 1 3 3.2 3 6zm2 0c0-1.7 1.3-3 3-3h32c1.7 0 3 1.3 3 3v36c0 1.7-1.3 3-3 3H8c-1.7 0-3-1.3-3-3V6z"/><path d="M24 35c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zm0 4c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zM10 31h28c.6 0 1-.4 1-1V8c0-.6-.4-1-1-1H10c-.6 0-1 .4-1 1v22c0 .6.4 1 1 1zm1-22h26v20H11V9z"/>
      </svg>
  )
}

IconTechOutlineTablet.propTypes = {
  fill   : React.PropTypes.string,
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconTechOutlineTablet