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

  delete updatedProps.endDate
  delete updatedProps.completionDate

  return axios.patch(`${TC_API_URL}/v4/timelines/${timelineId}/milestones/${milestoneId}`, {
    param: updatedProps,
  })
    .then(resp => _.get(resp.data, 'result.content'))
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
