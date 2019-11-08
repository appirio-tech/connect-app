import {
  addProjectAttachment as addProjectAttachmentAPI,
  removeProjectAttachment as removeProjectAttachmentAPI,
  updateProjectAttachment as updateProjectAttachmentAPI,
  // addProductAttachment as addProductAttachmentAPI,
  // removeProductAttachment as removeProductAttachmentAPI,
  // updateProductAttachment as updateProductAttachmentAPI,
} from '../../api/projectAttachments'

import {
  ADD_PROJECT_ATTACHMENT,
  DISCARD_PROJECT_ATTACHMENT,
  REMOVE_PROJECT_ATTACHMENT,
  UPDATE_PROJECT_ATTACHMENT,
  ADD_PRODUCT_ATTACHMENT,
  REMOVE_PRODUCT_ATTACHMENT,
  UPDATE_PRODUCT_ATTACHMENT,
  CHANGE_ATTACHMENT_PERMISSION,
  UPLOAD_PROJECT_ATTACHMENT_FILES,
  REMOVE_PENDING_ATTACHMENT,
  UPDATE_PENDING_ATTACHMENT,
} from '../../config/constants'

export function uploadProjectAttachments(projectId, attachments) {
  return dispatch => {
    return dispatch({
      type: UPLOAD_PROJECT_ATTACHMENT_FILES,
      payload: { attachments, projectId }
    })
  }
}

export function addProjectAttachment(projectId, attachment) {
  return (dispatch) => {
    return dispatch({
      type: ADD_PROJECT_ATTACHMENT,
      payload: addProjectAttachmentAPI(projectId, attachment)
    })
  }
}

export function changeAttachmentPermission(allowedUsers) {
  return dispatch => {
    return dispatch({
      type: CHANGE_ATTACHMENT_PERMISSION,
      payload: allowedUsers
    })
  }
}

export function discardAttachments() {
  return (dispatch) => {
    return dispatch({
      type: DISCARD_PROJECT_ATTACHMENT
    })
  }
}

export function updateProjectAttachment(projectId, attachmentId, attachment) {
  return (dispatch) => {
    return dispatch({
      type: UPDATE_PROJECT_ATTACHMENT,
      payload: updateProjectAttachmentAPI(projectId, attachmentId, attachment)
    })
  }
}

export function removeProjectAttachment(projectId, attachmentId) {
  return (dispatch) => {
    return dispatch({
      type: REMOVE_PROJECT_ATTACHMENT,
      payload: removeProjectAttachmentAPI(projectId, attachmentId)
    })
  }
}

export function addProductAttachment(projectId, phaseId, productId, attachment) {
  return (dispatch) => {
    return dispatch({
      type: ADD_PRODUCT_ATTACHMENT,
      payload: addProjectAttachmentAPI(projectId, attachment)
        .then((uploadedAttachment) => ({
          phaseId,
          productId,
          attachment: uploadedAttachment,
        }))
    })
  }
}

export function updateProductAttachment(projectId, phaseId, productId, attachmentId, attachment) {
  return (dispatch) => {
    return dispatch({
      type: UPDATE_PRODUCT_ATTACHMENT,
      payload: updateProjectAttachmentAPI(projectId, attachmentId, attachment)
        .then((uploadedAttachment) => ({
          phaseId,
          productId,
          attachment: uploadedAttachment,
        }))
    })
  }
}

export function removeProductAttachment(projectId, phaseId, productId, attachmentId) {
  return (dispatch) => {
    return dispatch({
      type: REMOVE_PRODUCT_ATTACHMENT,
      payload: removeProjectAttachmentAPI(projectId, attachmentId)
        .then((removedAttachmentId) => ({
          phaseId,
          productId,
          attachmentId: removedAttachmentId,
        }))
    })
  }
}

export function updatePendingAttachment(attachmentIdx, updatedAttachment) {
  return (dispatch) => {
    return dispatch({
      type: UPDATE_PENDING_ATTACHMENT,
      payload: { attachmentIdx, updatedAttachment }
    })
  }
}

export function removePendingAttachment(attachmentIdx) {
  return (dispatch) => {
    return dispatch({
      type: REMOVE_PENDING_ATTACHMENT,
      payload: attachmentIdx
    })
  }
}
