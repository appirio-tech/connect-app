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
  const milestones = _.orderBy(timeline.milestones, o => moment(o.startDate), ['asc'])
  const updatedMilestones = []
  const startTimelineTS = moment(milestones[0].startDate).unix()
  const endTimelineTS = moment(milestones[milestones.length - 1].endDate).unix()
  const durationTimeline = endTimelineTS - startTimelineTS
  let isPassToday = false
  for (let index = 0; index < milestones.length; index++) {
    const milestone = milestones[index]
    const startDate = moment(milestone.startDate)
    let endDate = moment(milestone.endDate)
    const startDateTS = startDate.unix()
    let endDateTS = endDate.unix()
    let duration = endDateTS - startDateTS
    let durationOfTodayInCurrentMilestone = 0
    const updatedMilestone = {
      isEnd: false,
      isStart: false,
      startDateString: startDate.format('MMM DD'),
      endDateString: endDate.format('MMM DD'),
      isPast: false,
      isCurrentMilestone: false,
      isFuture: false,
      progress: 0,
      progressWidth: '0%',
      currentProgressWidth: '0%',
      name: milestone.name,
      daysRemaining: '',
      id: milestone.id,
    }

    if (index === milestones.length - 1) {
      // last milestone
      updatedMilestone.isEnd = true
      updatedMilestone.progressWidth = 'auto'
    }

    if (index < milestones.length - 1 || index === 0) {
      updatedMilestone.isStart = true
    }

    if (!isPassToday) {
      if (index < milestones.length - 1) {
        const nextMilestone = milestones[index + 1]
        endDate = moment(nextMilestone.startDate)
        endDateTS = endDate.unix()
        duration = endDateTS - startDateTS
      }
      const today = moment()
      if (startDate <= today && today <= endDate) {
        isPassToday = true
        updatedMilestone.isCurrentMilestone = true
        if (duration) {
          durationOfTodayInCurrentMilestone = (today.unix() - startDate.unix()) * 100 / duration
          updatedMilestone.currentProgressWidth = `${durationOfTodayInCurrentMilestone}%`
        } else {
          updatedMilestone.currentProgressWidth = '100%'
        }
        const daysRemaining = endDate.diff(today, 'days')
        updatedMilestone.daysRemaining = `${daysRemaining} day${daysRemaining > 1 ? 's' : ''} remaining`
      }

      if (today >= endDate) {
        updatedMilestone.isPast = true
      } else {
        isPassToday = true
      }
    } else {
      updatedMilestone.isFuture = true
    }

    if (durationTimeline) {
      updatedMilestone.progress = duration * 100 / durationTimeline
      updatedMilestone.progressWidth = `${updatedMilestone.progress}%`
    }
    if (!duration) {
      updatedMilestone.progress = 0
      updatedMilestone.progressWidth = `${updatedMilestone.progress}%`
    }
    updatedMilestones.push(updatedMilestone)
  }

  return updatedMilestones
}