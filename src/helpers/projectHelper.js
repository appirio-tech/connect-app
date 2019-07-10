import _ from 'lodash'
import moment from 'moment'
import { findProduct } from '../config/projectWizard'

import {
  PROJECT_ROLE_CUSTOMER,
  PROJECT_ROLE_OWNER,
  PHASE_STATUS_ACTIVE,
  PHASE_STATUS_COMPLETED,
  PHASE_STATUS_REVIEWED,
  PHASE_STATUS_DRAFT,
  PROJECT_CATALOG_URL,
  NEW_PROJECT_PATH,
} from '../config/constants'

import FileIcon from '../assets/icons/file.svg'
import InvisibleIcon from '../assets/icons/invisible.svg'

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
 * @param {Object} project           project object
 * @param {Array}  phases            project phases
 * @param {Object} productsTimelines all products timelines
 *
 * @return {Object} ProjectProgress props
 */
export function formatProjectProgressProps(project, phases, productsTimelines) {
  // duration in days
  const plannedDuration = getProjectPlannedDuration(phases, productsTimelines)
  const actualDuration = getProjectActualDuration(phases, productsTimelines)
  const delay = actualDuration - plannedDuration
  const labelDayStatus = delay > 0
    ? `Delayed by ${delay} day${delay === 1 ? '' : 's'}`
    : `Day ${actualDuration} of ${plannedDuration}`
  const theme = delay > 0 ? 'warning' : null

  // these phases contribute to the whole progress of the project
  // we need them to calculate the total progress percentage
  const activeAndCompletedAndReviewedPhases = _.filter(phases,
    (phase) => _.includes([PHASE_STATUS_ACTIVE, PHASE_STATUS_COMPLETED, PHASE_STATUS_REVIEWED], phase.status)
  )

  const phasesProgresses = activeAndCompletedAndReviewedPhases.map((phase) => {
    const product = _.get(phase, 'products[0]')
    const timeline = _.get(productsTimelines, `[${product.id}].timeline`)
    return getPhaseActualData(phase, timeline).progress
  })

  const totalProgress = _.sum(phasesProgresses)
  const spentAmount = _.sumBy(activeAndCompletedAndReviewedPhases, 'spentBudget') || 0
  const labelSpent = spentAmount > 0 ? `Spent $${formatNumberWithCommas(spentAmount)}` : ''
  const progressPercent = phases.length > 0 ? Math.round(totalProgress/activeAndCompletedAndReviewedPhases.length) : 0
  const labelStatus = `${progressPercent}% done`

  return {
    labelDayStatus,
    labelSpent,
    labelStatus,
    progressPercent,
    theme,
  }
}

/**
 * Gets planned duration of project based on phases/milestones durations (if have)
 *
 * @param {Object} phases            all project phases
 * @param {Object} productsTimelines all products timelines
 *
 * @return {duration} planned duration of project
 */
export function getProjectPlannedDuration(phases, productsTimelines) {
  const nonDraftPhases = _.reject(phases, { status: PHASE_STATUS_DRAFT })
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
 * Gets actual (current) duration of project based on phases/milestones durations (if have)
 *
 * @param {Object} phases            all project phases
 * @param {Object} productsTimelines all products timelines
 *
 * @return {duration} planned duration of project
 */
export function getProjectActualDuration(phases, productsTimelines) {
  const activeAndCompletedPhases = _.filter(phases,
    (phase) => _.includes([PHASE_STATUS_ACTIVE, PHASE_STATUS_COMPLETED], phase.status)
  )
  const today = moment()
  const phasesActualData = activeAndCompletedPhases.map((phase) => {
    const product = _.get(phase, 'products[0]')
    const timeline = _.get(productsTimelines, `[${product.id}].timeline`)
    const { startDate, endDate } = getPhaseActualData(phase, timeline)

    return {
      startDate,
      // for all active phases use today as endDate
      endDate: phase.status === PHASE_STATUS_ACTIVE ? today : endDate,
    }
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

    if (startDate) {
      endDate = startDate.clone().add(duration, 'days')
    } else {
      startDate = moment().hours(0).minutes(0).seconds(0).milliseconds(0)
    }
    if (!endDate) {
      endDate = moment().hours(0).minutes(0).seconds(0).milliseconds(0)
    }

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
    let tlPlannedDuration = 0
    let tlCurrentDuration = 0
    let allMilestonesComplete = true

    _.forEach(timeline.milestones, milestone => {
      if (!milestone.hidden) {
        tlPlannedDuration+=milestone.duration
        if (milestone.completionDate) {
          tlCurrentDuration += milestone.duration
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

/**
 * Checks if project has estimations
 *
 * TODO $PROJECT_PLAN$
 *   returns NO HAVE estimations until we get real data from server
 *   see https://github.com/appirio-tech/connect-app/issues/2016#issuecomment-400552992
 *
 * NOTE This function has been created during refactoring of the old code and hasn't beed really tested.
 *
 * @param {Object} project
 *
 * @returns {Boolean} true if project has estimation data
 */
export function isProjectEstimationPresent(project) {
  // check if project has estimation the same way as VisualDesignProjectEstimateSection does
  // probably this can be done in more elegant way
  const { products } = project.details
  const productId = products ? products[0] : null
  const product = findProduct(productId)

  const hasEstimation = product && typeof product.basePriceEstimate !== 'undefined'

  return hasEstimation && false
}

/**
 * Calculate the new project link using orgConfig
 *
 * @param {Array} orgConfigs    organization configs
 *
 * @return {String} new project link
 */
export function getNewProjectLink(orgConfigs) {
  orgConfigs = _.filter(orgConfigs, (o) => { return o.configName === PROJECT_CATALOG_URL })
  if(orgConfigs.length === 1) return orgConfigs[0].configValue
  return NEW_PROJECT_PATH
}

/**
 * Get the list of navigation links for project details view
 * @param {Object} project - The project object
 * @param {string} projectId - The project id
 */
export function getProjectNavLinks(project, projectId) {
  // choose set of menu links based on the project version
  const navLinks = project.version === 'v3' ? [
    { label: 'Dashboard', to: `/projects/${projectId}`, Icon: FileIcon },
    { label: 'Messages', to: `/projects/${projectId}/messages`, Icon: FileIcon },
    { label: 'Scope', to: `/projects/${projectId}/scope`, Icon: FileIcon },
    { label: 'Project Plan', to: `/projects/${projectId}/plan`, Icon: FileIcon },
    { label: 'Reports', to: '#', Icon: FileIcon },
    { label: 'Assets Library', to: '#', Icon: FileIcon },
  ] : [
    { label: 'Dashboard', to: `/projects/${projectId}`, Icon: FileIcon },
    { label: 'Specification', to: `/projects/${projectId}/specification`, Icon: FileIcon },
  ]

  // `Discussions` items can be added as soon as project is loaded
  // if discussions are not hidden for it
  if (project.details && !project.details.hideDiscussions) {
    navLinks.push({ label: 'Discussions', to: `/projects/${projectId}/discussions`, Icon: InvisibleIcon })
  }

  return navLinks
}
