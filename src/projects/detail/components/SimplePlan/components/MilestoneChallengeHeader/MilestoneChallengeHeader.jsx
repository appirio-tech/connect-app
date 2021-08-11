/**
 * milestoneChallenge header
 */
import React from 'react'
import PT from 'prop-types'
import './MilestoneChallengeHeader.scss'

function MilestoneChallengeHeader({isUpdatable}) {

  return (
    <tr styleName="challenge-table-row-wrap">
      <td colSpan={isUpdatable? '9': '8'}>
        <div styleName="challenge-table-row">
          <div styleName="title">TITLE</div>
          <div styleName="status">STATUS</div>
          <div styleName="type">TYPE</div>
          <div styleName="start-date">START DATE</div>
          <div styleName="end-date">END DATE</div>
        </div>
      </td>
    </tr>
  )
}

MilestoneChallengeHeader.propTypes = {
  isUpdatable: PT.bool
}

export default MilestoneChallengeHeader
