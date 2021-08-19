/**
 * milestoneChallenge row 
 */
import React from 'react'
import PT from 'prop-types'
import moment from 'moment'
import {
  WORK_MANAGER_APP
} from '../../../../../../../src/config/constants'

import './MilestoneChallengeRow.scss'

function MilestoneChallengeRow({challenge, milestone, isEmpty, isLoading, isUpdatable}) {

  if (isEmpty) {
    return (
      <tr styleName="challenge-table-row-wrap">
        <td colSpan="9">
          <div styleName="challenge-empty-row">
              no challenges found
          </div>
        </td>
      </tr>
    )
  }

  if (isLoading) {
    return (
      <tr styleName="challenge-table-row-wrap">
        <td colSpan="9">
          <div styleName="challenge-empty-row">
              loading challenges...
          </div>
        </td>
      </tr>
    )
  }
  const {
    id,
    name,
    status,
    track,
    startDate,
    endDate,
  } = challenge

  const statusLabel = status.indexOf('Cancelled') === 0 ? 'Cancelled': status
  const url = `${WORK_MANAGER_APP}/${milestone.projectId}/challenges/${id}/view`

  return (
    <tr styleName="challenge-table-row-wrap">
      <td colSpan={isUpdatable? '9': '8'}>
        <div styleName="challenge-table-row">
          <div styleName="title"><a href={`${url}`}>{name}</a></div>
          <div styleName="status"><div styleName={statusLabel}>{statusLabel}</div></div>
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
  isUpdatable: PT.bool,
  isEmpty: PT.bool,
  isLoading: PT.bool,
  milestone: PT.shape()
}

export default MilestoneChallengeRow
