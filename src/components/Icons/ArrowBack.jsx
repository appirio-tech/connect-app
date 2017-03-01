import React, { PropTypes as PT } from 'react'

function ArrowBack(props) {
  const s = props.size
  return (
    <svg fill={props.color} x="0px" y="0px" width={s} height={s} viewBox="0 0 16 16">
      <polygon points="8.121,2.707 6.707,1.293 0,8 6.707,14.707 8.121,13.293 3.828,9 16,9 16,7 3.828,7 "/>
    </svg>
  )
}

ArrowBack.defaultProps = {
  color: '#5D5D66',
  size: 16 
}

ArrowBack.propTypes = {
  color: PT.string,
  size: PT.number
}

export default ArrowBack
