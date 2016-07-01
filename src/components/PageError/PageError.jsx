import React from 'react'
import RobotIcon from '../../icons/RobotIcon'

require('./PageError.scss')

const PageError = () => {
  return (
    <div className="page-error">
      <p>Oops! There was an error.</p>

      <RobotIcon />
    </div>
  )
}

export default PageError
