import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

require('./LoadingIndicator.scss')

const LoadingIndicator = ({ isSmall }) => {
  return (
    <div
      className={cn('loading-indicator', { small: isSmall })}
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
