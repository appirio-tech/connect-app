import { axiosInstance as axios } from './requestInterceptor'
import { TC_API_URL, PROJECTS_API_URL } from '../config/constants'
import { normalizeMemberData } from '../helpers/memberHelper'

export function getMembersById (userIds) {
  const page = 1
  const perPage = 100
  let result = []

  return getMembersByIdInternal(page, perPage)

  function getMembersByIdInternal(page, perPage) {
    const fields = 'userId,handle,photoURL'
    const query = '[' + userIds.join(',') + ']'
    const url = `${TC_API_URL}/v5/members?fields=${fields}&userIds=${query}&page=${page}&perPage=${perPage}`

    return axios.get(url)
      .then(resp => {
        const count = resp.headers['x-page']
        const totalPage = resp.headers['x-total-pages']

        result = result.concat(resp.data.map(member => normalizeMemberData(member)))

        if (count < totalPage) {
          return getMembersByIdInternal(count + 1, perPage)
        } else {
          return result
        }
      })
  }
}

export function loadMemberSuggestions(value) {
  const url = `${TC_API_URL}/v5/members?handle=${value}`
  return axios.get(url)
    .then(resp => {
      return resp.data.map(member => normalizeMemberData(member))
    })
}


export function addProjectMember(projectId, newMember) {
  const url = `${PROJECTS_API_URL}/v5/projects/${projectId}/members/`
  return axios.post(url, newMember)
    .then(resp => resp.data)
}


export function updateProjectMember(projectId, memberId, updatedProps) {
  const fields = 'id,userId,role,isPrimary,deletedAt,createdAt,updatedAt,deletedBy,createdBy,updatedBy,handle,photoURL,workingHourStart,workingHourEnd,timeZone,email'
  const url = `${PROJECTS_API_URL}/v5/projects/${projectId}/members/${memberId}/?fields=`
    + encodeURIComponent(fields)
  return axios.patch(url, updatedProps)
    .then(resp => {
      return resp.data
    })
}

export function removeProjectMember(projectId, memberId) {
  const url = `${PROJECTS_API_URL}/v5/projects/${projectId}/members/${memberId}/`
  return axios.delete(url)
    .then(() => {
      // return the member id just removed
      return memberId
    })
}

export function getProjectMembers(projectId) {
  const fields = 'id,userId,role,isPrimary,deletedAt,createdAt,updatedAt,deletedBy,createdBy,updatedBy,handle,photoURL,workingHourStart,workingHourEnd,timeZone,email'
  const url = `${PROJECTS_API_URL}/v5/projects/${projectId}/members/?fields=`
    + encodeURIComponent(fields)
  return axios.get(url)
    .then( resp => {
      return resp.data
    })
}

export function getProjectMember(projectId, memberId) {
  const fields = 'id,userId,role,isPrimary,deletedAt,createdAt,updatedAt,deletedBy,createdBy,updatedBy,handle,photoURL,workingHourStart,workingHourEnd,timeZone,email'
  const url = `${PROJECTS_API_URL}/v5/projects/${projectId}/members/${memberId}?fields=`
    + encodeURIComponent(fields)
  return axios.get(url)
    .then( resp => {
      return resp.data
    })
}
