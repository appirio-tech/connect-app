import React from 'react'

const IconDesignCode = (props) => {
  const fill = props.fill || '#62AADC'
  const height = props.height || '16'
  const width = props.width || '16'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 16 16" aria-labelledby="title">
      <title id="title">IconDesignCode</title>
        <path fill={fill} d="M12.707 4.293l-1.414 1.414L13.586 8l-2.293 2.293 1.414 1.414 3-3a.999.999 0 0 0 0-1.414l-3-3zM3.293 11.707l1.414-1.414L2.414 8l2.293-2.293-1.414-1.414-3 3a.999.999 0 0 0 0 1.414l3 3zM9.051 1.684l-4 12a1 1 0 1 0 1.898.632l4-12a1 1 0 1 0-1.898-.632z"/>
    </svg>
  )
}

IconDesignCode.propTypes = {
  fill   : React.PropTypes.string,
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconDesignCode