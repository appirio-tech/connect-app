import React from 'react'

const IconSocialPayPal = (props) => {
  const height = props.height || '48'
  const width = props.width || '48'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 48 48">
      <path fill="#009DE2" d="M21.06 11.297H34.6c7.27 0 10.006 3.68 9.584 9.094-.697 8.927-6.094 13.863-13.253 13.863h-3.614c-.98 0-1.641.648-1.908 2.41l-1.55 10.234c-.101.664-.45 1.055-.976 1.102h-8.49c-.799 0-1.083-.611-.874-1.935l5.185-32.826c.207-1.316.927-1.942 2.357-1.942z"/>
      <path fill="#113984" d="M12.596 0H26.15c3.818 0 8.345.124 11.374 2.795 2.023 1.784 3.084 4.627 2.84 7.68C39.53 20.822 33.34 26.62 25.04 26.62h-6.685c-1.138 0-1.892.753-2.213 2.795l-1.865 11.866c-.12.77-.455 1.224-1.064 1.278H4.864c-.926 0-1.255-.708-1.013-2.243L9.863 2.252C10.103.726 10.938 0 12.596 0z"/>
      <path fill="#172C70" d="M16.337 28.219l2.367-14.98c.207-1.316.927-1.942 2.357-1.942H34.6c2.241 0 4.052.35 5.471.995-1.36 9.21-7.317 14.328-15.119 14.328H18.27c-.88 0-1.537.45-1.932 1.599z"/>
    </svg>
  )
}

IconSocialPayPal.propTypes = {
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconSocialPayPal