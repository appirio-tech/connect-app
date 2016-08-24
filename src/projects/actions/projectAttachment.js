import { addProjectAttachment as addAttachment,
  removeProjectAttachment as removeAttachment,
  updateProjectAttachment as updateAttachment } from '../../api/projectAttachments'

import { ADD_PROJECT_ATTACHMENT, REMOVE_PROJECT_ATTACHMENT, UPDATE_PROJECT_ATTACHMENT } from '../../config/constants'


export function addProjectAttachment(projectId, attachment) {
  return (dispatch) => {
    return dispatch({
      type: ADD_PROJECT_ATTACHMENT,
      payload: addAttachment(projectId, attachment)
    })
  }
}

export function updateProjectAttachment(projectId, attachmentId, attachment) {
  return (dispatch) => {
    return dispatch({
      type: UPDATE_PROJECT_ATTACHMENT,
      payload: updateAttachment(projectId, attachmentId, attachment)
    })
  }
}

export function removeProjectAttachment(projectId, attachmentId) {
  return (dispatch) => {
    return dispatch({
      type: REMOVE_PROJECT_ATTACHMENT,
      payload: removeAttachment(projectId, attachmentId)
    })
  }
}
