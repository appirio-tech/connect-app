import React from 'react'
import PropTypes from 'prop-types'

require('./LoadMoreButton.scss')

const LoadMoreButton = ({ callback, loading }) => {
  return (
    <button className="load-more" onClick={callback}>
      {loading ? 'Loading...' :'Load More'}
    </button>
  )
}

LoadMoreButton.propTypes = {
  callback: PropTypes.func.isRequired,
  loading : PropTypes.bool
}

export default LoadMoreButton
