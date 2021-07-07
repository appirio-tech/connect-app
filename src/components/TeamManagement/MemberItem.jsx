import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
require('moment-timezone')
import UserTooltip from '../User/UserTooltip'
import SunIcon from '../../assets/icons/daylight.svg'
import MoonIcon from '../../assets/icons/moon.svg'
import { getFullNameWithFallback } from '../../helpers/tcHelpers'
import './MemberItem.scss'

const  MemberItem  = (props) => {

  const {usr, showEmailOnly, feedback} = props

  const userFullName = getFullNameWithFallback(usr)
  const workingHourStart = _.get(usr, 'workingHourStart')
  const workingHourEnd = _.get(usr, 'workingHourEnd')
  const timeZone = _.get(usr, 'timeZone')
  const email = _.get(usr, 'email')
  let localTime
  let localTimeOffsetFormat
  let utcOff
  if(timeZone) {
    const tz = moment().tz(timeZone)
    localTime = tz.format('h:mm a')
    utcOff = tz.utcOffset()/60
    localTimeOffsetFormat = 'UTC' + moment().utcOffset(utcOff).format('Z')
  }
  let localTimeInfoEl = null

  let isWorkingTime = false
  let showIcon = false
  let localWhStart
  let localWhEnd

  if(localTime || workingHourStart && workingHourEnd ) {

    if(workingHourStart && workingHourEnd) {
      showIcon = true
      localWhStart = moment({hour: workingHourStart.split(':')[0]}).format('h a')
      localWhEnd = moment({hour: workingHourEnd.split(':')[0]}).format('h a')

      if(localTime) {
        let localHour = +moment().utcOffset(utcOff).format('H')
        const localStartHour = +moment({hour: workingHourStart.split(':')[0] }).format('H')
        let localEndHour = +moment({hour: workingHourEnd.split(':')[0] }).format('H')
        if(localEndHour <= localStartHour) {
          localEndHour += 24
          if(localHour < localStartHour) {
            localHour += 24
          }
        }
        if(localHour >= localStartHour && localHour < localEndHour) {
          isWorkingTime = true
        }
      }
    }
    localTimeInfoEl = (<div styleName="time-info-tooltip">
      {localTime? <span>Local Time - {localTime}</span>: null}
      {localWhStart && localWhEnd  ? <span>Working Hours - {`${localWhStart} - ${localWhEnd}`} {localTimeOffsetFormat}</span>: null}
    </div>)
  }

  return (
    <div styleName="container">
      <UserTooltip {...props} localTimeInfo={localTimeInfoEl}/>
      {feedback && <a styleName="feed-back" href={feedback} target="_blank">Feed Back</a>}
      <div styleName="member-detail">
        <div styleName="member-name">{showEmailOnly? email :userFullName}</div>
        {localWhStart && localWhEnd && <div styleName="wk-hour">WH: {localWhStart} - {localWhEnd} {localTimeOffsetFormat}</div>}
        {localTime &&<div styleName="local-time">{showIcon&& (isWorkingTime ? <SunIcon/>: <MoonIcon/>)}Local time: {localTime}</div>}
      </div>
    </div>
  )
}

MemberItem.propTypes = {
  showRoleSelector: false
}

MemberItem.propTypes = {
  usr: PropTypes.object.isRequired,
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  previewAvatar: PropTypes.bool,
  feedback: PropTypes.string,
  showEmailOnly: PropTypes.bool,
  size: PropTypes.number
}

export default MemberItem
