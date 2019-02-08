import _ from 'lodash'
import { axiosInstance as axios } from './requestInterceptor'
import { PROJECTS_API_URL, FILE_PICKER_SUBMISSION_CONTAINER_NAME } from '../config/constants'

export function addProjectAttachment(projectId, fileData) {
  // add s3 bucket prop
  fileData.s3Bucket = FILE_PICKER_SUBMISSION_CONTAINER_NAME
  return axios.post(`${PROJECTS_API_URL}/v4/projects/${projectId}/attachments`, { param: fileData })
    .then( resp => {
      resp.data.result.content.downloadUrl = `/projects/${projectId}/attachments/${resp.data.result.content.id}`
      return _.get(resp.data, 'result.content', {})
    })
}

export function updateProjectAttachment(projectId, attachmentId, attachment) {
  if (attachment && (!attachment.userIds || attachment.userIds.length === 0)) {
    attachment = {
      ...attachment,
      userIds: null
    }
  }
  
  return axios.patch(
    `${PROJECTS_API_URL}/v4/projects/${projectId}/attachments/${attachmentId}`,
    { param: attachment })
    .then ( resp => {
      resp.data.result.content.downloadUrl = `/projects/${projectId}/attachments/${attachmentId}`
      return _.get(resp.data, 'result.content', {})
    })
}

export function removeProjectAttachment(projectId, attachmentId) {
  // return attachmentId so reducer knows which one to remove from list
  return axios.delete(`${PROJECTS_API_URL}/v4/projects/${projectId}/attachments/${attachmentId}`)
    .then(() => attachmentId)
}

export function getProjectAttachment(projectId, attachmentId) {
  return axios.get(
    `${PROJECTS_API_URL}/v4/projects/${projectId}/attachments/${attachmentId}`)
    .then ( resp => resp.data.result.content.url )
}

export function addProductAttachment(projectId, phaseId, productId, fileData) {
  // add s3 bucket prop
  fileData.s3Bucket = FILE_PICKER_SUBMISSION_CONTAINER_NAME
  return axios.post(`${PROJECTS_API_URL}/v4/projects/${projectId}/phases/${phaseId}/products/${productId}/attachments`, { param: fileData })
    .then( resp => {
      resp.data.result.content.downloadUrl = `/projects/${projectId}/phases/${phaseId}/products/${productId}/attachments/${resp.data.result.content.id}`
      return _.get(resp.data, 'result.content', {})
    })
}

export function updateProductAttachment(projectId, phaseId, productId, attachmentId, attachment) {
  return axios.patch(
    `${PROJECTS_API_URL}/v4/projects/${projectId}/phases/${phaseId}/products/${productId}/attachments/${attachmentId}`,
    { param: attachment })
    .then ( resp => {
      resp.data.result.content.downloadUrl = `/projects/${projectId}/phases/${phaseId}/products/${productId}/attachments/${attachmentId}`
      return _.get(resp.data, 'result.content', {})
    })
}

export function removeProductAttachment(projectId, phaseId, productId, attachmentId) {
  // return attachmentId so reducer knows which one to remove from list
  return axios.delete(`${PROJECTS_API_URL}/v4/projects/${projectId}/phases/${phaseId}/products/${productId}/attachments/${attachmentId}`)
    .then(() => attachmentId)
}

export function getProductAttachment(projectId, phaseId, productId, attachmentId) {
  return axios.get(
    `${PROJECTS_API_URL}/v4/projects/${projectId}/phases/${phaseId}/products/${productId}/attachments/${attachmentId}`)
    .then(resp => resp.data.result.content.url)
}
