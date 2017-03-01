import React, { PropTypes as PT } from 'react'

function Check(props) {
  const s = props.size
  return (
    <svg className="Icon Check" width={s} height={s} viewBox="0 0 9 7">
      <polygon fill={props.color} id="Fill-89" points="9 1.44117647 7.56818182 0 3.47727273 4.11764706 1.43181818 2.05882353 0 3.5 3.47727273 7"></polygon>
    </svg>
  )
}

Check.defaultProps = {
  color: 'black',
  size: 16
}

Check.propTypes = {
  color: PT.string,
  size: PT.oneOfType([PT.number, PT.string])
}

export default Check
