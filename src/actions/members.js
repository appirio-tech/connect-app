import _ from 'lodash'
import { LOAD_MEMBERS } from '../config/constants'
import { getMembersById } from '../api/projectMembers'

export function loadMembers(userIds) {
  return (dispatch, getState) => {
    // check if we need to request data from server
    const members = getState().members.members
    // this returns ids from userIds that are not in store (members)
    const missingUsers = _.difference(userIds, _.keys(members))
    // dispatch request to load members if we are missing data
    if (missingUsers.length) {
      return dispatch({
        type: LOAD_MEMBERS,
        payload: getMembersById(userIds)
      })
    } else {
      // returns empty resolved promise to avoid error when we call then on this action
      return Promise.resolve()
    }
  }
}
