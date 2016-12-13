import React from 'react'

const IconSocialSlack = (props) => {
  const height = props.height || '48'
  const width = props.width || '48'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 48 48">
      <path fill="#E8A723" d="M31.128 2.956a4.276 4.276 0 1 0-8.133 2.642l11.056 34.017a4.275 4.275 0 0 0 5.202 2.65c2.269-.652 3.652-3.063 2.928-5.292L31.128 2.956z"/>
      <path fill="#3EB890" d="M13.997 8.522a4.276 4.276 0 1 0-8.133 2.643L16.92 45.18a4.275 4.275 0 0 0 5.201 2.651c2.27-.653 3.653-3.063 2.929-5.292L13.997 8.522z"/>
      <path fill="#E01765" d="M45.044 31.128a4.276 4.276 0 1 0-2.642-8.133L8.385 34.052a4.275 4.275 0 0 0-2.65 5.2c.652 2.27 3.063 3.653 5.292 2.93l34.017-11.054z"/>
      <path fill="#472A49" d="M15.475 40.736l8.13-2.642-2.642-8.13-8.13 2.642 2.642 8.13z"/>
      <path fill="#CC2027" d="M32.607 35.17c3.073-1 5.93-1.927 8.13-2.642l-2.643-8.133-8.13 2.643 2.643 8.131z"/>
      <path fill="#70CADB" d="M39.478 13.997a4.276 4.276 0 1 0-2.643-8.133L2.82 16.92a4.275 4.275 0 0 0-2.651 5.201c.653 2.27 3.063 3.653 5.292 2.929l34.018-11.053z"/>
      <path fill="#1A937D" d="M9.907 23.605l8.132-2.642-2.642-8.131-8.132 2.643 2.642 8.13z"/>
      <path fill="#65863A" d="M27.038 18.039l8.132-2.643-2.642-8.132-8.132 2.643 2.642 8.132z"/>
    </svg>
  )
}

IconSocialSlack.propTypes = {
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconSocialSlack