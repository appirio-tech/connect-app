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
  CHANGE_PASSWORD_FAILURE
} from '../../../config/constants'

// TODO initial state with mocked data for demo should be removed
// once service and actions are implemented
const initialState = {
  notifications: {
    system: {
      web: 'Always on',
      email: true
    },
    'member-added': {
      web: true,
      email: true
    },
    'new-project': {
      web: false,
      email: true
    },
    mention: {
      web: true,
      email: false
    },
    promotions: {
      web: '',
      email: true
    },
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
