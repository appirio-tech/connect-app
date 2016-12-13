import React from 'react'

const IconTextQuote = (props) => {
  const fill = props.fill || '#62AADC'
  const height = props.height || '16'
  const width = props.width || '16'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 16 16" aria-labelledby="title">
      <title id="title">IconTextQuote</title>
        <path fill={fill} d="M3.024 4.56C1.839 6.043 1.668 7.536 2.016 8.58c1.316-1.045 3.144-.827 4.258.214 1.125 1.05 1.222 2.898.504 4.094a3.291 3.291 0 0 1-2.847 1.613C1.238 14.5 0 12.126 0 9.46c0-1.73.44-3.28 1.323-4.648s2.213-2.474 3.994-3.314l.478.933C4.72 2.885 3.796 3.595 3.024 4.56zm8.768 0c-1.185 1.482-1.356 2.975-1.008 4.02.588-.454 1.227-.68 1.915-.68C14.511 7.9 16 9.105 16 11.2c0 1.926-1.478 3.3-3.3 3.3-2.693 0-3.931-2.374-3.931-5.039 0-1.73.44-3.28 1.322-4.648.882-1.37 2.213-2.474 3.994-3.314l.479.932c-1.075.454-2 1.164-2.772 2.13z"/>
    </svg>
  )
}

IconTextQuote.propTypes = {
  fill   : React.PropTypes.string,
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconTextQuote