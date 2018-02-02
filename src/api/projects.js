import omit from 'lodash/omit'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import { axiosInstance as axios } from './requestInterceptor'
import { TC_API_URL, PROJECTS_API_URL, PROJECTS_LIST_PER_PAGE } from '../config/constants'

export function getProjects(criteria, pageNum) {
  // add default params
  const includeFields = ['id', 'name', 'description', 'members', 'status', 'type', 'actualPrice', 'estimatedPrice', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy', 'details']
  const params = {
    limit: PROJECTS_LIST_PER_PAGE,
    offset: (pageNum - 1) * PROJECTS_LIST_PER_PAGE,
    fields: includeFields.join(',')
  }
  // filters
  const filter = omit(criteria, ['sort'])
  if (!isEmpty(filter)) {
    // support for multiple comma separated types
    if (filter.type && filter.type.indexOf(',') > -1) {
      filter.type = `in(${filter.type})`
    }
    // support for multiple comma separated segments
    if (filter.segment && filter.segment.indexOf(',') > -1) {
      filter.segment = `in(${filter.segment})`
    }
    // convert filter object to string
    const filterStr = Object.keys(filter).map(k => `${k}=${filter[k]}`)
    params.filter = filterStr.join('&')
  }
  // sort fields
  const sort = get(criteria, 'sort', null)
  if (sort) params.sort = sort

  return axios.get(`${PROJECTS_API_URL}/v4/projects/`, { params })
    .then( resp => {
      return {
        totalCount: get(resp.data, 'result.metadata.totalCount', 0),
        projects: get(resp.data, 'result.content', [])
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
  return axios.get(`${PROJECTS_API_URL}/v4/projects/${projectId}/`)
    .then(resp => {
      return get(resp.data, 'result.content', {})
    })
}

/**
 * Update project using patch
 * @param  {integer} projectId    project Id
 * @param  {object} updatedProps updated project properties
 * @param  {boolean} updateExisting update existing or new project
 * @return {promise}              updated project
 */
export function updateProject(projectId, updatedProps, updateExisting) {
  return axios.patch(`${PROJECTS_API_URL}/v4/projects/${projectId}/`, { param: updatedProps })
    .then(resp => {
      return {...get(resp.data, 'result.content'), updateExisting }
    })
}


export function createProject(projectProps) {
  // Phase out discussions
  // TODO: Remove this once none of the active projects
  // have the discussions tab enabled
  projectProps.details.hideDiscussions = true

  return axios.post(`${PROJECTS_API_URL}/v4/projects/`, { param: projectProps })
    .then( resp => {
      return get(resp.data, 'result.content', {})
    })
}

export function createProjectWithStatus(projectProps, status) {
  // Phase out discussions
  // TODO: Remove this once none of the active projects
  // have the discussions tab enabled
  projectProps.details.hideDiscussions = true

  return axios.post(`${PROJECTS_API_URL}/v4/projects/`, { param: projectProps })
    .then( resp => {
      return get(resp.data, 'result.content', {})
    })
    .then(project => {
      const updatedProps = { status }
      const projectId = project.id
      return axios.patch(`${PROJECTS_API_URL}/v4/projects/${projectId}/`, { param: updatedProps })
        .then(resp => {
          return get(resp.data, 'result.content')
        })
        .catch(error => { // eslint-disable-line no-unused-vars
          // return created project even if status update fails to prevent error page
          return project
        })
    })
}

export function deleteProject(projectId) {
  return axios.delete(`${PROJECTS_API_URL}/v4/projects/${projectId}/`)
    .then(() => {
      return projectId
    })
}

export function getDirectProjectData(directProjectId) {
  return axios.get(`${TC_API_URL}/v3/direct/projects/${directProjectId}`)
    .then(resp => {
      return resp.data.result.content
    })
}
