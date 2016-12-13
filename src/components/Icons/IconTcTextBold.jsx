import React from 'react'

const IconTcTextBold = (props) => {
  const fill = props.fill || '#62AADC'
  const height = props.height || '16'
  const width = props.width || '16'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 16 16" aria-labelledby="title">
      <title id="title">IconTcTextBold</title>
      <path fill={fill} fillRule="evenodd" d="M2 13.013h1.93c1.553 0 2.339.091 3.372.091 4.457 0 6.062-1.386 6.062-3.943 0-1.701-1.46-3.104-3.142-3.104 1.52-.399 2.237-1.627 2.237-2.98 0-1.926-1.63-3.171-4.781-3.071-1.46.05-3.04.066-2.98.116H2.034v1.361l1.29.183v9.828L2 11.85v1.162zm4.346-7.321L6.363 1.4c.188-.091.649-.124.905-.124 1.827 0 2.28.938 2.28 2.008 0 .897-.018 2.474-2.092 2.474-.615 0-.93-.008-1.11-.066zm-.017 5.96v-4.55c.555-.107 1.118-.099 1.63-.099 1.768 0 2.22 1.137 2.22 2.291 0 1.063-.41 2.582-2.1 2.582-.777 0-1.469-.083-1.75-.224z"/>
    </svg>
  )
}

IconTcTextBold.propTypes = {
  fill   : React.PropTypes.string,
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconTcTextBold