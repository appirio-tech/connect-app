import React from 'react'

const IconSocialTrello = (props) => {
  const height = props.height || '48'
  const width = props.width || '48'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 48 48">
      <path fill="#69ACE0" d="M48 9.113a19.686 19.686 0 0 1-5.656 1.551 9.876 9.876 0 0 0 4.33-5.448 19.717 19.717 0 0 1-6.253 2.39 9.835 9.835 0 0 0-7.189-3.11c-5.438 0-9.848 4.409-9.848 9.847 0 .772.087 1.524.255 2.244-8.184-.41-15.44-4.33-20.297-10.289a9.801 9.801 0 0 0-1.334 4.951 9.844 9.844 0 0 0 4.381 8.197 9.808 9.808 0 0 1-4.46-1.232l-.001.124c0 4.771 3.394 8.752 7.9 9.656a9.867 9.867 0 0 1-4.448.169 9.858 9.858 0 0 0 9.2 6.839 19.76 19.76 0 0 1-12.23 4.216c-.796 0-1.58-.047-2.35-.138a27.874 27.874 0 0 0 15.096 4.424c18.113 0 28.019-15.005 28.019-28.019 0-.427-.01-.851-.029-1.274A20.014 20.014 0 0 0 48 9.113z"/>
    </svg>
  )
}

IconSocialTrello.propTypes = {
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconSocialTrello