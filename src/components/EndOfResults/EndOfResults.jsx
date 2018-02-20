import React from 'react'
import PropTypes from 'prop-types'
import './EndOfResults.scss'

const EndOfResults = ({ endOfResultsText = 'End of results' }) => (
  <div className="end-of-results">{endOfResultsText}</div>
)

EndOfResults.propTypes = {
  endOfResultsText: PropTypes.string
}

export default EndOfResults
