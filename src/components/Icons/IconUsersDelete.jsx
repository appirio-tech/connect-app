import React from 'react'

const IconUsersDelete = (props) => {
  const fill = props.fill || '#262628'
  const height = props.height || '16'
  const width = props.width || '16'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 16 16" aria-labelledby="title">
      <title id="title">IconUsersDelete</title>
        <path fill={fill} d="M7 9C4.8 9 3 7.2 3 5V4c0-2.2 1.8-4 4-4s4 1.8 4 4v1c0 2.2-1.8 4-4 4zM5 11c-2.8 0-5 2.2-5 5h8v-5H5z"/>
        <path fill={fill} d="M10 12v2h6v-2z"/>
    </svg>
  )
}

IconUsersDelete.propTypes = {
  fill   : React.PropTypes.string,
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconUsersDelete