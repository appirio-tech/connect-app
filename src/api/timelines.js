/**
 * Timelines and milestones API
 */
import { axiosInstance as axios } from './requestInterceptor'
import { PROJECTS_API_URL } from '../config/constants'

/**
 * Get timeline by reference
 *
 * @return {Promise<[]>} list of timelines
 */
export function getTimelinesByReference(reference, referenceId) {
  return axios.get(`${PROJECTS_API_URL}/v5/timelines?reference=${reference}&referenceId=${referenceId}`)
    .then(resp => resp.data)
}

/**
 * Get timeline by id
 *
 * @return {Promise} one timeline
 */
export function getTimelineById(id) {
  /*
     As a temporary fix we use `db=true` param which force Project Service to
     return the data from DB.
     This is done as a workaround for the cases when we change some milestone inside
     timeline, it triggers cascading changes of other milestones in Project Service.
     So to get updated milestones in Connect we are using this requests to get updated
     timeline with milestones.
     If we don't get it directly from DB, there is a big chance that timeline with milestones
     are not yet updated in ES.

     TODO: we should avoid this logic in Connect App which relies on the immediate update
           of data on Project Service.
           As soon as we do it in Connect App, we can update Project Service to not support
           this `db=true` param anymore.
  */
  return axios.get(`${PROJECTS_API_URL}/v5/timelines/${id}?db=true`)
    .then(resp => resp.data)
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
  return axios.patch(`${PROJECTS_API_URL}/v5/timelines/${timelineId}/milestones/${milestoneId}`, updatedProps)
    .then(resp => resp.data)
}

/**
 * Bulk update milestones
 *
 * @param {Number} timelineId   timeline id
 * @param {Array<{}>} milestones  the timeline's milestones
 *
 * @returns {Promise} milestones
 */
export function updateMilestones(timelineId, milestones) {
  return axios.patch(`${PROJECTS_API_URL}/v5/timelines/${timelineId}/milestones`, milestones)
    .then(resp => resp.data)
}

/**
 * Get milestone templates by product template id
 *
 * @param {Number} productTemplateId product template id
 *
 * @returns {Promise<[]>} list of milestone templates
 */
export function getMilestoneTemplates(productTemplateId) {
  return axios.get(`${PROJECTS_API_URL}/v5/productTemplates/${productTemplateId}/milestones`)
    .then(resp => resp.data)
}

/**
 * Create timeline and milestones
 *
 * @param {Object} timeline timeline
 *
 * @returns {Promise} timeline
 */
export function createTimeline(timeline) {
  return axios.post(`${PROJECTS_API_URL}/v5/timelines`, timeline)
    .then(resp => resp.data)
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
  return axios.patch(`${PROJECTS_API_URL}/v5/timelines/${timelineId}`, updatedProps)
    .then(resp => resp.data)
}
