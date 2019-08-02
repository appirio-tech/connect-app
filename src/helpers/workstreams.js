/**
 * Helpers related to workstream
 */
import _ from 'lodash'
import moment from 'moment'

/**
 * Get number of days to delivery
 *
 * @param {Object}  workstream    workstream object
 *
 * @return {string} string for number of days to be delivery
 */
export function getDaysToDelivery(workstream) {
  if (workstream.works.length === 0) {
    return ''
  }

  let workstreamEndDate
  for(const work of workstream.works) {
    const endDate = moment(work.endDate)
    if (!workstreamEndDate) {
      workstreamEndDate = endDate
    }
    if (endDate > workstreamEndDate) {
      workstreamEndDate = endDate
    }
  }

  const todate = moment()
  const days = workstreamEndDate.diff(todate, 'days')

  return `${(days >= 0) ? (days + ' days to delivery') : (-days + ' days delayed')} (${workstreamEndDate.format('MMMM DD')})`
}

/**
 * Get active work filter
 */
export const getActiveWorkFilter = (work) => { if (work.status === 'active') return work }

/**
 * Get delivered work filter
 */
export const getDeliveredWorkFilter = (work) => { if (work.status === 'completed') return work }


/**
 * Check if string is json
 * @param {String} str string
 *
 * @return {Bool} if string is json or not
 */
const isJson = (str) => {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

/**
 * Parse error object
 * @param {Object} action request action
 *
 * @return {Object} meaningful error object
 */
export const parseErrorObj = (action) => {
  const data = _.get(action.payload, 'response.data.result')
  const httpStatus = _.get(action.payload, 'response.status')
  const details = _.get(data, 'details', null)
  return {
    type: action.type,
    code: _.get(data, 'status', httpStatus || 500),
    msg: _.get(data, 'content.message', ''),
    details: isJson(details) ? JSON.parse(details) : details
  }
}

/**
 * Gets actual data of the work
 *
 * @param {Object} work    work object
 * @param {Bool} isCreateNew    is create new
 *
 * @returns {{ startDate: moment.Moment, endDate: moment.Moment, duration: Number, progress: Number, spentBudget: Number, budget: Number }} actual data
 */
export function getWorkActualData(work, isCreateNew) {
  let startDate = work.startDate && moment.utc(work.startDate)
  let endDate = work.endDate && moment.utc(work.endDate)
  const duration = work.duration ? work.duration : 1
  const progress = work.progress ? work.progress : 0
  const spentBudget = work.spentBudget ? work.spentBudget : 0
  const budget = work.budget ? work.budget : 0

  if (startDate) {
    endDate = startDate.clone().add(duration, 'days')
  } else {
    startDate = moment().hours(0).minutes(0).seconds(0).milliseconds(0)
  }
  if (!endDate) {
    endDate = moment().hours(0).minutes(0).seconds(0).milliseconds(0)
  }


  return {
    startDate: isCreateNew ? '' : startDate,
    endDate: isCreateNew ? '' : endDate,
    duration: isCreateNew ? '' : duration,
    progress: isCreateNew ? '' : progress,
    spentBudget: isCreateNew ? '' : spentBudget,
    budget: isCreateNew ? '' : budget
  }
}