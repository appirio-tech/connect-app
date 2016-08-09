import _ from 'lodash'
import { axiosInstance as axios } from './requestInterceptor'
import { TC_API_URL } from '../config/constants'

export function getProjects(criteria, limit, offset, sort) {
  // TODO map criteria to API
  const includeFields = ['id', 'name', 'members', 'status', 'type', 'createdAt', 'updatedAt']
  const params = {
    sort,
    limit,
    offset,
    fields: includeFields.join(',')
  }
  return axios.get(`${TC_API_URL}/v4/projects/`, { params })
    .then( resp => {
      return {
        totalCount: _.get(resp.data, 'result.metadata.totalCount', 0),
        projects: _.get(resp.data, 'result.content', [])
      }
    })
}

export function getProjectSuggestions() {
  // TODO
}


/**
 * Get a project basd on it's id
 * @param  {integer} projectId unique identifier of the project
 * @return {object}           project returned by api
 */
export function getProjectById(projectId) {
  projectId = parseInt(projectId)
  return axios.get(`${TC_API_URL}/v4/projects/${projectId}/`)
    .then(resp => {
      return _.get(resp.data, 'result.content', {})
    })
}

export function updateProject(projectId, updatedProps) {
  // TODO
  console.log(projectId, updatedProps)
}


export function createProject(projectProps) {
  return axios.post(`${TC_API_URL}/v4/projects/`, { param: projectProps })
    .then( resp => {
      return _.get(resp.data, 'result.content', {})
    })
}
