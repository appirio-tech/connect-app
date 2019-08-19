import _ from 'lodash'
import { axiosInstance as axios } from './requestInterceptor'
import { PROJECTS_API_URL } from '../config/constants'

/**
 * Get workstreams works
 *
 * @param {String} projectId project id
 * @param {String} workstreamId workstream id
 *
 * @return {Promise} resolves to workstreams works
 */
export function getWorkstreamWorks(projectId, workstreamId) {
  return axios.get(`${PROJECTS_API_URL}/v4/projects/${projectId}/workstreams/${workstreamId}/works`)
    .then(resp => _.get(resp.data, 'result.content', []))
}

/**
 * Get project workstreams
 *
 * @param {String}             projectId project id
 *
 * @return {Promise} resolves to project workstreams
 */
export function getProjectWorkstreams(projectId) {
  return axios.get(`${PROJECTS_API_URL}/v4/projects/${projectId}/workstreams`)
    .then(resp => _.get(resp.data, 'result.content', []))
}
