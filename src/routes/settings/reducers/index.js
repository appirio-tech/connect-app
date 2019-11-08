/**
 * Settings related reducers
 */
import _ from 'lodash'
import {
  CHECK_EMAIL_AVAILABILITY_PENDING,
  CHECK_EMAIL_AVAILABILITY_SUCCESS,
  CHECK_EMAIL_AVAILABILITY_FAILURE,
  CHANGE_EMAIL_PENDING,
  CHANGE_EMAIL_SUCCESS,
  CHANGE_EMAIL_FAILURE,
  CHANGE_PASSWORD_PENDING,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAILURE,
  GET_NOTIFICATION_SETTINGS_PENDING,
  GET_NOTIFICATION_SETTINGS_SUCCESS,
  GET_NOTIFICATION_SETTINGS_FAILURE,
  SAVE_NOTIFICATION_SETTINGS_PENDING,
  SAVE_NOTIFICATION_SETTINGS_SUCCESS,
  SAVE_NOTIFICATION_SETTINGS_FAILURE,
  GET_PROFILE_SETTINGS_PENDING,
  GET_PROFILE_SETTINGS_SUCCESS,
  SAVE_PROFILE_SETTINGS_PENDING,
  GET_PROFILE_SETTINGS_FAILURE,
  SAVE_PROFILE_SETTINGS_SUCCESS,
  SAVE_PROFILE_SETTINGS_FAILURE,
  SAVE_PROFILE_PHOTO_PENDING,
  SAVE_PROFILE_PHOTO_SUCCESS,
  SAVE_PROFILE_PHOTO_FAILURE,
  GET_SYSTEM_SETTINGS_PENDING,
  GET_SYSTEM_SETTINGS_SUCCESS,
  GET_SYSTEM_SETTINGS_FAILURE,
  RESET_PASSWORD_PENDING,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
  CLEAR_PROFILE_SETTINGS_PHOTO,
} from '../../../config/constants'
import { applyProfileSettingsToTraits } from '../helpers/settings'

const initialState = {
  notifications: {
    settings: null,
    pending: false,
    isLoading: true,
    bundleEmail: '24h'
  },
  system: {
    isLoading: true,
    checkingEmail: null,
    checkedEmail: null,
    isEmailAvailable: undefined,
    checkingEmailError: null,
    emailSubmitted: false,
    isEmailChanging: false,
    isPasswordChanging: false,
    passwordSubmitted: false,
    isResettingPassword: false,
    passwordResetSubmitted: false,

    settings: {}
  },
  profile: {
    isLoading: true,
    isUploadingPhoto: false,
    pending: false,
    traits: [],
  }
}

export default (state = initialState, action) => {
  switch (action.type) {

  case GET_NOTIFICATION_SETTINGS_PENDING:
    return {...state,
      notifications: {...state.notifications,
        isLoading: true
      }
    }

  case GET_NOTIFICATION_SETTINGS_SUCCESS:
    return {...state,
      notifications: {...state.notifications,
        settings: action.payload.data,
        isLoading: false
      }
    }

  case GET_NOTIFICATION_SETTINGS_FAILURE:
    return {...state,
      notifications: {...state.notifications,
        isLoading: false
      }
    }

  case SAVE_NOTIFICATION_SETTINGS_PENDING:
    return {...state,
      notifications: {...state.notifications,
        pending: true
      }
    }

  case SAVE_NOTIFICATION_SETTINGS_SUCCESS:
  case SAVE_NOTIFICATION_SETTINGS_FAILURE:
    return {...state,
      notifications: {...state.notifications,
        settings: action.payload.data,
        pending: false
      }
    }

  case GET_SYSTEM_SETTINGS_PENDING:
    return {...state,
      system: {...state.system,
        isLoading: true
      }
    }

  case GET_SYSTEM_SETTINGS_SUCCESS:
    return {...state,
      system: {...state.system,
        isLoading: false,
        settings: action.payload.data
      }
    }

  case GET_SYSTEM_SETTINGS_FAILURE:
    return {...state,
      system: {...state.system,
        isLoading: false,
      }
    }

  case CHECK_EMAIL_AVAILABILITY_PENDING:
    return {...state,
      system: {...state.system,
        checkingEmail: action.payload.email,
        checkedEmail: null,
        isEmailAvailable: undefined,
        checkingEmailError: null,
        emailSubmitted: false,
      }
    }

  case CHECK_EMAIL_AVAILABILITY_SUCCESS:
    return {...state,
      // if we've got results for the email we were currently checking, then apply it
      system: state.system.checkingEmail === action.payload.email ? {...state.system,
        checkingEmail: null,
        checkedEmail: action.payload.email,
        isEmailAvailable: action.payload.isEmailAvailable,
        checkingEmailError: action.payload.isEmailAvailable ? null : action.payload.reason
      } : state.system
    }

  case CHECK_EMAIL_AVAILABILITY_FAILURE:
    return {...state,
      // if we've got an error for the email we were currently checking, then clear checkingEmail
      system: state.system.checkingEmail === action.payload.email ? {...state.system,
        checkingEmail: null,
        checkedEmail: action.payload.email,
        checkingEmailError: action.payload.error
      } : state.system
    }

  case CHANGE_EMAIL_PENDING:
    return {...state,
      system: {...state.system,
        isEmailChanging: true,
        emailSubmitted: false,
        checkedEmail: null,
        isEmailAvailable: undefined,
      }
    }

  case CHANGE_EMAIL_SUCCESS:
    return {...state,
      system: {...state.system,
        isEmailChanging: false,
        emailSubmitted: true,
        settings: action.payload.data
      }
    }

  case CHANGE_EMAIL_FAILURE:
    return {...state,
      system: {...state.system,
        isEmailChanging: false,
        emailSubmitted: false,
      }
    }

  case CHANGE_PASSWORD_PENDING:
    return {...state,
      system: {...state.system,
        isPasswordChanging: true,
        passwordSubmitted: false,
      }
    }

  case CHANGE_PASSWORD_SUCCESS:
    return {...state,
      system: {...state.system,
        passwordSubmitted: true,
        isPasswordChanging: false
      }
    }

  case CHANGE_PASSWORD_FAILURE:
    return {...state,
      system: {...state.system,
        passwordSubmitted: true,
        isPasswordChanging: false
      }
    }

  case RESET_PASSWORD_PENDING:
    return {...state,
      system: {...state.system,
        isResettingPassword: true,
        passwordResetSubmitted: false,
      }
    }

  case RESET_PASSWORD_SUCCESS:
    return {...state,
      system: {...state.system,
        isResettingPassword: false,
        passwordResetSubmitted: true,
      }
    }

  case RESET_PASSWORD_FAILURE:
    return {...state,
      system: {...state.system,
        isResettingPassword: false,
        passwordResetSubmitted: false,
      }
    }

  case GET_PROFILE_SETTINGS_PENDING:
    return {...state,
      profile: {...state.profile,
        isLoading: true
      }
    }

  case GET_PROFILE_SETTINGS_SUCCESS:
    return {...state,
      profile: {...state.profile,
        isLoading: false,
        traits: action.payload.data,
      }
    }

  case GET_PROFILE_SETTINGS_FAILURE:
    return {...state,
      profile: {...state.profile,
        isLoading: false,
      }
    }

  case SAVE_PROFILE_SETTINGS_PENDING:
    return {...state,
      profile: {...state.profile,
        pending: true,
      }
    }

  case SAVE_PROFILE_SETTINGS_SUCCESS:
    return {...state,
      profile: {...state.profile,
        pending: false,
        traits: action.payload.data
      }
    }

  case SAVE_PROFILE_SETTINGS_FAILURE:
    return {...state,
      profile: {...state.profile,
        pending: false,
      }
    }

  case SAVE_PROFILE_PHOTO_PENDING:
    return {...state,
      profile: {...state.profile,
        pending: true,
        isUploadingPhoto: true
      }
    }

  case CLEAR_PROFILE_SETTINGS_PHOTO:
  case SAVE_PROFILE_PHOTO_SUCCESS: {
    const updatedTraits = applyProfileSettingsToTraits(state.profile.traits, {
      photoUrl: _.get(action, 'payload.photoUrl', null),
    })

    return {...state,
      profile: {...state.profile,
        pending: false,
        isUploadingPhoto: false,
        traits: updatedTraits,
      }
    }
  }

  case SAVE_PROFILE_PHOTO_FAILURE:
    return {...state,
      profile: {...state.profile,
        pending: false,
        isUploadingPhoto: false
      }
    }

  default:
    return state
  }
}
