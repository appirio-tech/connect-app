import { addProjectMember as addMember,
  removeProjectMember as removeMember,
  updateProjectMember as updateMember,
  loadMemberSuggestions as loadMemberSuggestionsAPI,
} from '../../api/projectMembers'
import { createProjectMemberInvite as createProjectMemberInvite,
  updateProjectMemberInvite as updateProjectMemberInvite,
  deleteProjectMemberInvite as deleteProjectMemberInvite,
} from '../../api/projectMemberInvites'
import { loadProjectMember, loadProjectMembers } from './project'

import {ADD_PROJECT_MEMBER, REMOVE_PROJECT_MEMBER, UPDATE_PROJECT_MEMBER,
  LOAD_MEMBER_SUGGESTIONS,
  REMOVE_CUSTOMER_INVITE,
  INVITE_TOPCODER_MEMBER,
  REMOVE_TOPCODER_MEMBER_INVITE,
  INVITE_CUSTOMER,
  ACCEPT_OR_REFUSE_INVITE,
  PROJECT_ROLE_CUSTOMER,
  CLEAR_MEMBER_SUGGESTIONS,
  ES_REINDEX_DELAY,
  PROJECT_MEMBER_INVITE_STATUS_REQUEST_APPROVED,
} from '../../config/constants'
import { delay } from '../../helpers/utils'


export function memberSuggestionsDispatch(dispatch) {
  return (value) => {
    return dispatch({
      type: LOAD_MEMBER_SUGGESTIONS,
      payload: loadMemberSuggestionsAPI(value)
    })
  }
}

export function loadMemberSuggestions(value) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_MEMBER_SUGGESTIONS,
      payload: loadMemberSuggestionsAPI(value)
    })
  }
}

export function clearMemberSuggestions(dispatch) {
  return dispatch({
    type: CLEAR_MEMBER_SUGGESTIONS
  })
}

function addProjectMemberWithData(dispatch, projectId, member) {
  return new Promise((resolve, reject) => {
    return dispatch({
      type: ADD_PROJECT_MEMBER,
      payload: addMember(projectId, {role: member.role})
    })
      .then(({value: newMember}) => {
        return resolve(dispatch(loadProjectMember(projectId, newMember.id)))
      })
      .catch(err => reject(err))
  })
}

export function addProjectMember(projectId, member) {
  return (dispatch) => {
    return dispatch({
      type: 'ADD_PROJECT_MEMBER_INIT',
      payload: addProjectMemberWithData(dispatch, projectId, member)
    })
  }
}

export function updateProjectMember(projectId, memberId, member) {
  return (dispatch) => {
    return dispatch({
      type: UPDATE_PROJECT_MEMBER,
      payload: updateMember(projectId, memberId, member),
      meta: { memberId }
    })
  }
}

export function removeProjectMember(projectId, memberId, isUserLeaving) {
  return (dispatch) => {
    return dispatch({
      type: REMOVE_PROJECT_MEMBER,
      payload: removeMember(projectId, memberId),
      meta: { isUserLeaving }
    })
  }
}

function inviteMembersWithData(dispatch, projectId, emailIds, handles, role) {
  return new Promise((resolve, reject) => {
    // remove `@` from handles before making a request to the server as server may not support format with `@`
    const clearedHandles = handles ? handles.map(handle => handle.replace(/^@/, '')) : []
    const req = {}
    if(clearedHandles && clearedHandles.length > 0) {
      req.handles = clearedHandles
    }
    if(emailIds && emailIds.length > 0) {
      req.emails = emailIds
    }
    req.role = role
    createProjectMemberInvite(projectId, req)
      .then((res) => resolve(res))
      .catch(err => reject(err))
  })
}

export function inviteTopcoderMembers(projectId, items) {
  return (dispatch) => {
    return dispatch({
      type: INVITE_TOPCODER_MEMBER,
      payload: inviteMembersWithData(dispatch, projectId, items.emails, items.handles, items.role)
    })
  }
}

export function deleteTopcoderMemberInvite(projectId, invite) {
  return (dispatch) => {
    dispatch({
      type: REMOVE_TOPCODER_MEMBER_INVITE,
      payload: deleteProjectMemberInvite(projectId, invite.item.id),
      meta: { inviteId: invite.item.id }
    })
  }
}

export function deleteProjectInvite(projectId, invite) {
  return (dispatch) => {
    dispatch({
      type: REMOVE_CUSTOMER_INVITE,
      payload: deleteProjectMemberInvite(projectId, invite.item.id),
      meta: { inviteId: invite.item.id }
    })
  }
}

export function inviteProjectMembers(projectId, emailIds, handles) {
  return (dispatch) => {
    return dispatch({
      type: INVITE_CUSTOMER,
      payload: inviteMembersWithData(dispatch, projectId, emailIds, handles, PROJECT_ROLE_CUSTOMER)
    })
  }
}

/**
 * Accept or refuse invite
 * @param {Number} projectId project id
 * @param {Object} item accept or refuse invite info
 * @param {Object} currentUser current user info
 */
export function acceptOrRefuseInvite(projectId, item, currentUser) {
  return (dispatch, getState) => {
    const projectState = getState().projectState
    const inviteId = item.id ? item.id : projectState.userInvitationId
    return dispatch({
      type: ACCEPT_OR_REFUSE_INVITE,
      payload: updateProjectMemberInvite(projectId, inviteId, item.status).then(response => {
        // we have to add delay before applying the result of accepting/declining invitation
        // as it takes some time for the update to be reindexed in ES so the new state is reflected
        // everywhere
        // if request is accepted, then also refresh project members
        const inviteAccepted = item.status === PROJECT_MEMBER_INVITE_STATUS_REQUEST_APPROVED
        return delay(ES_REINDEX_DELAY).then(() => inviteAccepted ? dispatch(loadProjectMembers(projectId)) : response)
      }),
      meta: { projectId, inviteId, currentUser },
    })
  }
}
