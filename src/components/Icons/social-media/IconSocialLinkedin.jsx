import React from 'react'

const IconSocialLinkedin = (props) => {
  const height = props.height || '48'
  const width = props.width || '48'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 48 48">
      <path fill="#007BB5" d="M44.449 0H3.54C1.588 0 .001 1.55.001 3.46v41.076C0 46.448 1.588 48 3.54 48h40.908c1.957 0 3.55-1.552 3.55-3.464V3.461C48 1.549 46.406 0 44.45 0z"/>
      <path fill="#FFF" d="M7.113 17.995h7.126V40.9H7.113V17.995zm3.565-11.387a4.13 4.13 0 1 1-.006 8.258 4.13 4.13 0 0 1 .006-8.258M18.705 17.995h6.824v3.131h.098c.95-1.8 3.272-3.7 6.736-3.7 7.208 0 8.54 4.743 8.54 10.913V40.9h-7.118v-11.14c0-2.656-.046-6.073-3.7-6.073-3.704 0-4.27 2.895-4.27 5.884v11.33h-7.11V17.994z"/>
    </svg>
)
}

IconSocialLinkedin.propTypes = {
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconSocialLinkedin