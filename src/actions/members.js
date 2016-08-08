import _ from 'lodash'
import { axiosInstance as axios } from '../api/requestInterceptor'
import { LOAD_MEMBERS, INTERNAL_API } from '../config/constants'

const getMembers = userIds => {
  const _userIdArr = _.map(userIds, _id => `userId:${_id}`)
  // only requesting certain member attributes
  const fields = 'userId,handle,photoURL,firstName,lastName'
  const query = _userIdArr.join(' OR ')
  const url = `${INTERNAL_API}/members/_search/?fields=`
    + encodeURIComponent(fields)
    + `&query=${encodeURIComponent(query)}`
  return axios.get(url)
  .then(resp => {
    return resp.data.result.content
  })
}
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
        payload: getMembers(userIds)
      })
    }
  }
}
