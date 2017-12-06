import _ from 'lodash'
import { axiosInstance as axios } from './requestInterceptor'
import { TC_API_URL, CONNECT_MESSAGE_API_URL } from '../config/constants'

export function getMembersById (userIds) {
  const _userIdArr = _.map(userIds, _id => `userId:${_id}`)
  // only requesting certain member attributes
  const fields = 'userId,handle,photoURL,firstName,lastName,maxRating,details,email'
  const query = _userIdArr.join(' OR ')
  const url = `${TC_API_URL}/v3/members/_search/?fields=`
    + encodeURIComponent(fields)
    + `&query=${encodeURIComponent(query)}`
  return axios.get(url)
  .then(resp => {
    return resp.data.result.content
  })
}

export function loadMemberSuggestions(value) {
  const url = `${TC_API_URL}/v3/members/_suggest/${value}`
  return axios.get(url)
  .then(resp => {
    return resp.data.result.content
  })
}


export function addProjectMember(projectId, newMember) {
  const url = `${TC_API_URL}/v4/projects/${projectId}/members/`
  return axios.post(url, { param: newMember})
  .then(resp => {
    return axios.put(`${CONNECT_MESSAGE_API_URL}/v4/topics/syncUsers`,
    { reference: 'project', referenceId: projectId })
    .then(() => resp.data.result.content)
  })
}


export function updateProjectMember(projectId, memberId, updatedProps) {
  const url = `${TC_API_URL}/v4/projects/${projectId}/members/${memberId}/`
  return axios.patch(url, { param: updatedProps })
  .then(resp => {
    return resp.data.result.content
  })
}

export function removeProjectMember(projectId, memberId, isUserLeaving) {
  const url = `${TC_API_URL}/v4/projects/${projectId}/members/${memberId}/`
  let promise = { then: fn => fn() }
  if (isUserLeaving) {
    promise = axios.put(`${CONNECT_MESSAGE_API_URL}/v4/topics/syncUsers`,
      { reference: 'project', referenceId: projectId, isUserLeaving })
  }
  return promise.then(() => {
    return axios.delete(url)
    .then(() => {
      if (!isUserLeaving) {
        return axios.put(`${CONNECT_MESSAGE_API_URL}/v4/topics/syncUsers`,
          { reference: 'project', referenceId: projectId })
        .then(() => memberId)
      }
      // return the member id just removed
      return memberId
    })
  })
}
