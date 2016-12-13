import React from 'react'

const IconTcSpecIconTypeOutlineHome = (props) => {
  const fill = props.fill || '#62AADC'
  const height = props.height || '48'
  const width = props.width || '48'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 48 48" aria-labelledby="title">
      <title id="title">IconTcSpecIconTypeOutlineHome</title>
        <path fill={fill} d="M28 45h12a1 1 0 0 0 1-1V20.806l4.327 3.934a1 1 0 0 0 1.346-1.48l-22-20a1.002 1.002 0 0 0-1.346 0L15 10.83V6a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v12c0 .031.015.057.018.087l-5.69 5.173a1 1 0 0 0 1.346 1.48L7 20.806V44a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9h6v9a1 1 0 0 0 1 1zM9 7h4v5.648l-4 3.636V7zm11 26a1 1 0 0 0-1 1v9H9V18.988L24 5.352l15 13.637V43H29v-9a1 1 0 0 0-1-1h-8z"/>
        <path fill={fill} d="M29 26v-8a1 1 0 0 0-1-1h-8a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1zm-2-1h-6v-6h6v6z"/>
      </svg>
  )
}

IconTcSpecIconTypeOutlineHome.propTypes = {
  fill   : React.PropTypes.string,
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconTcSpecIconTypeOutlineHome