import React from 'react'

const IconCarretDown = (props) => {
  const fill = props.fill || '#62AADC'
  const height = props.height || '6'
  const width = props.width || '10'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 6 10" aria-labelledby="title">
      <title id="title">IconCarretDown</title>
      <path fill={fill} fillRule="evenodd" d="M4.478.203a.8.8 0 0 1 1.066 0l4.478 4-1.066 1.194-3.94-3.529-3.95 3.529L0 4.203l4.478-4z"/>
    </svg>
  )
}

IconCarretDown.propTypes = {
  fill   : React.PropTypes.string,
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconCarretDown