/**
 * Helpers related to workstream
 */
import _ from 'lodash'
import moment from 'moment'
import { getChallengeStartEndDate } from './challenges'
import { getPhaseActualData } from './projectHelper'
import { MILESTONE_STATUS } from '../config/constants'


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
export const isJson = (str) => {
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

/**
 * Gets actual data of the milestone
 *
 * @param {Object} timeline    work object
 * @param {Array} milestones    array of milestone object
 * @param {Object} milestone    work object
 * @param {Bool} isCreateNew    is create new
 *
 * @returns {{ startDate: moment.Moment, endDate: moment.Moment }} actual data
 */
export function getMilestoneActualData(timeline, milestones, milestone, isCreateNew) {
  let startDate
  let endDate
  let duration = 0
  if (milestone && !isCreateNew) {
    startDate = moment(milestone.startDate)
    endDate = moment(milestone.endDate)
    duration = milestone.duration
  } else {
    // is create new
    if (milestones.length > 0) {
      const lastMilestone = milestones[milestones.length - 1]
      startDate = moment(lastMilestone.endDate)
      endDate = moment(lastMilestone.endDate).add(5, 'days')
    } else {
      startDate = moment(timeline.startDate)
      endDate = moment(timeline.startDate).add(5, 'days')
    }
    duration = milestone.duration
  }

  return {
    startDate: moment(startDate).format('YYYY-MM-DD'),
    endDate: moment(endDate).format('YYYY-MM-DD'),
    duration
  }
}

/**
 * Convert the milestones of timeline to array of milestone with progress
 *
 * @param {Object} timeline    timeline object
 *
 * @returns {Array} actual data
 */
export function convertTimelineMilestonesToMilestoneProgress(timeline) {
  if (!timeline || !timeline.milestones || !timeline.milestones.length) {
    return []
  }

  const {
    duration: timelineDurationDays,
  } = getPhaseActualData({}, timeline)

  const today = moment()
  const milestones = _.orderBy(timeline.milestones, 'order', ['asc'])

  return milestones.map((milestone, index) => {
    const startDate = moment.utc(milestone.actualStartDate || milestone.startDate)
    const endDate = moment.utc(milestone.completionDate || milestone.endDate)
    // count the last day as remaining
    const daysLeft = endDate.diff(today, 'days') + 1
    const daysWord = Math.abs(daysLeft) === 1 ? 'day' : 'days'
    const isLate = daysLeft < 0
    // we show progress with day granularity, because we keep all the dates with rounding to the day
    const progress = isLate ? 1 : (milestone.duration - daysLeft) / milestone.duration
    let width = 0
    let isStart = false
    let isEnd = false

    if (timelineDurationDays > 0) {
      width = `${milestone.duration * 100 / timelineDurationDays}%`
    } else {
      width = `${100 / milestones.length}%`
    }

    if (index === 0) {
      isStart = true
    }

    if (index === milestones.length - 1) {
      // last milestone
      isEnd = true
    }

    return {
      name: milestone.name,
      id: milestone.id,

      isStart,
      isEnd,

      startDateString: startDate.format('MMM DD'),
      endDateString: endDate.format('MMM DD'),

      isPast: milestone.status === MILESTONE_STATUS.COMPLETED,
      isCurrentMilestone: milestone.status === MILESTONE_STATUS.ACTIVE,
      isFuture: !_.includes([MILESTONE_STATUS.COMPLETED, MILESTONE_STATUS.ACTIVE], milestone.status),

      currentProgressWidth: `${progress * 100}%`,
      daysRemaining: daysLeft < 0 ? `${-daysLeft} ${daysWord} delayed` : `${daysLeft} ${daysWord} remaining`,
      isLate,
      width,
    }
  })
}

/**
 * Get start/end date of workitem
 *
 * @param {Object}  workitem    work item
 *
 * @returns {{ startDate: moment.Moment, endDate: moment.Moment }} start/end date of challenge
 *
 */
export function getWorkItemStartEndDate(workitem) {
  if (!workitem.challenge) {
    return {
      startDate: '',
      endDate: '',
    }
  }
  return getChallengeStartEndDate(workitem.challenge)
}

export const select = {
  /**
   * Get work timeline by `workId`
   *
   * @param {Object} state  Redux state
   * @param {Number} workId work id
   *
   * @returns {Object} timeline
   */
  workTimeline: (state, workId) => _.get(state, `workTimelines.timelines[${workId}].timeline`),

  /**
   * Get work
   *
   * @param {Object} state        Redux state
   * @param {Number} workId       work id
   *
   * @returns {Object} work
   */
  work: (state, workId) => {
    const work = _.get(state, 'works.work')

    return work && work.id === workId ? work : undefined
  },
}

/**
 * Build milestone object to create based on the `basicProps`
 *
 * Determine correct start/end dates, order and other mandatory
 * default properties for a new milestone.
 *
 * @param {Object} work       work
 * @param {Object} timeline   timeline
 * @param {Object} basicProps basic milestone properties
 *
 * @returns {Object} milestone object ready for creating
 */
export function buildMilestoneToCreate(work, timeline, basicProps) {
  const maxOrder = timeline.milestones.length > 0 ? _.maxBy(timeline.milestones, 'order').order : 0

  const defaultProps = {
    duration: 1,
    status: MILESTONE_STATUS.PLANNED,
    order: maxOrder + 1,
  }

  const newMilestone = {
    ...defaultProps,
    ...basicProps,
  }

  const { startDate, endDate } = timeline.milestones.length > 0
    // if have milestones, then calculate start/end date based on milestones
    ? getPhaseActualData(work, timeline)
    // otherwise just take them from the `timeline`
    : timeline
  let milestoneStartDate

  // if timeline has `endDate` then start the next milestone the next day
  if (endDate) {
    milestoneStartDate = moment.utc(endDate).add(1, 'day')

  // if timeline doesn't have `endDate` (means no milestones) use `startDate`
  } else if (startDate) {
    milestoneStartDate = moment.utc(startDate)
  }

  // overwrite the start/end date for new milestone
  newMilestone.startDate = milestoneStartDate.format()
  newMilestone.endDate = milestoneStartDate.clone().add(newMilestone.duration - 1, 'days').format()


  return newMilestone
}