import { addProjectMember as addMember,
  removeProjectMember as removeMember,
  updateProjectMember as updateMember,
  loadMemberSuggestions as loadMemberSuggestionsAPI
} from '../../api/projectMembers'
import { createProjectMemberInvite as createProjectMemberInvite,
  updateProjectMemberInvite as updateProjectMemberInvite
} from '../../api/projectMemberInvites'
import { getProjectById } from '../../api/projects'
import { loadMembers, loadMembersByHandle } from '../../actions/members'

import {ADD_PROJECT_MEMBER, REMOVE_PROJECT_MEMBER, UPDATE_PROJECT_MEMBER,
  LOAD_MEMBER_SUGGESTIONS,
  REMOVE_CUSTOMER_INVITE,
  INVITE_TOPCODER_MEMBER,
  REMOVE_TOPCODER_MEMBER_INVITE,
  INVITE_CUSTOMER,
  ACCEPT_OR_REFUSE_INVITE,
  PROJECT_ROLE_CUSTOMER,
  PROJECT_MEMBER_INVITE_STATUS_CANCELED,
  RELOAD_PROJECT_MEMBERS,
  CLEAR_MEMBER_SUGGESTIONS
} from '../../config/constants'


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
      .then((/*{value, action}*/) => {
        return resolve(dispatch(loadMembers([member.userId])))
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
      payload: updateMember(projectId, memberId, member)
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
    return dispatch(loadMembersByHandle(handles))
      .then(({ value }) => {
        const req = {}
        if(value && value.length > 0) {
          req.userIds = value.map(member => member.userId)
        }
        if(emailIds && emailIds.length > 0) {
          req.emails = emailIds
        }
        req.role = role
        createProjectMemberInvite(projectId, req)
          .then((res) => resolve(res))
          .catch(err => reject(err))
      })
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

function deleteTopcoderMemberInviteWithData(projectId, invite) {
  return new Promise((resolve, reject) => {
    const req = {}
    if(invite.item.email) {
      req.email = invite.item.email
    } else {
      req.userId = invite.item.userId
    }
    req.status = PROJECT_MEMBER_INVITE_STATUS_CANCELED
    updateProjectMemberInvite(projectId, req)
      .then((res) => resolve(res))
      .catch(err => reject(err))
  })
}

export function deleteTopcoderMemberInvite(projectId, invite) {
  return (dispatch) => {
    dispatch({
      type: REMOVE_TOPCODER_MEMBER_INVITE,
      payload: deleteTopcoderMemberInviteWithData(projectId, invite)
    })
  }
}

export function deleteProjectInvite(projectId, invite) {
  return (dispatch) => {
    dispatch({
      type: REMOVE_CUSTOMER_INVITE,
      payload: deleteTopcoderMemberInviteWithData(projectId, invite)
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

export function acceptOrRefuseInvite(projectId, item) {
  return (dispatch) => {
    return dispatch({
      type: ACCEPT_OR_REFUSE_INVITE,
      payload: updateProjectMemberInvite(projectId, item)
    })
  }
}

export function reloadProjectMembers(projectId) {
  return (dispatch) => {
    return dispatch({
      type: RELOAD_PROJECT_MEMBERS,
      payload: getProjectById(projectId)
    })
  }
}
