import React from 'react'

const IconUsersAdd = (props) => {
  const fill = props.fill || '#62AADC'
  const height = props.height || '16'
  const width = props.width || '16'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 16 16" aria-labelledby="title">
      <title id="title">IconUsersAdd</title>
        <path fill={fill} d="M7 9C4.8 9 3 7.2 3 5V4c0-2.2 1.8-4 4-4s4 1.8 4 4v1c0 2.2-1.8 4-4 4zM5 11c-2.8 0-5 2.2-5 5h8v-5H5z"/><path data-color="color-2" fill="#444" d="M14 10h-2v2h-2v2h2v2h2v-2h2v-2h-2z"/>
    </svg>
  )
}

IconUsersAdd.propTypes = {
  fill   : React.PropTypes.string,
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconUsersAdd