import _ from 'lodash'
import { axiosInstance as axios } from './requestInterceptor'
import { TC_API_URL, PROJECTS_API_URL } from '../config/constants'

export function getMembersById (userIds) {
  const _userIdArr = _.map(userIds, _id => `userId:${_id}`)
  // only requesting certain member attributes
  const fields = 'userId,handle,photoURL,firstName,lastName,details'
  const query = _userIdArr.join(' OR ')
  const url = `${TC_API_URL}/v3/members/_search/?fields=`
    + encodeURIComponent(fields)
    + `&query=${encodeURIComponent(query)}`
    + '&limit=' + userIds.length
  return axios.get(url)
    .then(resp => {
      return resp.data.result.content
    })
}

export function getMembersByHandle (handles) {
  const _handlesArr = _.map(handles, _id => `handle:${_id}`)
  // only requesting certain member attributes
  const fields = 'userId,handle,photoURL,firstName,lastName,details'
  const query = _handlesArr.join(' OR ')
  const url = `${TC_API_URL}/v3/members/_search/?fields=`
    + encodeURIComponent(fields)
    + `&query=${encodeURIComponent(query)}`
    + '&limit=' + handles.length
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
  const url = `${PROJECTS_API_URL}/v4/projects/${projectId}/members/`
  return axios.post(url, { param: newMember})
    .then(resp => {
      return resp.data.result.content
    })
}


export function updateProjectMember(projectId, memberId, updatedProps) {
  const url = `${PROJECTS_API_URL}/v4/projects/${projectId}/members/${memberId}/`
  return axios.patch(url, { param: updatedProps })
    .then(resp => {
      return resp.data.result.content
    })
}

export function removeProjectMember(projectId, memberId) {
  const url = `${PROJECTS_API_URL}/v4/projects/${projectId}/members/${memberId}/`
  return axios.delete(url)
    .then(() => {
      // return the member id just removed
      return memberId
    })
}

export function getProjectMembers(projectId) {
  const fields = 'id,userId,role,isPrimary,deletedAt,createdAt,updatedAt,deletedBy,createdBy,updatedBy,handle,firstName,lastName,photoURL,workingHourStart,workingHourEnd,timeZone'
  const url = `${PROJECTS_API_URL}/v4/projects/${projectId}/members/?fields=`
    + encodeURIComponent(fields)
  return axios.get(url)
    .then( resp => {
      return populateUserDetails(resp.data.result.content)
    })
}

// temporary fix to populate data which is not returned at the moment by Member Service
const userDetails = {
  40152856: {
    handle: 'pshah_manager',
    firstName: 'Parth121',
    lastName: 'Manager1',
    photoUrl: 'https://topcoder-dev-media.s3.amazonaws.com/member/profile/pshah_manager-1565325063054.jpeg',
    timeZone: 'America/Chicago',
    workingHourStart: '9:00',
    workingHourEnd: '18:00'
  },
  40152922: {
    photoURL: 'https://topcoder-dev-media.s3.amazonaws.com/member/profile/pshah_customer-1552561016111.png',
    handle: 'pshah_customer',
    firstName: 'Parth',
    lastName: 'Customer',
    timeZone: 'Asia/Kolkata',
    workingHourStart: '15:00',
    workingHourEnd: '24:00'
  },
  40154389: {
    handle: 'bruce13',
    firstName: 'Rishi Raj',
    lastName: 'Sahu',
    photoURL: 'https://topcoder-dev-media.s3.amazonaws.com/member/profile/bruce13-1531204784385.jpeg',
    timeZone: 'Asia/Kolkata',
    workingHourStart: null,
    workingHourEnd: null
  },
  40153891: {
    handle: 'maxceem-dev',
    firstName: 'Maksym1',
    lastName: 'Dev',
    photoURL: 'https://topcoder-dev-media.s3.amazonaws.com/member/profile/maxceem-dev-1541129349761.jpeg',
    timeZone: null,
    workingHourStart: null,
    workingHourEnd: null
  },
  40035291: {
    handle: 'maxceem',
    firstName: 'F_NAME',
    lastName: 'L_NAME',
    photoURL: 'https://topcoder-dev-media.s3.amazonaws.com/member/profile/maxceem-1541153638241.jpeg',
    timeZone: null,
    workingHourStart: null,
    workingHourEnd: null
  }
}

const populateUserDetails = (list) => {
  if (!list) {
    return list
  }

  return _.map(list, (item) => {
    // if item didn't get data from Member Service, but we have mocked data for it
    // then populate our mock data
    if (!item.handle && userDetails[item.userId]) {
      return { ...item, ...userDetails[item.userId] }
    }

    return item
  })
}

export function getProjectMemberInvites(projectId) {
  const fields = 'id,projectId,userId,email,role,status,createdAt,updatedAt,createdBy,updatedBy,handle,firstName,lastName,photoURL'
  const url = `${PROJECTS_API_URL}/v4/projects/${projectId}/members/invites/?fields=`
    + encodeURIComponent(fields)
  return axios.get(url)
    .then( resp => {
      return populateUserDetails(resp.data.result.content)
    })
}

export function getProjectMember(projectId, memberId) {
  const fields = 'id,userId,role,isPrimary,deletedAt,createdAt,updatedAt,deletedBy,createdBy,updatedBy,handle,firstName,lastName,photoURL,workingHourStart,workingHourEnd,timeZone'
  const url = `${PROJECTS_API_URL}/v4/projects/${projectId}/members/${memberId}?fields=`
    + encodeURIComponent(fields)
  return axios.get(url)
    .then( resp => {
      return (populateUserDetails([resp.data.result.content]))[0]
    })
}