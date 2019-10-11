/**
 * Project and product templates API service
 */
import _ from 'lodash'
import { axiosInstance as axios } from './requestInterceptor'
import { PROJECTS_API_URL } from '../config/constants'

/**
 * Get projects metadata (projectTemplates, productTemplates and projectTypes)
 *
 * @return {Promise} projects metadata (projectTemplates, productTemplates and projectTypes)
 */
export function getProjectsMetadata() {
  return axios.get(`${PROJECTS_API_URL}/v5/projects/metadata`)
    .then(resp => resp.data)
}

/**
 * Get project metadata according of the version (form, planConfig and priceConfig)
 * @param type The type of metadata
 * @param key The key of metadata
 * @param version The version of metadata
 * @return {Promise} project metadata (form, planConfig and priceConfig)
 */
export function getProjectMetadataWithVersion(type, key, version) {
  return axios.get(`${PROJECTS_API_URL}/v5/projects/metadata/${type}/${key}/versions/${version}`)
    .then((resp) => {
      const versionMetadata = resp.data
      return { type, versionMetadata }
    })
}

/**
 * Get the version list of projects metadata (form, planConfig and priceConfig)
 * @param type The type of metadata
 * @param key The key of metadata
 * @return {Promise} version list (form, planConfig and priceConfig)
 */
export function getVersionOptionList(type, key) {
  return axios.get(`${PROJECTS_API_URL}/v5/projects/metadata/${type}/${key}/versions`)
    .then(resp => resp.data)
}

/**
 * Get the revision list of projects metadata (form, planConfig and priceConfig)
 * @param type The type of metadata
 * @param key The key of metadata
 * @param version The version of metadata
 * @return {Promise} revision list (form, planConfig and priceConfig)
 */
export function getRevisionList(type, key, version) {
  return axios.get(`${PROJECTS_API_URL}/v5/projects/metadata/${type}/${key}/versions/${version}/revisions`)
    .then(resp => resp.data)
}

/**
 * Create Project Metadata
 * @param type The type of metadata
 * @param data The data of metadata
 * @returns {Promise} response body
 */
export function createProjectsMetadata(type, data) {
  const keys = ['form', 'planConfig', 'priceConfig']
  if (keys.includes(type)) {
    const key = data.key
    const tmpdata = _.omit(data, ['key', 'version', 'id', 'revision'])
    return axios.post(`${PROJECTS_API_URL}/v5/projects/metadata/${type}/${key}/versions`, tmpdata)
      .then(resp => _.get(resp.data, 'result.content', {}))
  } else {
    const path = type !== 'milestoneTemplates' ? 'projects' : 'timelines'
    return axios.post(`${PROJECTS_API_URL}/v5/${path}/metadata/${type}`, data)
      .then(resp => resp.data)
  }
}

/**
 * Update Project Metadata
 * @param metadataId The primary key of metadata
 * @param type The type of metadata
 * @param data The data of metadata
 * @returns {Promise} response body
 */
export function updateProjectsMetadata(metadataId, type, data) {
  const keys = ['form', 'planConfig', 'priceConfig']
  if (keys.includes(type)) {
    const key = data.key
    const version = data.version
    const tmpdata = _.omit(data, ['key', 'version', 'id', 'revision'])
    return axios.patch(`${PROJECTS_API_URL}/v5/projects/metadata/${type}/${key}/versions/${version}`, tmpdata)
      .then(resp => resp.data)
  } else {
    const path = type !== 'milestoneTemplates' ? 'projects' : 'timelines'
    return axios.patch(`${PROJECTS_API_URL}/v5/${path}/metadata/${type}/${metadataId}`, data)
      .then(resp => resp.data)
  }
}

/**
 * Delete Project Metadata
 * @param metadataId The primary key of metadata
 * @param type The type of metadata
 * @returns {Promise} response body
 */
export function deleteProjectsMetadata(metadataId, type) {
  const path = type !== 'milestoneTemplates' ? 'projects' : 'timelines'
  return axios.delete(`${PROJECTS_API_URL}/v5/${path}/metadata/${type}/${metadataId}`)
    .then(() => {
      return { metadataId, type }
    })
}

/**
 * Delete Project Metadata Special (form, planConfig and priceConfig)
 * @param metadataId The primary key of metadata
 * @param type The type of metadata
 * @param data The type of metadata
 * @returns {Promise} response body
 */
export function deleteProjectsMetadataSpecial(metadataId, type, data) {
  const key = data.key
  const version = data.version
  return axios.delete(`${PROJECTS_API_URL}/v5/projects/metadata/${type}/${key}/versions/${version}`)
    .then(() => {
      return { metadataId, type }
    })
}