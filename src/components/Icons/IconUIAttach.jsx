import React from 'react'

const IconUIAttach = (props) => {
  const fill = props.fill || '#62AADC'
  const height = props.height || '16'
  const width = props.width || '16'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 16 16" aria-labelledby="title">
      <title id="title">IconUIAttach</title>
        <path fill={fill} d="M5 5v4c0 1.654 1.346 3 3 3s3-1.346 3-3V4.5C11 2.019 8.981 0 6.5 0S2 2.019 2 4.5V10c0 3.309 2.691 6 6 6s6-2.691 6-6V4h-2v6c0 2.206-1.794 4-4 4s-4-1.794-4-4V4.5C4 3.121 5.121 2 6.5 2S9 3.121 9 4.5V9a1 1 0 0 1-2 0V5H5z"/>
    </svg>
  )
}

IconUIAttach.propTypes = {
  fill   : React.PropTypes.string,
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconUIAttach