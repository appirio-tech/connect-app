import _ from 'lodash'
import { axiosInstance as axios } from './requestInterceptor'
import { PROJECTS_API_URL, FILE_PICKER_SUBMISSION_CONTAINER_NAME } from '../config/constants'

export function addProjectAttachment(projectId, fileData) {
  // add s3 bucket prop
  fileData.s3Bucket = FILE_PICKER_SUBMISSION_CONTAINER_NAME
  return axios.post(`${PROJECTS_API_URL}/v4/projects/${projectId}/attachments`, { param: fileData })
    .then( resp => {
      return _.get(resp.data, 'result.content', {})
    })
}

export function updateProjectAttachment(projectId, attachmentId, attachment) {
  return axios.patch(
    `${PROJECTS_API_URL}/v4/projects/${projectId}/attachments/${attachmentId}`,
    { param: attachment })
    .then ( resp => resp.data.result.content )
}

export function removeProjectAttachment(projectId, attachmentId) {
  // return attachmentId so reducer knows which one to remove from list
  return axios.delete(`${PROJECTS_API_URL}/v4/projects/${projectId}/attachments/${attachmentId}`)
    .then(() => attachmentId)
}
