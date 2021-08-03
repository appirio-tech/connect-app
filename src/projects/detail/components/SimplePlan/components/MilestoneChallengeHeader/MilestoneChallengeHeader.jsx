/**
 * milestoneChallenge header
 */
import React from 'react'
import './MilestoneChallengeHeader.scss'

function MilestoneChallengeHeader() {

  return (
    <tr styleName="challenge-table-row-wrap">
      <td colSpan="9">

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

export default MilestoneChallengeHeader
