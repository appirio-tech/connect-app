import _ from 'lodash'
import moment from 'moment'
import update from 'react-addons-update'

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
  const milestoneStartDate = milestone.actualStartDate ? milestone.actualStartDate : milestone.startDate
  const endDate = moment(milestoneStartDate).add(milestone.duration - 1, 'days')
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

function mergeJsonObjects(targetObj, sourceObj) {
  return _.mergeWith({}, targetObj, sourceObj, (target, source) => {
    // Overwrite the array
    if (_.isArray(source)) {
      return source
    }
  })
}

function updateMilestone(milestone, updatedProps) {
  const entityToUpdate = updatedProps
  const durationChanged = entityToUpdate.duration && entityToUpdate.duration !== milestone.duration
  const statusChanged = entityToUpdate.status && entityToUpdate.status !== milestone.status
  const completionDateChanged = entityToUpdate.completionDate
    && !_.isEqual(milestone.completionDate, entityToUpdate.completionDate)
  const today = moment.utc().hours(0).minutes(0).seconds(0).milliseconds(0)

  // Merge JSON fields
  entityToUpdate.details = mergeJsonObjects(milestone.details, entityToUpdate.details)

  let actualStartDateCanged = false
  // if status has changed
  if (statusChanged) {
    // if status has changed to be completed, set the compeltionDate if not provided
    if (entityToUpdate.status === MILESTONE_STATUS.COMPLETED) {
      entityToUpdate.completionDate = entityToUpdate.completionDate ? entityToUpdate.completionDate : today.toISOString()
      entityToUpdate.duration = moment.utc(entityToUpdate.completionDate)
        .diff(entityToUpdate.actualStartDate, 'days') + 1
    }
    // if status has changed to be active, set the startDate to today
    if (entityToUpdate.status === MILESTONE_STATUS.ACTIVE) {
      // NOTE: not updating startDate as activating a milestone should not update the scheduled start date
      // entityToUpdate.startDate = today
      // should update actual start date
      entityToUpdate.actualStartDate = today.toISOString()
      actualStartDateCanged = true
    }
  }

  // Updates the end date of the milestone if:
  // 1. if duration of the milestone is udpated, update its end date
  // OR
  // 2. if actual start date is updated, updating the end date of the activated milestone because
  // early or late start of milestone, we are essentially changing the end schedule of the milestone
  if (durationChanged || actualStartDateCanged) {
    const updatedStartDate = actualStartDateCanged ? entityToUpdate.actualStartDate : milestone.startDate
    const updatedDuration = _.get(entityToUpdate, 'duration', milestone.duration)
    entityToUpdate.endDate = moment.utc(updatedStartDate).add(updatedDuration - 1, 'days').toDate().toISOString()
  }

  // if completionDate has changed
  if (!statusChanged && completionDateChanged) {
    entityToUpdate.duration = moment.utc(entityToUpdate.completionDate)
      .diff(entityToUpdate.actualStartDate, 'days') + 1
    entityToUpdate.status = MILESTONE_STATUS.COMPLETED
  }

  return update(milestone, {$merge: entityToUpdate})
}

/**
 * Cascades endDate/completionDate changes to all milestones with a greater order than the given one.
 * @param {Object} origMilestone the original milestone that was updated
 * @param {Object} updMilestone the milestone that was updated
 * @returns {Promise<void>} a promise that resolves to the last found milestone. If no milestone exists with an
 * order greater than the passed <b>updMilestone</b>, the promise will resolve to the passed
 * <b>updMilestone</b>
 */
