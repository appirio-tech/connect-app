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
  REMOVE_PROJECT_ATTACHMENT,
  UPDATE_PROJECT_ATTACHMENT,
  ADD_PRODUCT_ATTACHMENT,
  REMOVE_PRODUCT_ATTACHMENT,
  UPDATE_PRODUCT_ATTACHMENT,
} from '../../config/constants'

export function addProjectAttachment(projectId, attachment) {
  return (dispatch) => {
    return dispatch({
      type: ADD_PROJECT_ATTACHMENT,
      payload: addProjectAttachmentAPI(projectId, attachment)
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
