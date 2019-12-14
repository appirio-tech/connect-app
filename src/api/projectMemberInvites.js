import { axiosInstance as axios } from './requestInterceptor'
import { PROJECTS_API_URL } from '../config/constants'

/**
 * Update project member invite based on project's id & given member
 * @param  {integer} projectId unique identifier of the project
 * @param  {object}  member invite to update
 * @return {object}  project member invite returned by api
 */
export function updateProjectMemberInvite(projectId, member) {
  const url = `${PROJECTS_API_URL}/v5/projects/${projectId}/members/invite/`
  return axios.put(url, member)
    .then(resp => resp.data)
}

/**
 * Create a project member invite based on project's id & given member
 * @param  {integer} projectId unique identifier of the project
 * @param  {object}  member invite
 * @return {object}  project member invite returned by api
 */
export function createProjectMemberInvite(projectId, member) {
  const fields = 'id,projectId,userId,email,role,status,createdAt,updatedAt,createdBy,updatedBy,handle,firstName,lastName,photoURL'
  const url = `${PROJECTS_API_URL}/v5/projects/${projectId}/members/invite/?fields=` + encodeURIComponent(fields)
  return axios({
    method: 'post',
    url,
    data: member,
    validateStatus (status) {
      return (status >= 200 && status < 300) || status === 403
    },
  })
    .then(resp => resp.data)
}

export function getProjectMemberInvites(projectId) {
  const fields = 'id,projectId,userId,email,role,status,createdAt,updatedAt,createdBy,updatedBy,handle,firstName,lastName,photoURL'
  const url = `${PROJECTS_API_URL}/v5/projects/${projectId}/members/invites/?fields=`
    + encodeURIComponent(fields)
  return axios.get(url)
    .then( resp => {
      return resp.data
    })
}

/**
 * Get a project member invite based on project's id
 * @param  {integer} projectId unique identifier of the project
 * @return {object}  project member invite returned by api
 */
export function getProjectInviteById(projectId) {
  return axios.get(`${PROJECTS_API_URL}/v5/projects/${projectId}/members/invite/`)
    .then(resp => resp.data)
}
