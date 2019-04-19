/**
 * Project and product templates API service
 */
import _ from 'lodash'
import { axiosInstance as axios } from './requestInterceptor'
import { PROJECTS_API_URL } from '../config/constants'

const projectTemplates = require('./templates-json/project-templates.json')
const productTemplates = require('./templates-json/product-templates.json')

/**
 * Get projects metadata (projectTemplates, productTemplates and projectTypes)
 *
 * @return {Promise} projects metadata (projectTemplates, productTemplates and projectTypes)
 */
export function getProjectsMetadata() {
  return axios.get(`${PROJECTS_API_URL}/v4/projects/metadata`)
    .catch((err) => {
      // temporary mock data if Project Service is unavailable
      if (err.message === 'Network Error') {
        return {
          data: {
            result: {
              content: {
                projectTemplates,
                productTemplates,
                milestoneTemplates: [],
                projectTypes: [],
                productCategories: [],
              }
            }
          }
        }
      }

      throw err
    })
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
  return axios.post(`${PROJECTS_API_URL}/v4/${path}/metadata/${type}`, {
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
  return axios.patch(`${PROJECTS_API_URL}/v4/${path}/metadata/${type}/${metadataId}`, {
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
  return axios.delete(`${PROJECTS_API_URL}/v4/${path}/metadata/${type}/${metadataId}`)
    .then(() => {
      return { metadataId, type }
    })
}
