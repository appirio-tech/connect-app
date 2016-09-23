import _ from 'lodash'
import { axiosInstance as axios } from './requestInterceptor'
import { TC_API_URL } from '../config/constants'

export function getProjects(criteria, pageNum) {
  // add default params
  const includeFields = ['id', 'name', 'members', 'status', 'type', 'actualPrice', 'estimatedPrice', 'createdAt', 'updatedAt', 'details']
  const params = {
    limit: 20,
    offset: (pageNum - 1) * 20,
    fields: includeFields.join(',')
  }
  // filters
  const filter = _.omit(criteria, ['sort'])
  if (!_.isEmpty(filter)) {
    // convert filter object to string
    const filterStr = _.map(filter, (v, k) => `${k}=${v}`)
    params.filter = filterStr.join('&')
  }
  // sort fields
  const sort = _.get(criteria, 'sort', null)
  if (sort) params.sort = sort

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

/**
 * Update project using patch
 * @param  {integer} projectId    project Id
 * @param  {object} updatedProps updated project properties
 * @return {promise}              updated project
 */
export function updateProject(projectId, updatedProps) {
  return axios.patch(`${TC_API_URL}/v4/projects/${projectId}/`, { param: updatedProps })
    .then(resp => {
      return _.get(resp.data, 'result.content')
    })
}


export function createProject(projectProps) {
  return axios.post(`${TC_API_URL}/v4/projects/`, { param: projectProps })
    .then( resp => {
      return _.get(resp.data, 'result.content', {})
    })
}

export function deleteProject(projectId) {
  return axios.delete(`${TC_API_URL}/v4/projects/${projectId}/`)
    .then(resp => {
      return projectId
    })
}

export function getDirectProjectData(directProjectId) {
  return axios.get(`${TC_API_URL}/v3/direct/projects/${directProjectId}`)
    .then(resp => {
      return resp.data.result.content
    })
}
