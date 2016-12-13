import React from 'react'

const IconUISettingsGear = (props) => {
  const fill = props.fill || '#62AADC'
  const height = props.height || '16'
  const width = props.width || '16'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 16 16" aria-labelledby="title">
      <title id="title">IconUISettingsGear</title>
        <path fill={fill} d="M13.297 5.184l1.067-2.134-1.414-1.414-2.134 1.067a5.94 5.94 0 0 0-1.062-.441L9 0H7l-.754 2.262a5.94 5.94 0 0 0-1.062.441L3.05 1.636 1.636 3.05l1.067 2.134a5.94 5.94 0 0 0-.441 1.062L0 7v2l2.262.754c.113.371.262.725.441 1.062L1.636 12.95l1.414 1.414 2.134-1.067a5.94 5.94 0 0 0 1.062.441L7 16h2l.754-2.262a5.94 5.94 0 0 0 1.062-.441l2.134 1.067 1.414-1.414-1.067-2.134a5.94 5.94 0 0 0 .441-1.062L16 9V7l-2.262-.754a5.94 5.94 0 0 0-.441-1.062zM8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
    </svg>
  )
}

IconUISettingsGear.propTypes = {
  fill   : React.PropTypes.string,
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconUISettingsGear