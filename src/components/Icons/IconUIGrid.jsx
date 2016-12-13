import React from 'react'

const IconUIGrid = (props) => {
  const fill = props.fill || '#62AADC'
  const height = props.height || '16'
  const width = props.width || '16'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 16 16" aria-labelledby="title">
      <title id="title">IconUIGrid</title>
        <path fill={fill} d="M1 7h5a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1H1a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1zM15 0h-5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1zM1 16h5a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H1a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1zM15 9h-5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1z"/>
    </svg>
  )
}

IconUIGrid.propTypes = {
  fill   : React.PropTypes.string,
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconUIGrid