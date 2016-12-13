import React from 'react'

const IconTcSpecIconTypeGlyphHome = (props) => {
  const fill = props.fill || '#62AADC'
  const height = props.height || '48'
  const width = props.width || '48'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 48 48" aria-labelledby="title">
      <title id="title">IconTcSpecIconTypeGlyphHome
    </title>
        <path fill={fill} d="M46 25a1.002 1.002 0 0 0 .673-1.74l-22-20a1.002 1.002 0 0 0-1.346 0L13 12.648V8a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v10c0 .031.011.06.013.09l-5.686 5.169a1.002 1.002 0 0 0 1.346 1.48L24 5.351 45.327 24.74A1 1 0 0 0 46 25z"/>
        <path fill={fill} d="M41 43V23.509L24 8.054 7 23.509V43a2 2 0 0 0 2 2h10a1 1 0 0 0 1-1v-9h8v9a1 1 0 0 0 1 1h10a2 2 0 0 0 2-2zM28 27a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6z"/>
      </svg>
  )
}

IconTcSpecIconTypeGlyphHome.propTypes = {
  fill   : React.PropTypes.string,
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconTcSpecIconTypeGlyphHome