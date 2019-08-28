/**
 * Timelines and milestones API
 */
import _ from 'lodash'
import { axiosInstance as axios } from './requestInterceptor'
import { TC_API_URL } from '../config/constants'

/**
 * Get timeline by reference
 *
 * @return {Promise<[]>} list of timelines
 */
export function getTimelinesByReference(reference, referenceId) {
  const filterQuery = encodeURIComponent(`reference=${reference}&referenceId=${referenceId}`)

  return axios.get(`${TC_API_URL}/v4/timelines?filter=${filterQuery}`)
    .then(resp => _.get(resp.data, 'result.content', {}))
}

/**
 * Get a single timeline or throw error.
 *
 * @param {String} reference   reference, i. g. 'work', 'product'
 * @param {Number} referenceId reference id i. e. <work.id>, <product.id>
 *
 * @returns {Promise<Object>} timeline
 */
export function getSingleTimelineByReference(reference, referenceId) {
  return getTimelinesByReference(reference, referenceId)
    .then(timelines => {
      const timeline = timelines[0]

      if (!timeline) {
        const err = new Error('Timeline for work is not found.')
        _.set(err, 'response.data.result.content.message', 'Timeline for work is not found.')
        _.set(err, 'response.status', 404)

        throw err
      }

      return timeline
    })
}

/**
 * Get timeline by id
 *
 * @return {Promise} one timeline
 */
export function getTimelineById(id) {

  return axios.get(`${TC_API_URL}/v4/timelines/${id}`)
    .then(resp => _.get(resp.data, 'result.content', {}))
}

/**
 * Update milestone
 *
 * @param {Number} timelineId   timeline id
 * @param {Number} milestoneId  milestone id
 * @param {Object} updatedProps properties to update
 *
 * @returns {Promise} milestone
 */
export function updateMilestone(timelineId, milestoneId, updatedProps) {
  return axios.patch(`${TC_API_URL}/v4/timelines/${timelineId}/milestones/${milestoneId}`, {
    param: updatedProps,
  })
    .then(resp => _.get(resp.data, 'result.content'))
}

/**
 * Delete milestone
 *
 * @param {Number} timelineId   timeline id
 * @param {Number} milestoneId  milestone id
 *
 * @returns {Promise} empty
 */
export function deleteMilestone(timelineId, milestoneId) {
  return axios.delete(`${TC_API_URL}/v4/timelines/${timelineId}/milestones/${milestoneId}`)
}

/**
 * Get milestone
 *
 * @param {Number} timelineId   timeline id
 * @param {Number} milestoneId  milestone id
 *
 * @returns {Promise} milestone
 */
export function getMilestone(timelineId, milestoneId) {
  return axios.get(`${TC_API_URL}/v4/timelines/${timelineId}/milestones/${milestoneId}`)
    .then(resp => _.get(resp.data, 'result.content'))
}

/**
 * Create milestone
 *
 * @param {Number} timelineId   timeline id
 * @param {Object} milestone milestone
 *
 * @returns {Promise} milestone
 */
export function createMilestone(timelineId, milestone) {
  return axios.post(`${TC_API_URL}/v4/timelines/${timelineId}/milestones`, {
    param: milestone
  })
    .then(resp => _.get(resp.data, 'result.content', {}))
}

/**
 * Get milestone templates by product template id
 *
 * @param {Number} productTemplateId product template id
 *
 * @returns {Promise<[]>} list of milestone templates
 */
export function getMilestoneTemplates(productTemplateId) {
  return axios.get(`${TC_API_URL}/v4/productTemplates/${productTemplateId}/milestones`)
    .then(resp => _.get(resp.data, 'result.content', {}))
}

/**
 * Create timeline and milestones
 *
 * @param {Object} timeline timeline
 *
 * @returns {Promise} timeline
 */
export function createTimeline(timeline) {
  return axios.post(`${TC_API_URL}/v4/timelines`, {
    param: timeline
  })
    .then(resp => _.get(resp.data, 'result.content', {}))
}

/**
 * Update timeline
 *
 * @param {Number} timelineId   timeline id
 * @param {Object} updatedProps properties to update
 *
 * @returns {Promise} timeline
 */
export function updateTimeline(timelineId, updatedProps) {
  return axios.patch(`${TC_API_URL}/v4/timelines/${timelineId}`, {
    param: updatedProps,
  })
    .then(resp => _.get(resp.data, 'result.content'))
}
