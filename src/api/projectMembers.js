import _ from 'lodash'
import { axiosInstance as axios } from './requestInterceptor'
import { TC_API_URL, PROJECTS_API_URL } from '../config/constants'

export function getMembersById (userIds) {
  // only requesting certain member attributes
  const fields = 'userId,handle,photoURL,firstName,lastName'
  const url = `${TC_API_URL}/v5/members?userIds=[${userIds.join(',')}]&fields=${encodeURIComponent(fields)}`;
  return axios.get(url)
    .then(resp => {
      return resp.data
    })
}

export function getMembersByHandle (handles) {
  // only requesting certain member attributes
  const fields = 'userId,handle,photoURL,firstName,lastName'
  const quotedHandles = handles.map(handle => JSON.stringify(handle)).join(',');
  const url = `${TC_API_URL}/v5/members?handles=[${quotedHandles}]&fields=${encodeURIComponent(fields)}`;
  return axios.get(url)
    .then(resp => {
      return resp.data
    })
}

export function loadMemberSuggestions(value) {
  const url = `${TC_API_URL}/v5/members/autocomplete?term=${value}`
  return axios.get(url)
    .then(resp => {
      return resp.data
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
