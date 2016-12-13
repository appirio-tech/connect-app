import React from 'react'

const IconSocialFacebook = (props) => {
  const height = props.height || '48'
  const width = props.width || '48'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 48 48">
      <path fill="#39579A" d="M46 48a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v44a2 2 0 0 0 2 2h44z"/>
      <path fill="#FFF" d="M25.52 48V29H19v-7h6.52v-5.175c0-6.2 3.786-9.575 9.316-9.575 2.65 0 4.926.197 5.59.285v6.48l-3.836.001c-3.008 0-3.59 1.43-3.59 3.527V22h7l-1 7h-6v19h-7.48z"/>
    </svg>
)
}

IconSocialFacebook.propTypes = {
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconSocialFacebook