import _ from 'lodash'
import {
  LOAD_USER_SUCCESS,
  LOAD_USER_FAILURE,
  LOAD_ORG_CONFIG_SUCCESS,
  LOAD_ORG_CONFIG_FAILURE,
  SAVE_PROFILE_PHOTO_SUCCESS,
  SAVE_PROFILE_SETTINGS_SUCCESS,
} from '../config/constants'

export const initialState = {
  isLoading : true,
  isLoggedIn: false,
  user : null,
  orgConfig: null
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

  // update user photo when it's updated in settings
  case SAVE_PROFILE_PHOTO_SUCCESS:
    return {
      ...state,
      user: {
        ...state.user,
        photoURL: action.payload.photoUrl
      }
    }

  // update user first and last name when it's updated in settings
  case SAVE_PROFILE_SETTINGS_SUCCESS: {
    const basicTrait = _.find(action.payload.data, { traitId: 'basic_info' })

    if (basicTrait) {
      const traitData = _.get(basicTrait, 'traits.data[0]')

      return {
        ...state,
        user: {
          ...state.user,
          firstName: traitData.firstName,
          lastName: traitData.lastName,
        }
      }
    }

    return state
  }

  // load organization configurations
  case LOAD_ORG_CONFIG_SUCCESS:
    return {
      ...state,
      orgConfig: action.orgConfig
    }

  case LOAD_ORG_CONFIG_FAILURE:
    return Object.assign({}, state, {
      orgConfig: []
    })

  default:
    return state
  }
}
