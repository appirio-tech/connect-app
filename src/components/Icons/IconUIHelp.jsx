import React from 'react'

const IconUIHelp = (props) => {
  const fill = props.fill || '#62AADC'
  const height = props.height || '16'
  const width = props.width || '16'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 16 16" aria-labelledby="title">
      <title id="title">IconUIHelp</title>
        <path fill={fill} d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"/><circle data-color="color-2" fill="#444" cx="8" cy="12" r="1"/><path data-color="color-2" fill="#444" d="M7.1 5.5c.2-.3.5-.5.9-.5.6 0 1 .4 1 1 0 .3-.1.4-.6.7C7.8 7.1 7 7.7 7 9v1h2V9c0-.2 0-.3.5-.6.6-.4 1.5-1 1.5-2.4 0-1.7-1.3-3-3-3-1.1 0-2.1.6-2.6 1.5l-.5.9 1.7 1 .5-.9z"/>
    </svg>
  )
}

IconUIHelp.propTypes = {
  fill   : React.PropTypes.string,
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconUIHelp