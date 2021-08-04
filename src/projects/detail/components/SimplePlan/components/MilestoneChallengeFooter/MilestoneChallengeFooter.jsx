/**
 * milestoneChallenge footer
 */
import React from 'react'
import _ from 'lodash'
import cn from 'classnames'
import PT from 'prop-types'
import {
  WORK_MANAGER_APP,
  CHALLENGE_ID_MAPPING
} from '../../../../../../../src/config/constants'
import './MilestoneChallengeFooter.scss'


class MilestoneChallengeFooter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      curPage: 0
    }
    this.loadChallengeBypage = this.loadChallengeBypage.bind(this)
  }

  loadChallengeBypage(page) {
    const {
      milestone,
      onLoadChallengesByPage 
    } = this.props
    if (this.state.curPage === page) {
      return
    }
    this.state.curPage = page
    onLoadChallengesByPage(page, milestone)
  }
  renderPagination() {
    const {
      milestone
    } = this.props
    let challengeIds = _.map(milestone.products, `details.${CHALLENGE_ID_MAPPING}`)
    challengeIds = _.filter(challengeIds)
    const length = Math.ceil(challengeIds.length/6) 

    if (length === 0) {
      return null
      
    }

    return (
      <div styleName="pagination">
        {
          _.map(_.range(length), (i, index) => {
            return <div styleName={cn({selected: index === this.state.curPage})} onClick={() => {this.loadChallengeBypage(index)}}>{i+1}</div>
          })
        }
      </div>
    )

  }

  render() {
    const {
      isUpdatable,
      milestone
    } = this.props
    const url = `${WORK_MANAGER_APP}/${milestone.projectId}/challenges`


    return (
      <tr styleName="challenge-table-row-wrap">
        <td colSpan={isUpdatable? '9': '8'}>
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
  onLoadChallengesByPage: PT.func,
  milestone: PT.shape(),
  isUpdatable: PT.bool
}

export default MilestoneChallengeFooter
