import React from 'react'

const IconSocialDropbox = (props) => {
  const height = props.height || '48'
  const width = props.width || '48'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 48 48">
      <g fill="#007BE9">
        <path d="M14.12 1.677L0 10.897l9.763 7.818L24 9.924zM0 26.533l14.12 9.22L24 27.506 9.763 18.715zM24 27.506l9.88 8.247L48 26.533l-9.763-7.818zM48 10.896L33.88 1.677 24 9.924l14.237 8.79z"/>
        <path d="M24.029 29.28l-9.91 8.222-4.24-2.768v3.104l14.15 8.485 14.15-8.485v-3.104l-4.24 2.768z"/>
      </g>
    </svg>
)
}

IconSocialDropbox.propTypes = {
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconSocialDropbox