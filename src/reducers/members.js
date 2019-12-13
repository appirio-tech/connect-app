import _ from 'lodash'
import update from 'react-addons-update'
import { LOAD_MEMBERS_PENDING, LOAD_MEMBERS_SUCCESS, LOAD_MEMBERS_FAILURE,
  LOAD_MEMBER_SUGGESTIONS_SUCCESS,
  CONNECT_USER,
  CONNECT_USER_HANDLE,
  LOAD_USER_SUCCESS,
  CLEAR_MEMBER_SUGGESTIONS,
  LOAD_PROJECT_MEMBERS_SUCCESS,
  LOAD_PROJECT_MEMBER_INVITES_SUCCESS,
  LOAD_PROJECT_MEMBER_SUCCESS
} from '../config/constants'


const initialState = {
  isLoading: false,
  members: {},
  suggestedMembers: []
}

export default function(state = initialState, action) {
  switch(action.type) {
  case CLEAR_MEMBER_SUGGESTIONS:
    return Object.assign({}, state, {suggestedMembers: []})
  case LOAD_MEMBER_SUGGESTIONS_SUCCESS:
    return Object.assign({}, state, {suggestedMembers: action.payload})
  case LOAD_MEMBERS_SUCCESS: {
    const _members = _.map(_.filter(action.payload, m => m.userId), m => {
      if (m.handle) {
        return m
      }
      return { userId: m.userId, ...CONNECT_USER, handle: CONNECT_USER_HANDLE }
    })
    const userMap = _.keyBy(_members, 'userId')
    // merge the 2 data sets
    return Object.assign({}, state, {
      isLoading: false,
      members: update(state.members, {$merge: userMap})
    })
  }
  case LOAD_USER_SUCCESS: {
    const user = action.user
    const _members = [{
      userId: user.userId,
      handle: user.handle,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      photoURL: user.photoURL
    }]
    const userMap = _.keyBy(_members, 'userId')
    return Object.assign({}, state, {
      members: update(state.members, {$merge: userMap})
    })
  }
  case LOAD_MEMBERS_PENDING:
  case LOAD_MEMBERS_FAILURE:
    return state

  case LOAD_PROJECT_MEMBERS_SUCCESS:
  case LOAD_PROJECT_MEMBER_INVITES_SUCCESS: {
    const members = action.payload
    const _members = []
    _.forEach(members, (item) => _members.push(_.pick(item, 'userId', 'handle', 'firstName', 'lastName', 'photoURL')))
    const userMap = _.keyBy(_members, 'userId')
    return Object.assign({}, state, {
      members: update(state.members, {$merge: userMap})
    })
  }

  case LOAD_PROJECT_MEMBER_SUCCESS: {
    const _member = {
      userId: action.payload.userId,
      handle: action.payload.handle,
      firstName: action.payload.firstName,
      lastName: action.payload.lastName,
      photoURL: action.payload.photoURL
    }
    return Object.assign({}, state, {
      members: update(state.members, {$merge: {[_member.userId]: _member}})
    })
  }

  default:
    return state
  }
}
