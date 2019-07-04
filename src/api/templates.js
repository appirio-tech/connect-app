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
  return axios.get(`${PROJECTS_API_URL}/v4/projects/metadata`)
    .then(resp => _.get(resp.data, 'result.content', {}))
}

/**
 * Get project metadata according of the version (form, planConfig and priceConfig)
 * @param type The type of metadata
 * @param key The key of metadata
 * @param version The version of metadata
 * @return {Promise} project metadata (form, planConfig and priceConfig)
 */
export function getProjectMetadataWithVersion(type, key, version) {
  return axios.get(`${PROJECTS_API_URL}/v4/projects/metadata/${type}/${key}/versions/${version}`)
    .then((resp) => {
      const versionMetadata = _.get(resp.data, 'result.content', {})
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
  return axios.get(`${PROJECTS_API_URL}/v4/projects/metadata/${type}/${key}/versions`)
    .then(resp => _.get(resp.data, 'result.content', {}))
}

/**
 * Get the revision list of projects metadata (form, planConfig and priceConfig)
 * @param type The type of metadata
 * @param key The key of metadata
 * @param version The version of metadata
 * @return {Promise} revision list (form, planConfig and priceConfig)
 */
export function getRevisionList(type, key, version) {
  return axios.get(`${PROJECTS_API_URL}/v4/projects/metadata/${type}/${key}/versions/${version}/revisions`)
    .then(resp => _.get(resp.data, 'result.content', {}))
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
    return axios.post(`${PROJECTS_API_URL}/v4/projects/metadata/${type}/${key}/versions`, {
      param: tmpdata
    })
      .then(resp => _.get(resp.data, 'result.content', {}), err => ({ ...err, values: data }))
  } else {
    const path = type !== 'milestoneTemplates' ? 'projects' : 'timelines'
    return axios.post(`${PROJECTS_API_URL}/v4/${path}/metadata/${type}`, {
      param: data
    })
      .then(resp => _.get(resp.data, 'result.content', {}))
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
    return axios.patch(`${PROJECTS_API_URL}/v4/projects/metadata/${type}/${key}/versions/${version}`, {
      param: tmpdata
    })
      .then(resp => _.get(resp.data, 'result.content', {}))
  } else {
    const path = type !== 'milestoneTemplates' ? 'projects' : 'timelines'
    return axios.patch(`${PROJECTS_API_URL}/v4/${path}/metadata/${type}/${metadataId}`, {
      param: data
    })
      .then(resp => _.get(resp.data, 'result.content', {}))
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
  return axios.delete(`${PROJECTS_API_URL}/v4/${path}/metadata/${type}/${metadataId}`)
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
  return axios.delete(`${PROJECTS_API_URL}/v4/projects/metadata/${type}/${key}/versions/${version}`)
    .then(() => {
      return { metadataId, type }
    })
}