import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import {timezones} from 'appirio-tech-react-components/constants/timezones'
import UserTooltip from '../User/UserTooltip'
import SunIcon from '../../assets/icons/status-active.svg'
import MoonIcon from '../../assets/icons/status-cancelled.svg'
import { getFullNameWithFallback } from '../../helpers/tcHelpers'
import './MemberItem.scss'

const  MemberItem  = (props) => {

  const {usr} = props

  const userFullName = getFullNameWithFallback(usr)
  const workingHourStart = _.get(usr, 'workingHourStart')
  const workingHourEnd = _.get(usr, 'workingHourEnd')
  const timeZone = _.get(usr, 'timeZone')
  let localTime
  let timeZoneInfo
  if(timeZone) {
    timeZoneInfo = _.find(timezones, (t) => {return t.zoneName === timeZone})
    localTime = moment().utcOffset(timeZoneInfo.gmtOffset/3600).format('h:mm A')
  }
  let localTimeInfoEl = null

  let isWorkingTime = false
  let localWhStart
  let localWhEnd


  if(localTime || workingHourStart && workingHourEnd ) {

    if(workingHourStart && workingHourEnd) {

      localWhStart = moment({hour: workingHourStart.split(':')[0]}).format('h:mm A')
      localWhEnd = moment({hour: workingHourEnd.split(':')[0]}).format('h:mm A')

      const localHour = +moment().utcOffset(timeZoneInfo.gmtOffset/3600).format('H')
      const localStartHour = +moment({hour: workingHourStart.split(':')[0] }).format('H')
      const localEndHour = +moment({hour: workingHourEnd.split(':')[0] }).format('H')
      if(localHour >= localStartHour && localHour <= localEndHour) {
        isWorkingTime = true
      }

    }
    localTimeInfoEl = (<div styleName="time-info-tooltip">
      {localTime? <span>Local Time - {localTime}</span>: null}
      {localWhStart && localWhEnd  ? <span>Working Hours - {`${localWhStart} - ${localWhEnd}`}</span>: null}
    </div>)
  }

  return (
    <div styleName="container">
      <UserTooltip {...props} localTimeInfo={localTimeInfoEl}/>
      <div styleName="member-detail">
        <div styleName="member-name">{userFullName}</div>
        {localWhStart && localWhEnd && <div styleName="wk-hour">WH: {localWhStart} - {localWhEnd}</div>}
        {localTime &&<div styleName="local-time">{isWorkingTime ? <SunIcon/>: <MoonIcon/>}Local time: {localTime}</div>}
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
  size: PropTypes.number
}

export default MemberItem
