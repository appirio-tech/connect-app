import _ from 'lodash'
import moment from 'moment'

import {
  PROJECT_ROLE_CUSTOMER,
  PROJECT_ROLE_OWNER,
  PHASE_STATUS_ACTIVE,
  PHASE_STATUS_COMPLETED,
  PHASE_STATUS_DRAFT,
} from '../config/constants'

import { formatNumberWithCommas } from './format'

export const getProjectRoleForCurrentUser = ({currentUserId, project}) => {
  let role = null
  if (project) {
    const member = _.find(project.members, m => m.userId === currentUserId)
    if (member) {
      role = member.role
      if (role === PROJECT_ROLE_CUSTOMER && member.isPrimary)
        role = PROJECT_ROLE_OWNER
    }
  }
  return role
}

export const setDuration = ({duration, status}) => {
  let percent =''
  let title = ''
  let text = ''
  let type = 'completed' // default
  if (duration  && duration.plannedDuration) {
    const {actualDuration, plannedDuration} = duration
    if (status === 'draft') {
      title = 'Duration'
      percent = 0
      text = 'Complete specification to get estimate'
    } else if (status === 'in_review') {
      title = 'Duration'
      percent = 0
      text = 'Pending review'
    } else if (status === 'reviewed') {
      title = `${plannedDuration} days (projected)`
      percent = 0
      text = `${plannedDuration} days remaining`
    } else if (status === 'completed') {
      title = 'Completed'
      percent = 100
      text = ''
      type = 'completed'
    } else {
      text = `Day ${actualDuration} of ${plannedDuration}`
      percent = actualDuration / plannedDuration * 100
      if (0 <= percent && percent < 100) {
        const diff = plannedDuration - actualDuration
        title = `${diff} ${diff > 1 ? 'days' : 'day'} remaining`
        type = 'working'
      } else {
        percent = 100
        type = 'error'
        const diff = actualDuration - plannedDuration
        title = `${diff} ${diff > 1 ? 'days' : 'day'} over`
      }
    }
  } else {
    title = 'Duration'
    percent = 0
    text = status === 'draft' ? 'Complete specification to get estimate' : 'Estimate not entered'
  }
  return { title, text, percent, type }
}

/**
 * Format ProjectProgress props
 *
 * @param {Object} project project object
 * @param {Array}  phases  project phases
 *
 * @return {Object} ProjectProgress props
 */
export function formatProjectProgressProps(project, phases, productsTimelines) {
  let actualDuration = 0
  let now = new Date()
  now = now && moment(now)

  let totalProgress = 0

  // phases where start date is set and are not draft
  const nonDraftPhases = _.filter(phases, (phase) => (phase.startDate && phase.status !== PHASE_STATUS_DRAFT))
  const activeAndCompletedPhases = _.filter(phases, (phase) => (phase.startDate && (phase.status === PHASE_STATUS_ACTIVE || phase.status === PHASE_STATUS_COMPLETED)))
  activeAndCompletedPhases.map((phase) => {
    let progress = 0
    // calculates days spent and day based progress for the phase
    if (phase.startDate && phase.duration) {
      const startDate = moment(phase.startDate)
      const duration = now.diff(startDate, 'days') + 1
      if(duration >= 0) {
        if(duration < phase.duration || duration === phase.duration) {
          progress = (duration / phase.duration) * 100
          actualDuration += duration
        } else {
          progress = 100
          actualDuration += phase.duration
        }
      }
    }
    // override the progress use custom progress set by manager
    if (phase.progress) {
      progress = phase.progress
    }

    // calculate progress of phase
    const timeline = productsTimelines[phase.products[0].id].timeline
    if (timeline && timeline.milestones && timeline.milestones.length > 0) {
      const timelineNow = moment().utc()
      let tlPlannedDuration = 0
      let tlCurrentDuration = 0
      let allMilestonesComplete = true
      _.forEach(timeline.milestones, milestone => {
        if (!milestone.hidden) {
          tlPlannedDuration+=milestone.duration
          const range = moment.range(milestone.startDate, milestone.endDate)
          if (milestone.completionDate) {
            tlCurrentDuration += milestone.duration
          } else if (range.contains(timelineNow)) {
            tlCurrentDuration += timelineNow.diff(milestone.startDate, 'days')
            allMilestonesComplete = false
          } else {
            allMilestonesComplete = false
          }
        }
      })

      let tlProgressInPercent = tlPlannedDuration > 0
        ? Math.round((tlCurrentDuration / tlPlannedDuration) * 100)
        : null
      if (allMilestonesComplete) {
        tlProgressInPercent = 100
      }
      progress = tlProgressInPercent
    } else {
      progress = phase.progress ? phase.progress : 0
    }

    // override project progress if status is delivered
    if (phase.status === PHASE_STATUS_COMPLETED) {
      progress = 100
      //this line could be added if we want the progress bar to consider complete duration of phase,
      // incase phase is marked completed before actual endDate
      //actualDuration += phase.duration
    }
    totalProgress += progress
  })

  // calculate projected Duration of all non draft phases
  const projectedDuration = projectPlannedDuration(nonDraftPhases, productsTimelines)

  const labelDayStatus = `Day ${actualDuration} of ${projectedDuration}`

  const spentAmount = _.sumBy(activeAndCompletedPhases, 'spentBudget') || 0
  const labelSpent = spentAmount > 0 ? `Spent $${formatNumberWithCommas(spentAmount)}` : ''
  const progressPercent = phases.length > 0 ? Math.round(totalProgress/activeAndCompletedPhases.length) : 0
  const labelStatus = `${progressPercent}% done`

  return {
    labelDayStatus,
    labelSpent,
    labelStatus,
    progressPercent,
  }
}

