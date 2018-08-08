/**
 * Milestone type 'final-fix`
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'

import MilestonePostEditText from '../../MilestonePostEditText'
import DotIndicator from '../../DotIndicator'
import MilestoneDescription from '../../MilestoneDescription'

import './MilestoneTypeFinalFixes.scss'

class MilestoneTypeFinalFixes extends React.Component {
  getDescription() {
    const { milestone } = this.props

    return milestone[`${milestone.status}Text`]
  }

  render() {
    const { milestone, theme, currentUser } = this.props
    const finalFixRequests = _.get(milestone, 'details.content.finalFixRequests', [])

    return (
      <div styleName={cn('milestone-post', theme)}>
        <DotIndicator hideFirstLine={currentUser.isCustomer} hideDot>
          <MilestoneDescription description={this.getDescription()} />
        </DotIndicator>

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
