import {
  LOAD_USER_SUCCESS, LOAD_USER_FAILURE
} from '../config/constants'

export const initialState = {
  isLoading : true,
  isLoggedIn: false,
  user : null
}

export default function(state = initialState, action) {
  switch (action.type) {

  case LOAD_USER_SUCCESS:
    return Object.assign({}, state, {
      isLoading : false,
      isLoggedIn: true,
      user : action.user
    })

  case LOAD_USER_FAILURE:
    return Object.assign({}, state, {
      isLoading : false,
      isLoggedIn: false
    })

  default:
    return state
  }
}
