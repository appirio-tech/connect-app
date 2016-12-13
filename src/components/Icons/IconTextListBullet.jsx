import React from 'react'

const IconTextListBullet = (props) => {
  const fill = props.fill || '#62AADC'
  const height = props.height || '16'
  const width = props.width || '16'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 16 16" aria-labelledby="title">
      <title id="title">IconTextListBullet</title>
      <circle fill={fill} cx="2" cy="2" r="2"/>
      <circle fill={fill} cx="2" cy="8" r="2"/>
      <circle fill={fill} cx="2" cy="14" r="2"/>
      <path fill={fill} d="M6 1h10v2H6zM6 7h10v2H6zM6 13h10v2H6z"/>
    </svg>
  )
}

IconTextListBullet.propTypes = {
  fill   : React.PropTypes.string,
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconTextListBullet