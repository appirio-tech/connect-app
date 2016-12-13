import React from 'react'

const IconUILink = (props) => {
  const fill = props.fill || '#62AADC'
  const height = props.height || '16'
  const width = props.width || '16'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 16 16" aria-labelledby="title">
      <title id="title">IconUILink</title>
        <path fill={fill} d="M11 0a4.965 4.965 0 0 0-3.535 1.465L6.309 2.621a.999.999 0 1 0 1.414 1.414l1.156-1.156c1.133-1.133 3.109-1.133 4.242 0C13.688 3.445 14 4.198 14 5s-.312 1.555-.879 2.121l-1.156 1.156a.999.999 0 1 0 1.414 1.414l1.156-1.156C15.479 7.592 16 6.336 16 5s-.521-2.592-1.465-3.535A4.965 4.965 0 0 0 11 0zM4.035 7.723a.999.999 0 1 0-1.414-1.414L1.465 7.465C.521 8.408 0 9.664 0 11s.521 2.592 1.465 3.535C2.408 15.479 3.664 16 5 16s2.592-.521 3.535-1.465l1.156-1.156a.999.999 0 1 0-1.414-1.414l-1.156 1.156c-1.133 1.133-3.109 1.133-4.242 0C2.312 12.555 2 11.802 2 11s.312-1.555.879-2.121l1.156-1.156z"/><path d="M5.879 11.121a.997.997 0 0 0 .707-.293l4.242-4.242a.999.999 0 1 0-1.414-1.414L5.172 9.414a.999.999 0 0 0 .707 1.707z"/>
    </svg>
  )
}

IconUILink.propTypes = {
  fill   : React.PropTypes.string,
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconUILink