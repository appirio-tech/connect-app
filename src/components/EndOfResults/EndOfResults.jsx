import React, { PropTypes } from 'react'
import './EndOfResults.scss'

const EndOfResults = ({ endOfResultsText = 'End of results' }) => (
  <div className="end-of-results">{endOfResultsText}</div>
)

EndOfResults.propTypes = {
  endOfResultsText: PropTypes.string
}

export default EndOfResults
