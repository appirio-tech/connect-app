import React, { PropTypes } from 'react'
import cn from 'classnames'

require('./LoadingIndicator.scss')

const LoadingIndicator = ({ isSmall }) => {
  const backgroundImageUrl = { backgroundImage: `url(${require('./loader.gif')})` }

  return (
    <div
      className={cn('loading-indicator', { small: isSmall })}
      style={backgroundImageUrl}
    />
  )
}

LoadingIndicator.defaulProps = {
  isSmall: false
}

LoadingIndicator.propTypes = {
  isSmall: PropTypes.bool
}

export default LoadingIndicator
