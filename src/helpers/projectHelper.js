import _ from 'lodash'
import moment from 'moment'
import { findProduct } from '../config/projectWizard'
import { PERMISSIONS } from 'config/permissions'
import { hasPermission } from 'helpers/permissions'

import {
  PHASE_STATUS_ACTIVE,
  PHASE_STATUS_COMPLETED,
  PHASE_STATUS_REVIEWED,
  PHASE_STATUS_DRAFT,
  PROJECT_CATALOG_URL,
  NEW_PROJECT_PATH,
} from '../config/constants'

import ScopeIcon from '../assets/icons/text-16px_list-bullet.svg'
import DashboardIcon from '../assets/icons/v.2.5/icon-dashboard.svg'
import MessagesIcon from '../assets/icons/v.2.5/icon-messages.svg'
import ReportsIcon from '../assets/icons/v.2.5/icon-reports.svg'
import AssetsLibraryIcon from '../assets/icons/v.2.5/icon-assets-library.svg'
import FAQIcon from '../assets/icons/faq.svg'
import AccountSecurityIcon from 'assets/icons/v.2.5/icon-account-security.svg'
import InvisibleIcon from '../assets/icons/invisible.svg'

import { formatNumberWithCommas } from './format'

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

    // if start date and duration are set, use them to calculate endDate
    if (!endDate && startDate && duration > 0) {
      endDate = startDate.clone().add(duration, 'days')
    }
    // default to today if start date not set
    if (!startDate) {
      startDate = moment().hours(0).minutes(0).seconds(0).milliseconds(0)
    }
    // default to today if end date not set
    if (!endDate) {
      endDate = moment().hours(0).minutes(0).seconds(0).milliseconds(0)
    }
    // re-caclulate the duration of the phase
    duration = endDate.diff(startDate, 'days') + 1

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
export function getProjectNavLinks(project, projectId, renderFAQs) {
  let messagesTab = null
  // `Discussions` items can be added as soon as project is loaded
  // if discussions are not hidden for it
  if (project.details && !project.details.hideDiscussions) {
    messagesTab = { label: 'Discussions', to: `/projects/${projectId}/discussions`, Icon: InvisibleIcon, iconClassName: 'fill' }
  } else {
    messagesTab = { label: 'Messages', to: `/projects/${projectId}/messages`, Icon: MessagesIcon, iconClassName: 'stroke', exact: false }
  }
  // choose set of menu links based on the project version
  const navLinks = project.version === 'v3' ? [
    { label: 'Dashboard', to: `/projects/${projectId}`, Icon: DashboardIcon, iconClassName: 'stroke' },
    messagesTab,
    { label: 'Scope', to: `/projects/${projectId}/scope`, Icon: ScopeIcon, iconClassName: 'fill' },
    // Commented out till it needs to go live.
    { label: 'Reports', to: `/projects/${projectId}/reports`, Icon: ReportsIcon, iconClassName: 'stroke' },
    { label: 'Assets Library', to: `/projects/${projectId}/assets`, Icon: AssetsLibraryIcon, iconClassName: 'stroke' },
  ] : [
    { label: 'Dashboard', to: `/projects/${projectId}`, Icon: DashboardIcon, iconClassName: 'stroke' },
    messagesTab,
    { label: 'Specification', to: `/projects/${projectId}/specification`, Icon: ScopeIcon, iconClassName: 'fill' },
  ]

  if (renderFAQs) {
    const faqTab = { label: 'FAQ', to: `/projects/${projectId}/faqs`, Icon: FAQIcon, iconClassName: 'fill' }
    navLinks.push(faqTab)
  }

  if (hasPermission(PERMISSIONS.VIEW_PROJECT_SETTINGS)) {
    navLinks.push({ label: 'Project Settings', to: `/projects/${projectId}/settings`, Icon: AccountSecurityIcon, iconClassName: 'stroke' })
  }

  return navLinks
}
