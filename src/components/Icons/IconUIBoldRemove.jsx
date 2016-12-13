import React from 'react'

const IconUIBoldRemove = (props) => {
  const fill = props.fill || '#62AADC'
  const height = props.height || '16'
  const width = props.width || '16'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 16 16" aria-labelledby="title">
      <title id="title">IconUIBoldRemove</title>
        <path fill={fill} d="M12.243.929L8 5.172 3.757.929.929 3.757 5.172 8 .929 12.243l2.828 2.828L8 10.828l4.243 4.243 2.828-2.828L10.828 8l4.243-4.243z"/>
    </svg>
  )
}

IconUIBoldRemove.propTypes = {
  fill   : React.PropTypes.string,
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconUIBoldRemove