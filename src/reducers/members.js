import _ from 'lodash'
import update from 'react-addons-update'
import { LOAD_MEMBERS_PENDING, LOAD_MEMBERS_SUCCESS, LOAD_MEMBERS_FAILURE } from '../config/constants'


const initialState = {
  isLoading: false,
  members: {}
}

export default function(state = initialState, action) {
  switch(action.type) {
  case LOAD_MEMBERS_SUCCESS: {
    const userMap = _.keyBy(action.payload, 'userId')
    // merge the 2 data sets
    return Object.assign({}, state, {
      isLoading: false,
      members: update(state.members, {$merge: userMap})
    })
  }
  case LOAD_MEMBERS_PENDING:
  case LOAD_MEMBERS_FAILURE:
    return state
  default:
    return state
  }
}
