import { axiosInstance as axios } from './requestInterceptor'
import { TC_API_URL } from '../config/constants'

export function getProjects(criteria, limit, offset, sort) {
  // TODO map criteria to API
  const params = {
    sort,
    limit,
    offset
  }
  return axios.get(`${TC_API_URL}/v4/projects/`, { params })
    .then( resp => {
      return {
        totalCount: resp.data.result.metadata.totalCount,
        projects: resp.data.result.content
      }
    })
}

export function getProjectSuggestions() {
  // TODO
}


/**
 * Get a project basd on it's id
 * @param  {integer} projectId unique identifier of the project
 * @return {[type]}           [description]
 */
export function getProjectById(projectId) {
  projectId = parseInt(projectId)
  return axios.get(`${TC_API_URL}/v4/projects/${projectId}/`)
    .then(resp => {
      return resp.data.result.content
    })
}

export function updateProject(projectId, updatedProps) {
  // TODO
  console.log(projectId, updatedProps)
}


export function createProject(projectProps) {
  // TODO
  console.log(projectProps)
}