function updateComingMilestones(origMilestone, updMilestone, timelineMilestones) {
  // flag to indicate if the milestone in picture, is updated for completionDate field or not
  const completionDateChanged = !_.isEqual(origMilestone.completionDate, updMilestone.completionDate)
  const today = moment.utc().hours(0).minutes(0).seconds(0).milliseconds(0).toISOString()
  // updated milestone's start date, pefers actual start date over scheduled start date
  const updMSStartDate = updMilestone.actualStartDate ? updMilestone.actualStartDate : updMilestone.startDate
  // calculates schedule end date for the milestone based on start date and duration
  let updMilestoneEndDate = moment.utc(updMSStartDate).add(updMilestone.duration - 1, 'days').toDate()
  // if the milestone, in context, is completed, overrides the end date to the completion date
  updMilestoneEndDate = updMilestone.completionDate ? updMilestone.completionDate : updMilestoneEndDate

  const affectedMilestones = timelineMilestones.filter(milestone => milestone.order > updMilestone.order)
  const comingMilestones = _.sortBy(affectedMilestones, 'order')
  // calculates the schedule start date for the next milestone
  let startDate = moment.utc(updMilestoneEndDate).add(1, 'days').toDate().toISOString()
  let firstMilestoneFound = false

  let updatedTimelineMilestones = timelineMilestones
  for (let i = 0; i < comingMilestones.length; i += 1) {
    const updateProps = {}
    const milestone = comingMilestones[i]

    // Update the milestone startDate if different than the iterated startDate
    if (!_.isEqual(milestone.startDate, startDate)) {
      updateProps.startDate = startDate
      updateProps.updatedBy = updMilestone.updatedBy
    }

    // Calculate the endDate, and update it if different
    const endDate = moment.utc(updateProps.startDate || milestone.startDate).add(milestone.duration - 1, 'days').toDate().toISOString()
    if (!_.isEqual(milestone.endDate, endDate)) {
      updateProps.endDate = endDate
      updateProps.updatedBy = updMilestone.updatedBy
    }

    // if completionDate is alerted, update status of the first non hidden milestone after the current one
    if (!firstMilestoneFound && completionDateChanged && !milestone.hidden) {
      // activate next milestone
      updateProps.status = MILESTONE_STATUS.ACTIVE
      updateProps.actualStartDate = today
      firstMilestoneFound = true
    }

    // if milestone is not hidden, update the startDate for the next milestone, otherwise keep the same startDate for next milestone
    if (!milestone.hidden) {
      // Set the next startDate value to the next day after completionDate if present or the endDate
      startDate = moment.utc(milestone.completionDate
        ? milestone.completionDate
        : updateProps.endDate || milestone.endDate).add(1, 'days').toDate().toISOString()
    }

    const milestoneIdx = updatedTimelineMilestones.findIndex(item => item.id === milestone.id)
    updatedTimelineMilestones = update(updatedTimelineMilestones, {[milestoneIdx]: {$merge: updateProps}})
  }

  return updatedTimelineMilestones
}

function cascadeMilestones(originalMilestone, updatedMilestone, timelineMilestones) {
  const original = originalMilestone
  const updated = updatedMilestone

  // we need to recalculate change in fields because we update some fields before making actual update
  const needToCascade = !_.isEqual(original.completionDate, updated.completionDate) // completion date changed
    || original.duration !== updated.duration // duration changed
    || original.actualStartDate !== updated.actualStartDate // actual start date updated

  if (needToCascade) {
    const updatedMilestones = updateComingMilestones(original, updated, timelineMilestones)
    return updatedMilestones
  }

  return timelineMilestones
}

export const processUpdateMilestone = (milestone, updatedProps, timelineMilestones) => {
  let updatedTimelineMilestones

  const updatedMilestone = updateMilestone(milestone, updatedProps)

  const milestoneIdx = timelineMilestones.findIndex(item => item.id === updatedMilestone.id)
  updatedTimelineMilestones = update(timelineMilestones, { [milestoneIdx]: { $set: updatedMilestone } })

  updatedTimelineMilestones = cascadeMilestones(milestone, updatedMilestone, updatedTimelineMilestones)

  return { updatedMilestone, updatedTimelineMilestones }
}
