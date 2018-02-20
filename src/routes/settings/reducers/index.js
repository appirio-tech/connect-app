/**
 * Settings related reducers
 */
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
  SAVE_NOTIFICATION_SETTINGS_FAILURE
} from '../../../config/constants'

// TODO initial state with mocked data for demo should be removed
// once service and actions are implemented
const initialState = {
  notifications: {
    settings: null,
    pending: false,
    isLoading: true,
    bundleEmail: '24h'
  },
  system: {
    email: 'p.monahan@incrediblereality.com'
  },
  profile: {
    username: 'pat_monahan',
    photoSrc: 'https://topcoder-dev-media.s3.amazonaws.com/member/profile/cp-superstar-1473358622637.png',
    firstname: 'Patrik',
    lastname: 'Monahan',
    company: 'Acme Corp.',
    mobilephone1: '+1 (555) 555-3240',
    mobilephone2: '+1 (555) 555-3240'
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

  case CHECK_EMAIL_AVAILABILITY_PENDING:
    return {...state,
      system: {...state.system,
        checkingEmail: action.payload.email,
        checkedEmail: null,
        isEmailAvailable: undefined,
        checkingEmailError: null
      }
    }

  case CHECK_EMAIL_AVAILABILITY_SUCCESS:
    return {...state,
      // if we've got results for the email we were currently checking, then apply it
      system: state.system.checkingEmail === action.payload.email ? {...state.system,
        checkingEmail: null,
        checkedEmail: action.payload.email,
        isEmailAvailable: action.payload.isEmailAvailable
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
        isEmailChanging: true
      }
    }

  case CHANGE_EMAIL_SUCCESS:
    return {...state,
      system: {...state.system,
        isEmailChanging: false,
        email: action.payload.email
      }
    }

  case CHANGE_EMAIL_FAILURE:
    return {...state,
      system: {...state.system,
        isEmailChanging: false
      }
    }

  case CHANGE_PASSWORD_PENDING:
    return {...state,
      system: {...state.system,
        isPasswordChanging: true
      }
    }

  case CHANGE_PASSWORD_SUCCESS:
  case CHANGE_PASSWORD_FAILURE:
    return {...state,
      system: {...state.system,
        isPasswordChanging: false
      }
    }

  default:
    return state
  }
}
