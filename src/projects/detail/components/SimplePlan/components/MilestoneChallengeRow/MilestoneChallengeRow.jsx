/**
 * milestoneChallenge row 
 */
import React from 'react'
import PT from 'prop-types'
import moment from 'moment'
import {
  CHALLENGE_DETAIL_APP
} from '../../../../../../../src/config/constants'

import './MilestoneChallengeRow.scss'

const STALLED_MSG = 'Stalled'
const DRAFT_MSG = 'Draft'

function MilestoneChallengeRow({challenge: {
  id,
  name,
  status,
  track,
  type,
  startDate,
  phases: allPhases,
  endDate
}}) {


  let statusPhase = allPhases
    .filter(p => p.name !== 'Registration' && p.isOpen)
    .sort((a, b) => moment(a.scheduledEndDate).diff(b.scheduledEndDate))[0]

  if (!statusPhase && type === 'First2Finish' && allPhases.length) {
    statusPhase = _.clone(allPhases[0])
    statusPhase.name = 'Submission'
  }

  let phaseMessage = STALLED_MSG
  if (statusPhase) phaseMessage = statusPhase.name
  else if (status === 'Draft') phaseMessage = DRAFT_MSG


  return (
    <tr styleName="challenge-table-row-wrap">
      <td colSpan="9">
        <div styleName="challenge-table-row">
          <div styleName="title"><a href={`${CHALLENGE_DETAIL_APP}/${id}`}>{name}</a></div>
          <div styleName="status"><div styleName={phaseMessage.split(' ').join('')}>{phaseMessage}</div></div>
          <div styleName="type"><div styleName={track.split(' ').join('')}>{track}</div></div>
          <div styleName="start-date">{moment(startDate).format('MM-DD-YYYY')}</div>
          <div styleName="end-date">{moment(endDate).format('MM-DD-YYYY')}</div>
        </div>
      </td>
    </tr>
  )
}

MilestoneChallengeRow.propTypes = {
  challenge: PT.shape(),
}

export default MilestoneChallengeRow
