import React from 'react'

const IconSocialGooglePlus = (props) => {
  const height = props.height || '48'
  const width = props.width || '48'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 48 48">
      <path fill="#DE4D3B" d="M48 22h-4v-4h-4v4h-4v4h4v4h4v-4h4v-4zM33.053 22.009L18 22v6h8.602c-.464 2.54-3.007 7.172-9.602 7.172-5.804 0-10.54-4.809-10.54-10.734 0-5.926 4.736-10.735 10.54-10.735 3.303 0 5.513 1.409 6.776 2.623l4.614-4.444C25.427 9.113 21.59 7.438 17 7.438c-9.399 0-17 7.6-17 17 0 9.398 7.601 17 17 17 11.696 0 17.72-9.708 16.053-19.43z"/>
    </svg>
)
}

IconSocialGooglePlus.propTypes = {
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconSocialGooglePlus