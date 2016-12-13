import React from 'react'

const IconSocialYouTube = (props) => {
  const height = props.height || '48'
  const width = props.width || '48'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 48 48">
      <path fill="#DC2217" d="M47.52 14.403s-.468-3.308-1.908-4.764c-1.825-1.912-3.87-1.922-4.809-2.034C34.086 7.12 24.01 7.12 24.01 7.12h-.02s-10.076 0-16.793.485c-.938.112-2.984.122-4.81 2.034C.949 11.095.48 14.403.48 14.403S0 18.287 0 22.172v3.641c0 3.884.48 7.769.48 7.769s.468 3.308 1.908 4.764c1.825 1.912 4.224 1.852 5.292 2.052 3.84.368 16.32.482 16.32.482s10.086-.015 16.803-.5c.938-.113 2.984-.122 4.81-2.034 1.439-1.456 1.908-4.764 1.908-4.764S48 29.697 48 25.813v-3.641c0-3.885-.48-7.769-.48-7.769z"/>
      <path fill="#FFF" d="M19.045 30.226l-.003-13.487 12.97 6.767-12.967 6.72z"/>
    </svg>
  )
}

IconSocialYouTube.propTypes = {
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconSocialYouTube