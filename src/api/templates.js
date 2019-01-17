/**
 * Project and product templates API service
 */
import _ from 'lodash'
import { axiosInstance as axios } from './requestInterceptor'
import { TC_API_URL } from '../config/constants'

/**
 * Get projects metadata (projectTemplates, productTemplates and projectTypes)
 *
 * @return {Promise} projects metadata (projectTemplates, productTemplates and projectTypes)
 */
export function getProjectsMetadata() {
  return axios.get(`${TC_API_URL}/v4/projects/metadata`)
    .then(resp => _.get(resp.data, 'result.content', {}))
}

/**
 * Create Project Metadata
 * @param type The type of metadata
 * @param data The data of metadata
 * @returns {Promise} response body
 */
export function createProjectsMetadata(type, data) {
  const path = type !== 'milestoneTemplates' ? 'projects' : 'timelines'
  return axios.post(`${TC_API_URL}/v4/${path}/metadata/${type}`, {
    param: data
  })
    .then(resp => _.get(resp.data, 'result.content', {}))
}

/**
 * Update Project Metadata
 * @param metadataId The primary key of metadata
 * @param type The type of metadata
 * @param data The data of metadata
 * @returns {Promise} response body
 */
export function updateProjectsMetadata(metadataId, type, data) {
  const path = type !== 'milestoneTemplates' ? 'projects' : 'timelines'
  return axios.patch(`${TC_API_URL}/v4/${path}/metadata/${type}/${metadataId}`, {
    param: data
  })
    .then(resp => _.get(resp.data, 'result.content', {}))
}

/**
 * Delete Project Metadata
 * @param metadataId The primary key of metadata
 * @param type The type of metadata
 * @returns {Promise} response body
 */
export function deleteProjectsMetadata(metadataId, type) {
  const path = type !== 'milestoneTemplates' ? 'projects' : 'timelines'
  return axios.delete(`${TC_API_URL}/v4/${path}/metadata/${type}/${metadataId}`)
    .then(() => {
      return { metadataId, type }
    })
}
