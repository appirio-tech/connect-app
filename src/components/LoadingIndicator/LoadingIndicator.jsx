import React from 'react'

require('./LoadingIndicator.scss')

const LoadingIndicator = () => {
  const backgroundImageUrl = { backgroundImage: `url(${require('./ripple.svg')})` }

  return (
    <div
      className="loading-indicator"
      style={backgroundImageUrl}
    />
  )
}

export default LoadingIndicator
