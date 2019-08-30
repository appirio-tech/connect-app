/**
 * "Submit for Review" which can be shown on the project sidebar.
 * 
 * This components implements showing this button sticky to the top in mobile resulutions.
 * Also, when this button is sticky it can display project estimations.
 */
import React from 'react'
import PT from 'prop-types'
import cn from 'classnames'

import './ReviewProjectButton.scss'

const ReviewProjectButton = ({ disabled, onClick, wrapperClass }) => {
  const submitButton = (
    <button className="tc-btn tc-btn-primary tc-btn-md"
      onClick={onClick}
      disabled={disabled}
    >Submit for Review</button>
  )

  return (
    <div styleName={cn('container', wrapperClass)}>
      <div className="btn-boxs">
        {submitButton}
      </div>
    </div>
  )
}

ReviewProjectButton.defaultProps =  {
  disabled: false,
}

ReviewProjectButton.propTypes = {
  disabled: PT.bool,
  project: PT.object,
  onClick: PT.func.isRequired,
  wrapperClass: PT.string
}

export default ReviewProjectButton