/**
 *
 * gets duration of project based on milestones durations
 *
 * @param {Object} nonDraftPhases all non draft phases
 * @param {Object} productsTimelines all products timelines
 *
 * @return {duration} planned duration of project
 */
export function projectPlannedDuration(nonDraftPhases, productsTimelines) {
  const phasesActualData = nonDraftPhases.map((phase) => {
    const product = _.get(phase, 'products[0]')
    const timeline = _.get(productsTimelines, `[${product.id}].timeline`)
    return getPhaseActualData(phase, timeline)
  })

  const startDates = _.compact(phasesActualData.map((phase) =>
    phase.startDate ? moment(phase.startDate) : null
  ))
  const endDates = _.compact(phasesActualData.map((phase) =>
    phase.endDate ? moment(phase.endDate) : null
  ))
  const minStartDate = startDates.length > 0 ? moment.min(startDates) : null
  const maxEndDate = endDates.length > 0 ? moment.max(endDates) : null

  const projectedDuration = maxEndDate ? maxEndDate.diff(minStartDate, 'days') + 1 : 0
  return projectedDuration
}

/**
 * Format ProjectProgress props for old projects
 *
 * @param {Object} project project object
 *
 * @return {Object} ProjectProgress props
 */
export function formatOldProjectProgressProps(project) {
  const actualDuration = _.get(project, 'duration.actualDuration', 0)
  const projectedDuration = _.get(project, 'duration.projectedDuration', 0)
  const actualCost = _.get(project, 'budget.actualCost', 0)

  const progressPercent = projectedDuration !== 0 ? Math.round(actualDuration/projectedDuration) : 0
  const labelDayStatus = `Day ${actualDuration} of ${projectedDuration}`
  const labelSpent = `Spent $${formatNumberWithCommas(actualCost)}`
  const labelStatus = `${progressPercent}% done`

  return {
    labelDayStatus,
    labelSpent,
    labelStatus,
    progressPercent,
  }
}

/**
 * Gets actual data of the phase depend if phase has timeline or no
 *
 * @param {Object} phase    phase
 * @param {Object} timeline timeline
 *
 * @returns {{ startDate: moment.Moment, endDate: moment.Moment, duration: Number, progress: Number }} actual data
 */
export function getPhaseActualData(phase, timeline) {
  let startDate
  let endDate
  let duration
  let progress

  // if phase's product doesn't have timeline get data from phase
  if (!timeline ||  !timeline.milestones || timeline.milestones.length < 1) {
    startDate = phase.startDate && moment.utc(phase.startDate)
    endDate = phase.endDate && moment.utc(phase.endDate)
    duration = phase.duration ? phase.duration : 0
    progress = phase.progress ? phase.progress : 0

  // if phase's product has timeline get data from timeline
  } else {
    const firstMilestone = timeline.milestones[0]
    startDate = moment.utc(firstMilestone.startDate)
    startDate = firstMilestone.actualStartDate ? moment.utc(firstMilestone.actualStartDate) : startDate
    const lastMilestone = timeline.milestones[timeline.milestones.length - 1]
    endDate = moment.utc(lastMilestone.startDate).add(lastMilestone.duration - 1, 'days')
    endDate = lastMilestone.completionDate ? moment.utc(lastMilestone.completionDate) : endDate
    // add one day here to include edge days, also makes sense if start/finish the same day
    duration = endDate.diff(startDate, 'days') + 1

    // calculate progress of phase
    const now = moment().utc()
    let tlPlannedDuration = 0
    let tlCurrentDuration = 0
    let allMilestonesComplete = true

    _.forEach(timeline.milestones, milestone => {
      if (!milestone.hidden) {
        tlPlannedDuration+=milestone.duration
        const range = moment.range(milestone.startDate, milestone.endDate)
        if (milestone.completionDate) {
          tlCurrentDuration += milestone.duration
        } else if (range.contains(now)) {
          tlCurrentDuration += now.diff(milestone.startDate, 'days')
          allMilestonesComplete = false
        } else {
          allMilestonesComplete = false
        }
      }
    })

    let tlProgressInPercent = tlPlannedDuration > 0
      ? Math.round((tlCurrentDuration / tlPlannedDuration) * 100)
      : null
    if (allMilestonesComplete) {
      tlProgressInPercent = 100
    }
    progress = tlProgressInPercent
  }

  return {
    startDate,
    endDate,
    duration,
    progress,
  }
}
