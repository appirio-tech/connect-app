import React from 'react'

const IconArrowLogOut = (props) => {
  const fill = props.fill || '#62AADC'
  const height = props.height || '16'
  const width = props.width || '16'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 16 16" aria-labelledby="title">
      <title id="title">IconArrowLogOut</title>
      <path fill={fill} d="M3.409 2H8v2h2V1a1 1 0 0 0-1-1H1a1 1 0 0 0-1 1v9c0 .266.105.52.293.707l5 5A1 1 0 0 0 7 15V6.016a.998.998 0 0 0-.292-.706L3.409 2zM5 12.586l-3-3V3.42l3 3.009v6.157z"/>
      <path fill={fill} d="M12 3.586L10.586 5l2 2H8v2h4.586l-2 2L12 12.414l3.707-3.707a.999.999 0 0 0 0-1.414L12 3.586z"/>
    </svg>
  )
}

IconArrowLogOut.propTypes = {
  fill   : React.PropTypes.string,
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconArrowLogOut