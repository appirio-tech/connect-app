import { axiosInstance as axios } from './requestInterceptor'
import { PROJECTS_API_URL, FILE_PICKER_SUBMISSION_CONTAINER_NAME, ATTACHMENT_TYPE_FILE } from '../config/constants'

export function addProjectAttachment(projectId, attachment) {

  if (attachment.type === ATTACHMENT_TYPE_FILE) {
    // add s3 bucket prop
    attachment.s3Bucket = FILE_PICKER_SUBMISSION_CONTAINER_NAME
  }

  // The api takes only arrays
  if (!attachment.tags) {
    attachment.tags = []
  }

  return axios.post(`${PROJECTS_API_URL}/v5/projects/${projectId}/attachments`, attachment)
    .then( resp => {
      resp.data.downloadUrl = `/projects/${projectId}/attachments/${resp.data.id}`
      return resp.data
    })
}

export function updateProjectAttachment(projectId, attachmentId, attachment) {
  if (attachment && (!attachment.allowedUsers || attachment.allowedUsers.length === 0)) {
    attachment = {
      ...attachment,
      allowedUsers: null
    }
  }

  // The api takes only arrays
  if (attachment && !attachment.tags) {
    attachment = {
      ...attachment,
      tags: []
    }
  }

  return axios.patch(
    `${PROJECTS_API_URL}/v5/projects/${projectId}/attachments/${attachmentId}`, attachment)
    .then ( resp => {
      resp.data.downloadUrl = `/projects/${projectId}/attachments/${attachmentId}`
      return resp.data
    })
}

export function removeProjectAttachment(projectId, attachmentId) {
  // return attachmentId so reducer knows which one to remove from list
  return axios.delete(`${PROJECTS_API_URL}/v5/projects/${projectId}/attachments/${attachmentId}`)
    .then(() => attachmentId)
}

export function getProjectAttachment(projectId, attachmentId) {
  return axios.get(
    `${PROJECTS_API_URL}/v5/projects/${projectId}/attachments/${attachmentId}`)
    .then ( resp => resp.data.url )
}

export function addProductAttachment(projectId, phaseId, productId, fileData) {
  // add s3 bucket prop
  fileData.s3Bucket = FILE_PICKER_SUBMISSION_CONTAINER_NAME
  return axios.post(`${PROJECTS_API_URL}/v5/projects/${projectId}/phases/${phaseId}/products/${productId}/attachments`, fileData)
    .then( resp => {
      resp.data.downloadUrl = `/projects/${projectId}/phases/${phaseId}/products/${productId}/attachments/${resp.data.id}`
      return resp.data
    })
}

export function updateProductAttachment(projectId, phaseId, productId, attachmentId, attachment) {
  return axios.patch(
    `${PROJECTS_API_URL}/v5/projects/${projectId}/phases/${phaseId}/products/${productId}/attachments/${attachmentId}`, attachment)
    .then ( resp => {
      resp.data.downloadUrl = `/projects/${projectId}/phases/${phaseId}/products/${productId}/attachments/${attachmentId}`
      return resp.data
    })
}

export function removeProductAttachment(projectId, phaseId, productId, attachmentId) {
  // return attachmentId so reducer knows which one to remove from list
  return axios.delete(`${PROJECTS_API_URL}/v5/projects/${projectId}/phases/${phaseId}/products/${productId}/attachments/${attachmentId}`)
    .then(() => attachmentId)
}

export function getProductAttachment(projectId, phaseId, productId, attachmentId) {
  return axios.get(
    `${PROJECTS_API_URL}/v5/projects/${projectId}/phases/${phaseId}/products/${productId}/attachments/${attachmentId}`)
    .then(resp => resp.data.url)
}
