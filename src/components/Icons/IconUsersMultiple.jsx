import React from 'react'

const IconUsersMultiple = (props) => {
  const fill = props.fill || '#62AADC'
  const height = props.height || '16'
  const width = props.width || '16'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 16 16" aria-labelledby="title">
      <title id="title">IconUsersMultiple</title>
        <path fill={fill} d="M8 6C6.3 6 5 4.7 5 3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3zM10 16H6v-4l-2-2V7h8v3l-2 2z"/>
        <path fill={fill} d="M2 5C.9 5 0 4.1 0 3s.9-2 2-2 2 .9 2 2-.9 2-2 2zM3 10.4V6H0v3l1 1v4h3v-2.6zM14 5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM13 10.4V6h3v3l-1 1v4h-3v-2.6z"/>
    </svg>
  )
}

IconUsersMultiple.propTypes = {
  fill   : React.PropTypes.string,
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconUsersMultiple