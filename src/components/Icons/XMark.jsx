import React, { PropTypes as PT } from 'react'

function XMark(props) {
  // Without this 1.5 scaling, the icon renders smaller than it should.
  // Just a rapid fix, rather then editing svg source.
  const s = props.size * 1.5
  return (
    <svg fill={props.color} height={s} viewBox="0 0 24 24" width={s}>
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>
  )
}

XMark.defaultProps = {
  color: '#5D5D66',
  size: 16
}

XMark.propTypes = {
  color: PT.string,
  size: PT.number
}

export default XMark
