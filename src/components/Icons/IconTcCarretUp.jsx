import React from 'react'

const IconCarretUp = (props) => {
  const fill = props.fill || '#62AADC'
  const height = props.height || '6'
  const width = props.width || '10'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 6 10" aria-labelledby="title">
      <title id="title">IconCarretUp</title>
      <path fill={fill} fillRule="evenodd" d="M139.4782 187.2034c.3036-.2712.7623-.2712 1.066 0l4.478 4-1.0657 1.1932-3.9404-3.5284-3.95 3.5284-1.066-1.1932 4.4782-4z"/>
    </svg>
  )
}

IconCarretUp.propTypes = {
  fill   : React.PropTypes.string,
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconCarretUp