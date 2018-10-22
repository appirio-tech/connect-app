/**
 * "Submit for Review" which can be shown on the project sidebar.
 * 
 * This components implements showing this button sticky to the top in mobile resulutions.
 * Also, when this button is sticky it can display project estimations.
 */
import React from 'react'
import PT from 'prop-types'
import cn from 'classnames'

import Sticky from 'react-stickynode'
import MediaQuery from 'react-responsive'
import ProjectEstimationSection from '../ProjectEstimationSection'
import { SCREEN_BREAKPOINT_MD } from '../../../../config/constants'
import { isProjectEstimationPresent } from '../../../../helpers/projectHelper'

import './ReviewProjectButton.scss'

const ReviewProjectButton = ({ project, disabled, onClick }) => {
  const submitButton = (
    <button className="tc-btn tc-btn-primary tc-btn-md"
      onClick={onClick}
      disabled={disabled}
    >Submit for Review</button>
  )

  const hasEstimation = isProjectEstimationPresent(project)

  return (
    <div styleName="container">
      <MediaQuery minWidth={SCREEN_BREAKPOINT_MD}>
        {(matches) => {
          if (matches) {
            return (
              <div className="btn-boxs">
                {submitButton}
              </div>
            )
          } else {
            return (
              <Sticky top={0}>
                <div className={cn('btn-boxs', { 'has-estimation': hasEstimation })}>
                  <div className="list-group">
                    <ProjectEstimationSection project={project} />
                  </div>
                  {submitButton}
                </div>
              </Sticky>
            )
          }
        }}
      </MediaQuery>
    </div>
  )
}

ReviewProjectButton.defaultProps =  {
  disabled: false,
}

ReviewProjectButton.propTypes = {
  disabled: PT.bool,
  project: PT.object.isRequired,
  onClick: PT.func.isRequired,
}

export default ReviewProjectButton