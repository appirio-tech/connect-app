/**
 * milestoneChallenge footer
 */
import React from 'react'
import _ from 'lodash'
import PT from 'prop-types'
import {
  WORK_MANAGER_APP 
} from '../../../../../../../src/config/constants'
import './MilestoneChallengeFooter.scss'


class MilestoneChallengeFooter extends React.Component {
  constructor(props) {
    super(props)

  }

  renderPagination() {
    const {
      milestone
    } = this.props
    let challengeIds = _.map(milestone.products, 'details.challengeId')
    challengeIds = _.filter(challengeIds)
    const length = Math.ceil(challengeIds.length/6) 

    if (length === 0) {
      return null
      
    }

    return (
      <div styleName="pagination">
        {
          _.map(_.range(length), i => {
            return <div>{i+1}</div>
          })
        }
      </div>
    )

  }

  render() {
    const {
      milestone
    } = this.props
    const url = `${WORK_MANAGER_APP}/${milestone.projectId}/challenges`


    return (
      <tr styleName="challenge-table-row-wrap">
        <td colSpan="9">
          <div styleName="challenge-table-row">
            <div styleName="view-button">
              <a href={url}>
                VIEW CHALLENGES
              </a>
            </div>
            <div>
              {this.renderPagination()}
            </div>
          </div>
        </td>
      </tr>
    )

  }
}

MilestoneChallengeFooter.propTypes = {
  milestone: PT.shape(),
  rowId: PT.string,
  onChange: PT.func,
  onSave: PT.func,
  onRemove: PT.func,
  onDiscard: PT.func,
  projectMembers: PT.arrayOf(PT.shape()),
  allMilestones: PT.arrayOf(PT.shape()),
  isCreatingRow: PT.bool,
  isUpdatable: PT.bool,
  members: PT.object,
}

export default MilestoneChallengeFooter
