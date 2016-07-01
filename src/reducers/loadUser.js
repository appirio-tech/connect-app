import {
  LOAD_USER_SUCCESS, LOAD_USER_FAILURE
} from '../config/constants'

export const initialState = {
  userLoaded : false,
  user : null
}

export default function(state = initialState, action) {
  switch (action.type) {

  case LOAD_USER_SUCCESS:
    return Object.assign({}, state, {
      userLoaded : true,
      user : action.user
    })

  case LOAD_USER_FAILURE:
    return Object.assign({}, state, {
      userLoaded : false
    })

  default:
    return state
  }
}
