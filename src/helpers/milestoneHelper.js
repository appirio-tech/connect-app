import _ from 'lodash'
import moment from 'moment'

import { MILESTONE_STATUS } from '../config/constants'
import { MILESTONE_STATUS_TEXT } from '../config/constants'

export const getMilestoneStatusText = (milestone) => {
  const status = milestone && milestone.status ? milestone.status : MILESTONE_STATUS.PLANNED
  const statusTextMap = _.find(MILESTONE_STATUS_TEXT, s => s.status === status)
  const statusText = statusTextMap ? statusTextMap.textValue : MILESTONE_STATUS.PLANNED
  return milestone[statusText]
}

export const getDaysLeft = (milestone) => {
  const today = moment().hours(0).minutes(0).seconds(0).milliseconds(0)
  const endDate = moment(milestone.startDate).add(milestone.duration - 1, 'days')
  const daysLeft = endDate.diff(today, 'days')

  return daysLeft
}

export const getHoursLeft = (milestone) => {
  const endDate = moment(milestone.startDate).add(milestone.duration - 1, 'days')
  const hoursLeft = endDate.diff(moment(), 'hours')

  return hoursLeft
}

export const getTotalDays = (milestone) => {
  const startDate = moment(milestone.actualStartDate || milestone.startDate)
  const endDate = moment(milestone.startDate).add(milestone.duration - 1, 'days')
  const totalDays = endDate.diff(startDate, 'days')

  return totalDays
}

export const getProgressPercent = (totalDays, daysLeft) => {
  const progressPercent = daysLeft > 0
    ? (totalDays - daysLeft) / totalDays * 100
    : 100

  return progressPercent
}