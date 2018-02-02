import keyBy from 'lodash/keyBy'
import update from 'react-addons-update'
import { LOAD_MEMBERS_PENDING, LOAD_MEMBERS_SUCCESS, LOAD_MEMBERS_FAILURE,
  LOAD_MEMBER_SUGGESTIONS_SUCCESS
} from '../config/constants'


const initialState = {
  isLoading: false,
  members: {}
}

export default function(state = initialState, action) {
  switch(action.type) {
  case LOAD_MEMBER_SUGGESTIONS_SUCCESS:
  case LOAD_MEMBERS_SUCCESS: {
    const _members = action.payload.filter(m => m.handle)
    const userMap = keyBy(_members, 'userId')
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
