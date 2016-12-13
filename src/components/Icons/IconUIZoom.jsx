import React from 'react'

const IconUIZoom = (props) => {
  const fill = props.fill || '#62AADC'
  const height = props.height || '16'
  const width = props.width || '16'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 16 16" aria-labelledby="title">
      <title id="title">IconUIZoom</title>
        <path fill={fill} d="M12.721 11.307a7.029 7.029 0 0 0 1.422-4.235c0-3.9-3.172-7.072-7.072-7.072S0 3.172 0 7.071c0 3.899 3.172 7.072 7.071 7.072 1.59 0 3.053-.534 4.235-1.422l2.986 2.986a1.001 1.001 0 0 0 1.415-1.414l-2.986-2.986zm-5.65.836C4.275 12.143 2 9.868 2 7.071S4.275 2 7.071 2s5.071 2.275 5.071 5.071-2.275 5.072-5.071 5.072z"/>
    </svg>
  )
}

IconUIZoom.propTypes = {
  fill   : React.PropTypes.string,
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconUIZoom