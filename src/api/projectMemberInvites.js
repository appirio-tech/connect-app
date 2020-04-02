import { axiosInstance as axios } from './requestInterceptor'
import { PROJECTS_API_URL } from '../config/constants'

/**
 * Update project member invite based on project's id & given member
 * @param  {integer} projectId unique identifier of the project
 * @param  {integer} inviteId unique identifier of the invite
 * @param  {string}  status the new status for invitation
 * @return {object}  project member invite returned by api
 */
export function updateProjectMemberInvite(projectId, inviteId, status) {
  const url = `${PROJECTS_API_URL}/v5/projects/${projectId}/invites/${inviteId}`
  return axios.patch(url, { status })
    .then(resp => resp.data)
}

/**
 * Delete project member invite based on project's id & given invite's id
 * @param  {integer} projectId unique identifier of the project
 * @param  {integer}  inviteId unique identifier of the invite
 * @return {object}  project member invite returned by api
 */
export function deleteProjectMemberInvite(projectId, inviteId) {
  const url = `${PROJECTS_API_URL}/v5/projects/${projectId}/invites/${inviteId}`
  return axios.delete(url)
}

/**
 * Create a project member invite based on project's id & given member
 * @param  {integer} projectId unique identifier of the project
 * @param  {object}  member invite
 * @return {object}  project member invite returned by api
 */
export function createProjectMemberInvite(projectId, member) {
  const fields = 'id,projectId,userId,email,role,status,createdAt,updatedAt,createdBy,updatedBy,handle'
  const url = `${PROJECTS_API_URL}/v5/projects/${projectId}/invites/?fields=` + encodeURIComponent(fields)
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
  const fields = 'id,projectId,userId,email,role,status,createdAt,updatedAt,createdBy,updatedBy,handle'
  const url = `${PROJECTS_API_URL}/v5/projects/${projectId}/invites/?fields=`
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
  return axios.get(`${PROJECTS_API_URL}/v5/projects/${projectId}/invites`)
    .then(resp => resp.data)
}
