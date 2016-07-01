import React, { PropTypes } from 'react'
import RobotIcon from '../../icons/RobotIcon'

require('./NoResults.scss')

const NoResults = ({ entry }) => {
  return (
    <div className="no-results">
      <p>Sorry, no results found for <span>{entry}</span></p>

      <RobotIcon />
    </div>
  )
}

NoResults.propTypes = {
  entry: PropTypes.string.isRequired
}

export default NoResults
