/**
 * Milestone type 'final-fix`
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'

import MilestonePostEditText from '../../MilestonePostEditText'

import './MilestoneTypeFinalFixes.scss'

class MilestoneTypeFinalFixes extends React.Component {

  render() {
    const { milestone, theme } = this.props
    const finalFixRequests = _.get(milestone, 'details.content.finalFixRequests', [])

    return (
      <div styleName={cn('milestone-post', theme)}>
        {finalFixRequests.map((finalFixRequest, index) => (
          <div styleName="top-space" key={index}>
            <MilestonePostEditText
              key={index}
              value={finalFixRequest.value}
            />
          </div>
        ))}
      </div>
    )
  }
}

MilestoneTypeFinalFixes.defaultProps = {
  theme: null,
}

MilestoneTypeFinalFixes.propTypes = {
  theme: PT.string,
  milestone: PT.object.isRequired,
}

export default MilestoneTypeFinalFixes
