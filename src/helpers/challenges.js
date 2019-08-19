/**
 * Helpers related to challenges
 */
import _ from 'lodash'
import moment from 'moment'

/**
 * Set template id for challenge
 *
 * @param {Object}  challenges    challenge list
 * @param {Object}  productTemplates    product template list
 *
 */
export function updateTemplateIdForChallenge(challenges, productTemplates) {
  for (const challenge of challenges) {
    if (!challenge.templateId) {
      const productKey=`challenge-${challenge.subTrack}`
      challenge.templateId = _.get(_.find(productTemplates, { productKey }), 'id')
    }
  }
}

/**
 * Set template for workitem
 *
 * @param {Array}  workitems    challenge list
 * @param {Object}  productTemplates    product template list
 *
 */
export function updateTemplateForWorkItem(workitems, productTemplates) {
  for (const workitem of workitems) {
    workitem.productTemplate = _.find(productTemplates, { id: workitem.templateId })
  }
}

/**
 * Get start/end date of challenge
 *
 * @param {Object}  challenge    challenge
 *
 * @returns {{ startDate: moment.Moment, endDate: moment.Moment }} start/end date of challenge
 *
 */
export function getChallengeStartEndDate(challenge) {
  let startDate
  let endDate
  for (const phase of challenge.allPhases) {
    const startDatePhase = moment(phase.actualStartTime ? phase.actualStartTime : phase.scheduledStartTime)
    const endDatePhase = moment(phase.actualEndTime ? phase.actualEndTime : phase.scheduledEndTime)
    if (!startDate) {
      startDate = startDatePhase
      endDate = endDatePhase
    } else {
      if (startDatePhase < startDate) {
        startDate = startDatePhase
      }
      if (endDatePhase > endDate) {
        endDate = endDatePhase
      }
    }
  }

  return {
    startDate,
    endDate
  }
}